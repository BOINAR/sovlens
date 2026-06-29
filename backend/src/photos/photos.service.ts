import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PhotosRepository } from './photos.repository';
import { StorageService } from '../storage/storage.service';
import { randomUUID } from 'crypto';

@Injectable()
export class PhotosService {
  constructor(
    private readonly photosRepository: PhotosRepository,
    private readonly storageService: StorageService,
  ) {}

  async upload(
    userId: string,
    file: Buffer,
    originalName: string,
    mimeType: string,
    size: number,
  ) {
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException('Format non supporté');
    }

    if (size > MAX_SIZE) {
      throw new BadRequestException('La photo ne doit pas dépasser 10MB');
    }

    // Génère une clé unique pour S3 — on préfixe avec l'userId pour organiser les fichiers
    const extension = originalName.split('.').pop();
    const objectKey = `${userId}/${randomUUID()}.${extension}`;

    await this.storageService.upload(file, objectKey, mimeType);

    const photo = await this.photosRepository.create({
      userId,
      filename: objectKey.split('/').pop()!,
      originalName,
      mimeType,
      size,
      objectKey,
      storageMode: 'cloud',
    });

    return photo;
  }
  
  async download(userId: string, photoId: string) {
  const photo = await this.photosRepository.findById(photoId);

  if (!photo) {
    throw new NotFoundException('Photo introuvable');
  }

  if (photo.userId !== userId) {
    throw new ForbiddenException('Accès refusé');
  }

  const stream = await this.storageService.getStream(photo.objectKey);
  return { stream, photo };
}

  async findAll(userId: string) {
    const photos = await this.photosRepository.findAllByUserId(userId);

    // Génère une URL signée pour chaque photo
    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await this.storageService.getSignedUrl(photo.objectKey),
      })),
    );

    return photosWithUrls;
  }

  async findOne(userId: string, photoId: string) {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new NotFoundException('Photo introuvable');
    }

    if (photo.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const url = await this.storageService.getSignedUrl(photo.objectKey);
    return { ...photo, url };
  }

  async delete(userId: string, photoId: string) {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new NotFoundException('Photo introuvable');
    }

    if (photo.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    await this.storageService.delete(photo.objectKey);
    await this.photosRepository.delete(photoId);

    return { message: 'Photo supprimée avec succès' };
  }
}