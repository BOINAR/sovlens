import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SharingRepository } from './sharing.repository';
import { PhotosRepository } from '../photos/photos.repository';
import { AlbumsRepository } from '../albums/albums.repository';
import { StorageService } from '../storage/storage.service';
import { CreateShareLinkInput } from './sharing.validation';
import { randomUUID } from 'crypto';

@Injectable()
export class SharingService {
  constructor(
    private readonly sharingRepository: SharingRepository,
    private readonly photosRepository: PhotosRepository,
    private readonly albumsRepository: AlbumsRepository,
    private readonly storageService: StorageService,
  ) {}

  async createPhotoShareLink(
    userId: string,
    photoId: string,
    data: CreateShareLinkInput,
  ) {
    const photo = await this.photosRepository.findById(photoId);

    if (!photo) {
      throw new NotFoundException('Photo introuvable');
    }

    if (photo.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const token = randomUUID();
    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    const link = await this.sharingRepository.createPhotoShareLink(
      userId,
      photoId,
      token,
      expiresAt,
    );

    return {
      token: link.token,
      url: `${process.env.FRONTEND_URL}/share/${link.token}`,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    };
  }

  async createAlbumShareLink(
    userId: string,
    albumId: string,
    data: CreateShareLinkInput,
  ) {
    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new NotFoundException('Album introuvable');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const token = randomUUID();
    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;

    const link = await this.sharingRepository.createAlbumShareLink(
      userId,
      albumId,
      token,
      expiresAt,
    );

    return {
      token: link.token,
      url: `${process.env.FRONTEND_URL}/share/${link.token}`,
      expiresAt: link.expiresAt,
      createdAt: link.createdAt,
    };
  }

  async getSharedResource(token: string) {
    const link = await this.sharingRepository.findByToken(token);

    if (!link) {
      throw new NotFoundException('Lien de partage introuvable');
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new NotFoundException('Lien de partage expiré');
    }

    if (link.photoId) {
      const photo = await this.photosRepository.findById(link.photoId);
      if (!photo) throw new NotFoundException('Photo introuvable');

      const url = await this.storageService.getSignedUrl(photo.objectKey);
      return { type: 'photo', resource: { ...photo, url } };
    }

    if (link.albumId) {
      const album = await this.albumsRepository.findById(link.albumId);
      if (!album) throw new NotFoundException('Album introuvable');

      const photos = await this.albumsRepository.findPhotosInAlbum(link.albumId);
      const photosWithUrls = await Promise.all(
        photos.map(async (photo) => ({
          ...photo,
          url: await this.storageService.getSignedUrl(photo.objectKey),
        })),
      );

      return { type: 'album', resource: { ...album, photos: photosWithUrls } };
    }

    throw new NotFoundException('Ressource introuvable');
  }

  async revokeShareLink(userId: string, token: string) {
    const link = await this.sharingRepository.findByToken(token);

    if (!link) {
      throw new NotFoundException('Lien de partage introuvable');
    }

    if (link.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    await this.sharingRepository.delete(link.id);
    return { message: 'Lien de partage révoqué' };
  }

  async listMyShareLinks(userId: string) {
    const links = await this.sharingRepository.findAllByUserId(userId);

    return Promise.all(
      links.map(async (link) => {
        const now = new Date();
        const status = link.expiresAt && now > link.expiresAt ? 'expired' : 'active';

        if (link.photoId) {
          const photo = await this.photosRepository.findById(link.photoId);
          return {
            token: link.token,
            url: `${process.env.FRONTEND_URL}/share/${link.token}`,
            type: 'photo' as const,
            name: photo?.filename ?? 'Photo supprimée',
            storageMode: photo?.storageMode ?? null,
            status,
            expiresAt: link.expiresAt,
            createdAt: link.createdAt,
          };
        }

        const album = link.albumId
          ? await this.albumsRepository.findById(link.albumId)
          : null;
        return {
          token: link.token,
          url: `${process.env.FRONTEND_URL}/share/${link.token}`,
          type: 'album' as const,
          name: album?.name ?? 'Album supprimé',
          storageMode: null,
          status,
          expiresAt: link.expiresAt,
          createdAt: link.createdAt,
        };
      }),
    );
  }
}