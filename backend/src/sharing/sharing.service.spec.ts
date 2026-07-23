import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SharingService } from './sharing.service';
import { SharingRepository } from './sharing.repository';
import { PhotosRepository } from '../photos/photos.repository';
import { AlbumsRepository } from '../albums/albums.repository';
import { StorageService } from '../storage/storage.service';
import { StorageConfigRepository } from '../storage-config/storage-config.repository';

describe('SharingService', () => {
  let service: SharingService;
  let sharingRepository: jest.Mocked<SharingRepository>;
  let photosRepository: jest.Mocked<PhotosRepository>;
  let albumsRepository: jest.Mocked<AlbumsRepository>;
  let storageService: jest.Mocked<StorageService>;
  let storageConfigRepository: jest.Mocked<StorageConfigRepository>;

  const userId = 'user-id-123';
  const photoId = 'photo-id-123';
  const albumId = 'album-id-123';
  const token = 'share-token-123';

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

  const mockAlbum = {
    id: albumId,
    userId,
    name: 'Vacances',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockShareLink = {
    id: 'link-id-123',
    userId,
    photoId,
    albumId: null,
    token,
    expiresAt: null,
    createdAt: new Date(),
  };

  // Provider factice retourné par getProvider(), qui expose getSignedUrl()
  const mockProvider = {
    getSignedUrl: jest.fn().mockResolvedValue('https://signed-url.com'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharingService,
        {
          provide: SharingRepository,
          useValue: {
            createPhotoShareLink: jest.fn(),
            createAlbumShareLink: jest.fn(),
            findByToken: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: PhotosRepository,
          useValue: { findById: jest.fn() },
        },
        {
          provide: AlbumsRepository,
          useValue: { findById: jest.fn(), findPhotosInAlbum: jest.fn() },
        },
        {
          provide: StorageService,
          useValue: { getProvider: jest.fn().mockReturnValue(mockProvider) },
        },
        {
          provide: StorageConfigRepository,
          useValue: { findByUserId: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<SharingService>(SharingService);
    sharingRepository = module.get(SharingRepository);
    photosRepository = module.get(PhotosRepository);
    albumsRepository = module.get(AlbumsRepository);
    storageService = module.get(StorageService);
    storageConfigRepository = module.get(StorageConfigRepository);

    jest.clearAllMocks();
    mockProvider.getSignedUrl.mockResolvedValue('https://signed-url.com');
    storageConfigRepository.findByUserId.mockResolvedValue(undefined as any);
    storageService.getProvider.mockReturnValue(mockProvider as any);
  });

  describe('createPhotoShareLink', () => {
    it('devrait créer un lien de partage pour une photo', async () => {
      photosRepository.findById.mockResolvedValue(mockPhoto);
      sharingRepository.createPhotoShareLink.mockResolvedValue(mockShareLink);

      const result = await service.createPhotoShareLink(userId, photoId, {});

      expect(result).toHaveProperty('token', token);
      expect(result).toHaveProperty('url');
    });

    it("devrait rejeter si la photo n'existe pas", async () => {
      photosRepository.findById.mockResolvedValue(undefined as any);

      await expect(
        service.createPhotoShareLink(userId, photoId, {}),
      ).rejects.toThrow(NotFoundException);
    });

    it("devrait rejeter si l'utilisateur n'est pas propriétaire", async () => {
      photosRepository.findById.mockResolvedValue({
        ...mockPhoto,
        userId: 'other-user-id',
      });

      await expect(
        service.createPhotoShareLink(userId, photoId, {}),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('createAlbumShareLink', () => {
    it('devrait créer un lien de partage pour un album', async () => {
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      sharingRepository.createAlbumShareLink.mockResolvedValue({
        ...mockShareLink,
        photoId: null,
        albumId,
      });

      const result = await service.createAlbumShareLink(userId, albumId, {});

      expect(result).toHaveProperty('token');
    });

    it("devrait rejeter si l'album n'existe pas", async () => {
      albumsRepository.findById.mockResolvedValue(undefined as any);

      await expect(
        service.createAlbumShareLink(userId, albumId, {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSharedResource', () => {
    it('devrait retourner une photo partagée', async () => {
      sharingRepository.findByToken.mockResolvedValue(mockShareLink);
      photosRepository.findById.mockResolvedValue(mockPhoto);

      const result = await service.getSharedResource(token);

      expect(result.type).toBe('photo');
      expect(result.resource).toHaveProperty('url');
      expect(storageService.getProvider).toHaveBeenCalledWith(
        mockPhoto.storageMode,
        undefined,
      );
    });

    it('devrait retourner un album partagé avec ses photos', async () => {
      sharingRepository.findByToken.mockResolvedValue({
        ...mockShareLink,
        photoId: null,
        albumId,
      });
      albumsRepository.findById.mockResolvedValue(mockAlbum);
      albumsRepository.findPhotosInAlbum.mockResolvedValue([mockPhoto]);

      const result = await service.getSharedResource(token);

      expect(result.type).toBe('album');
      expect((result.resource as any).photos).toHaveLength(1);
    });

    it('devrait rejeter si le lien est introuvable', async () => {
      sharingRepository.findByToken.mockResolvedValue(undefined as any);

      await expect(service.getSharedResource(token)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait rejeter si le lien est expiré', async () => {
      sharingRepository.findByToken.mockResolvedValue({
        ...mockShareLink,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.getSharedResource(token)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('revokeShareLink', () => {
    it('devrait révoquer un lien de partage', async () => {
      sharingRepository.findByToken.mockResolvedValue(mockShareLink);
      sharingRepository.delete.mockResolvedValue(undefined);

      const result = await service.revokeShareLink(userId, token);

      expect(sharingRepository.delete).toHaveBeenCalledWith(mockShareLink.id);
      expect(result).toEqual({ message: 'Lien de partage révoqué' });
    });

    it("devrait rejeter si l'utilisateur n'est pas propriétaire", async () => {
      sharingRepository.findByToken.mockResolvedValue({
        ...mockShareLink,
        userId: 'other-user-id',
      });

      await expect(service.revokeShareLink(userId, token)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
