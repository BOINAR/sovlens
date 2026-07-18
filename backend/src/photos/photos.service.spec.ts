import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosRepository } from './photos.repository';
import { StorageService } from '../storage/storage.service';
import { StorageConfigRepository } from '../storage-config/storage-config.repository';

describe('PhotosService', () => {
  let service: PhotosService;
  let photosRepository: jest.Mocked<PhotosRepository>;
  let storageService: jest.Mocked<StorageService>;
  let storageConfigRepository: jest.Mocked<StorageConfigRepository>;

  const userId = 'user-id-123';
  const mockPhoto = {
    id: 'photo-id-123',
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

  const mockProvider = {
    upload: jest.fn(),
    delete: jest.fn(),
    getSignedUrl: jest.fn(),
    getStream: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: PhotosRepository,
          useValue: {
            create: jest.fn(),
            findAllByUserId: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getProvider: jest.fn().mockReturnValue(mockProvider),
          },
        },
        {
          provide: StorageConfigRepository,
          useValue: {
            findByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    photosRepository = module.get(PhotosRepository);
    storageService = module.get(StorageService);
    storageConfigRepository = module.get(StorageConfigRepository);

    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('devrait uploader une photo en mode cloud par défaut', async () => {
      storageConfigRepository.findByUserId.mockResolvedValue(undefined as any);
      storageService.getProvider.mockReturnValue(mockProvider);
      mockProvider.upload.mockResolvedValue('object-key');
      photosRepository.create.mockResolvedValue(mockPhoto);

      const file = Buffer.from('fake-image-data');
      const result = await service.upload(
        userId,
        file,
        'photo.webp',
        'image/webp',
        1000,
      );

      expect(mockProvider.upload).toHaveBeenCalled();
      expect(photosRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId, storageMode: 'cloud' }),
      );
      expect(result).toEqual(mockPhoto);
    });

    it('devrait uploader en mode souverain si configuré', async () => {
      storageConfigRepository.findByUserId.mockResolvedValue({
        id: 'profile-id',
        userId,
        mode: 'sovereign',
        endpoint: 'http://test.com',
        accessKey: 'key',
        secretKey: 'secret',
        bucket: 'bucket',
        updatedAt: new Date(),
      } as any);
      mockProvider.upload.mockResolvedValue('object-key');
      photosRepository.create.mockResolvedValue({
        ...mockPhoto,
        storageMode: 'sovereign',
      });

      const file = Buffer.from('fake-image-data');
      await service.upload(userId, file, 'photo.webp', 'image/webp', 1000);

      expect(photosRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ storageMode: 'sovereign' }),
      );
    });

    it('devrait rejeter un format non supporté', async () => {
      const file = Buffer.from('fake-data');

      await expect(
        service.upload(userId, file, 'document.pdf', 'application/pdf', 1000),
      ).rejects.toThrow(BadRequestException);

      expect(photosRepository.create).not.toHaveBeenCalled();
    });

    it('devrait rejeter un fichier trop volumineux', async () => {
      const file = Buffer.from('fake-data');
      const tooLarge = 11 * 1024 * 1024;

      await expect(
        service.upload(userId, file, 'photo.webp', 'image/webp', tooLarge),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('devrait retourner les photos avec URLs signées', async () => {
      storageConfigRepository.findByUserId.mockResolvedValue(undefined as any);
      photosRepository.findAllByUserId.mockResolvedValue([mockPhoto]);
      mockProvider.getSignedUrl.mockResolvedValue('https://signed-url.com');

      const result = await service.findAll(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('url', 'https://signed-url.com');
    });
  });

  describe('findOne', () => {
    it("devrait retourner la photo si elle appartient à l'utilisateur", async () => {
      storageConfigRepository.findByUserId.mockResolvedValue(undefined as any);
      photosRepository.findById.mockResolvedValue(mockPhoto);
      mockProvider.getSignedUrl.mockResolvedValue('https://signed-url.com');

      const result = await service.findOne(userId, mockPhoto.id);

      expect(result).toHaveProperty('url');
    });

    it("devrait rejeter si la photo n'existe pas", async () => {
      photosRepository.findById.mockResolvedValue(undefined as any);

      await expect(service.findOne(userId, 'unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('devrait rejeter si la photo appartient à un autre utilisateur', async () => {
      photosRepository.findById.mockResolvedValue({
        ...mockPhoto,
        userId: 'other-user-id',
      });

      await expect(service.findOne(userId, mockPhoto.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('delete', () => {
    it('devrait supprimer la photo du storage et de la DB', async () => {
      storageConfigRepository.findByUserId.mockResolvedValue(undefined as any);
      photosRepository.findById.mockResolvedValue(mockPhoto);
      photosRepository.delete.mockResolvedValue(mockPhoto);

      const result = await service.delete(userId, mockPhoto.id);

      expect(mockProvider.delete).toHaveBeenCalledWith(mockPhoto.objectKey);
      expect(photosRepository.delete).toHaveBeenCalledWith(mockPhoto.id);
      expect(result).toEqual({ message: 'Photo supprimée avec succès' });
    });

    it("devrait rejeter si la photo n'existe pas", async () => {
      photosRepository.findById.mockResolvedValue(undefined as any);

      await expect(service.delete(userId, 'unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("devrait rejeter si l'utilisateur n'est pas propriétaire", async () => {
      photosRepository.findById.mockResolvedValue({
        ...mockPhoto,
        userId: 'other-user-id',
      });

      await expect(service.delete(userId, mockPhoto.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
