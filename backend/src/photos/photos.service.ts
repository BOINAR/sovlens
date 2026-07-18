import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PhotosRepository } from './photos.repository';
import { StorageService } from '../storage/storage.service';
import { StorageConfigRepository } from '../storage-config/storage-config.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class PhotosService {
  constructor(
    private readonly photosRepository: PhotosRepository,
    private readonly storageService: StorageService,
    private readonly storageConfigRepository: StorageConfigRepository,
  ) {}

  private async getProvider(userId: string) {
    const profile = await this.storageConfigRepository.findByUserId(userId);
    return this.storageService.getProvider(profile ?? undefined);
  }

  async upload(
    userId: string,
    file: Buffer,
    originalName: string,
    mimeType: string,
    size: number,
  ) {
    const ALLOWED_MIME_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    const MAX_SIZE = 10 * 1024 * 1024;

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException('Format non supporté');
    }

    if (size > MAX_SIZE) {
      throw new BadRequestException('La photo ne doit pas dépasser 10MB');
    }

    const profile = await this.storageConfigRepository.findByUserId(userId);
    const provider = this.storageService.getProvider(profile ?? undefined);
    const storageMode = profile?.mode === 'sovereign' ? 'sovereign' : 'cloud';

    const extension = originalName.split('.').pop();
    const objectKey = `${userId}/${randomUUID()}.${extension}`;

    await provider.upload(file, objectKey, mimeType);

    const photo = await this.photosRepository.create({
      userId,
      filename: objectKey.split('/').pop()!,
      originalName,
      mimeType,
      size,
      objectKey,
      storageMode,
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

    const provider = await this.getProvider(userId);
    const stream = await provider.getStream(photo.objectKey);
    return { stream, photo };
  }

  async findAll(userId: string) {
    const photos = await this.photosRepository.findAllByUserId(userId);
    const provider = await this.getProvider(userId);

    const photosWithUrls = await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await provider.getSignedUrl(photo.objectKey),
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

    const provider = await this.getProvider(userId);
    const url = await provider.getSignedUrl(photo.objectKey);
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

    const provider = await this.getProvider(userId);
    await provider.delete(photo.objectKey);
    await this.photosRepository.delete(photoId);

    return { message: 'Photo supprimée avec succès' };
  }
}
