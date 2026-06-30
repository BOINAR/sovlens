import { Test, TestingModule } from '@nestjs/testing';
import { PhotosRepository } from './photos.repository';
import { DRIZZLE } from 'src/db/drizzle.provider';

describe('PhotosRepository', () => {
  let repository: PhotosRepository;
  let mockDb: any;

  const userId = 'user-id-123';
  const photoId = 'photo-id-123';

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

  const resetMockDb = () => {
    mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockPhoto]),
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockResolvedValue([mockPhoto]),
      delete: jest.fn().mockReturnThis(),
    };
  };

  beforeEach(async () => {
    resetMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosRepository,
        { provide: DRIZZLE, useValue: mockDb },
      ],
    }).compile();

    repository = module.get<PhotosRepository>(PhotosRepository);
  });

  describe('create', () => {
    it('devrait créer une photo', async () => {
      const data = {
        userId,
        filename: 'test.webp',
        originalName: 'test.webp',
        mimeType: 'image/webp',
        size: 1000,
        objectKey: `${userId}/test.webp`,
        storageMode: 'cloud' as const,
      };

      const result = await repository.create(data);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockPhoto);
    });
  });

  describe('findAllByUserId', () => {
    it('devrait retourner toutes les photos d\'un utilisateur triées par date', async () => {
      mockDb.orderBy.mockResolvedValue([mockPhoto]);

      const result = await repository.findAllByUserId(userId);

      expect(mockDb.orderBy).toHaveBeenCalled();
      expect(result).toEqual([mockPhoto]);
    });
  });

  describe('findById', () => {
    it('devrait retourner une photo par son id', async () => {
      mockDb.where.mockResolvedValue([mockPhoto]);

      const result = await repository.findById(photoId);

      expect(result).toEqual(mockPhoto);
    });

    it('devrait retourner undefined si aucune photo', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findById('unknown-id');

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('devrait supprimer une photo', async () => {
      const result = await repository.delete(photoId);

      expect(mockDb.delete).toHaveBeenCalled();
      expect(result).toEqual(mockPhoto);
    });
  });
});