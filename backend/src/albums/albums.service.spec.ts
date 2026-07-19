import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsRepository } from './albums.repository';
import { PhotosRepository } from '../photos/photos.repository';
import { StorageService } from '../storage/storage.service';
import { StorageConfigRepository } from '../storage-config/storage-config.repository';

describe('AlbumsService', () => {
  let service: AlbumsService;
  let albumsRepository: jest.Mocked<AlbumsRepository>;
  let photosRepository: jest.Mocked<PhotosRepository>;

  const userId = 'user-id-123';
  const albumId = 'album-id-123';
  const photoId = 'photo-id-123';

  const mockAlbum = {
    id: albumId,
    userId,
    name: 'Vacances été',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPhoto = {
    id: photoId,
    userId,
    filename: 'test.webp',
    originalName: 'test.webp',
    mimeType: 'image/webp',
    size: 1000,
    objectKey: `${userId}/test.webp`,
    storageMode: 'cloud' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: AlbumsRepository,
          useValue: {
            create: jest.fn(),
            findAllByUserId: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addPhoto: jest.fn(),
            removePhoto: jest.fn(),
            findPhotosInAlbum: jest.fn(),
            photoExistsInAlbum: jest.fn(),
          },
        },
        {
          provide: PhotosRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getProvider: jest.fn().mockReturnValue({
              getSignedUrl: jest
                .fn()
                .mockResolvedValue('https://example.com/test.webp'),
            }),
          },
        },
        {
          provide: StorageConfigRepository,
          useValue: {
            findByUserId: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    albumsRepository = module.get(AlbumsRepository);
    photosRepository = module.get(PhotosRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer un album', async () => {
      albumsRepository.create.mockResolvedValue(mockAlbum);

      const result = await service.create(userId, { name: 'Vacances été' });

      expect(albumsRepository.create).toHaveBeenCalledWith(
        userId,
        'Vacances été',
      );
      expect(result).toEqual(mockAlbum);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un album avec ses photos', async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      albumsRepository.findPhotosInAlbum.mockResolvedValue([mockPhoto]);

      const result = await service.findOne(userId, albumId);

      expect(result).toHaveProperty('photos');
      expect(result.photos).toHaveLength(1);
      expect(result.photos[0].url).toBe(
        'https://example.com/test.webp',
      );
    });

    it("devrait rejeter si l'album n'existe pas", async () => {
      albumsRepository.findById.mockResolvedValue(undefined as any);

      await expect(service.findOne(userId, albumId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("devrait rejeter si l'album appartient à un autre utilisateur", async () => {
      albumsRepository.findById.mockResolvedValue({
        ...mockAlbum,
        userId: 'other-user-id',
      });

      await expect(service.findOne(userId, albumId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it("devrait mettre à jour le nom de l'album", async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      albumsRepository.update.mockResolvedValue({
        ...mockAlbum,
        name: 'Nouveau nom',
      });

      const result = await service.update(userId, albumId, {
        name: 'Nouveau nom',
      });

      expect(albumsRepository.update).toHaveBeenCalledWith(
        albumId,
        'Nouveau nom',
      );
      expect(result.name).toBe('Nouveau nom');
    });

    it("devrait rejeter si l'utilisateur n'est pas propriétaire", async () => {
      albumsRepository.findById.mockResolvedValue({
        ...mockAlbum,
        userId: 'other-user-id',
      });

      await expect(
        service.update(userId, albumId, { name: 'Nouveau nom' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('devrait supprimer un album', async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      albumsRepository.delete.mockResolvedValue(mockAlbum);

      const result = await service.delete(userId, albumId);

      expect(albumsRepository.delete).toHaveBeenCalledWith(albumId);
      expect(result).toEqual({ message: 'Album supprimé avec succès' });
    });

    it("devrait rejeter si l'album n'existe pas", async () => {
      albumsRepository.findById.mockResolvedValue(undefined as any);

      await expect(service.delete(userId, albumId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addPhoto', () => {
    it("devrait ajouter une photo à l'album", async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      photosRepository.findById.mockResolvedValue(mockPhoto);
      albumsRepository.photoExistsInAlbum.mockResolvedValue(false);
      albumsRepository.addPhoto.mockResolvedValue({} as any);
      albumsRepository.findPhotosInAlbum.mockResolvedValue([mockPhoto]);

      const result = await service.addPhoto(userId, albumId, { photoId });

      expect(albumsRepository.addPhoto).toHaveBeenCalledWith(
        albumId,
        photoId,
      );
      expect(result).toHaveProperty('photos');
      expect(result.photos).toHaveLength(1);
      expect(result.photos[0].url).toBe(
        'https://example.com/test.webp',
      );
    });

    it("devrait rejeter si la photo n'existe pas", async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      photosRepository.findById.mockResolvedValue(undefined as any);

      await expect(
        service.addPhoto(userId, albumId, { photoId }),
      ).rejects.toThrow(NotFoundException);
    });

    it('devrait rejeter si la photo appartient à un autre utilisateur', async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      photosRepository.findById.mockResolvedValue({
        ...mockPhoto,
        userId: 'other-user-id',
      });

      await expect(
        service.addPhoto(userId, albumId, { photoId }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("devrait rejeter si la photo est déjà dans l'album", async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      photosRepository.findById.mockResolvedValue(mockPhoto);
      albumsRepository.photoExistsInAlbum.mockResolvedValue(true);

      await expect(
        service.addPhoto(userId, albumId, { photoId }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('removePhoto', () => {
    it("devrait retirer une photo de l'album", async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      albumsRepository.photoExistsInAlbum.mockResolvedValue(true);
      albumsRepository.removePhoto.mockResolvedValue(undefined);

      const result = await service.removePhoto(
        userId,
        albumId,
        photoId,
      );

      expect(albumsRepository.removePhoto).toHaveBeenCalledWith(
        albumId,
        photoId,
      );
      expect(result).toEqual({
        message: "Photo retirée de l'album",
      });
    });

    it("devrait rejeter si la photo n'est pas dans l'album", async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      albumsRepository.photoExistsInAlbum.mockResolvedValue(false);

      await expect(
        service.removePhoto(userId, albumId, photoId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});