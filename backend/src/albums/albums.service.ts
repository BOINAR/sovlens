import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AlbumsRepository } from './albums.repository';
import { PhotosRepository } from '../photos/photos.repository';
import {
  CreateAlbumInput,
  UpdateAlbumInput,
  AddPhotoToAlbumInput,
} from './albums.validation';

@Injectable()
export class AlbumsService {
  constructor(
    private readonly albumsRepository: AlbumsRepository,
    private readonly photosRepository: PhotosRepository,
  ) {}

  async create(userId: string, data: CreateAlbumInput) {
    return this.albumsRepository.create(userId, data.name);
  }

  async findAll(userId: string) {
    const albums = await this.albumsRepository.findAllByUserId(userId);
    return Promise.all(
      albums.map(async (album) => ({
        ...album,
        photos: await this.albumsRepository.findPhotosInAlbum(album.id),
      })),
    );
  }

  async findOne(userId: string, albumId: string) {
    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new NotFoundException('Album introuvable');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const photos = await this.albumsRepository.findPhotosInAlbum(albumId);
    return { ...album, photos };
  }

  async update(userId: string, albumId: string, data: UpdateAlbumInput) {
    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new NotFoundException('Album introuvable');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    return this.albumsRepository.update(albumId, data.name);
  }

  async delete(userId: string, albumId: string) {
    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new NotFoundException('Album introuvable');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    await this.albumsRepository.delete(albumId);
    return { message: 'Album supprimé avec succès' };
  }

  async addPhoto(userId: string, albumId: string, data: AddPhotoToAlbumInput) {
    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new NotFoundException('Album introuvable');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const photo = await this.photosRepository.findById(data.photoId);

    if (!photo) {
      throw new NotFoundException('Photo introuvable');
    }

    if (photo.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const alreadyInAlbum = await this.albumsRepository.photoExistsInAlbum(
      albumId,
      data.photoId,
    );

    if (alreadyInAlbum) {
      throw new BadRequestException("Cette photo est déjà dans l'album");
    }

    await this.albumsRepository.addPhoto(albumId, data.photoId);
    return this.findOne(userId, albumId);
  }

  async removePhoto(userId: string, albumId: string, photoId: string) {
    const album = await this.albumsRepository.findById(albumId);

    if (!album) {
      throw new NotFoundException('Album introuvable');
    }

    if (album.userId !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const inAlbum = await this.albumsRepository.photoExistsInAlbum(
      albumId,
      photoId,
    );

    if (!inAlbum) {
      throw new NotFoundException('Photo introuvable dans cet album');
    }

    await this.albumsRepository.removePhoto(albumId, photoId);
    return { message: "Photo retirée de l'album" };
  }
}
