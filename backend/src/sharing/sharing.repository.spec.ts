import { Test, TestingModule } from '@nestjs/testing';
import { SharingRepository } from './sharing.repository';
import { DRIZZLE } from 'src/db/drizzle.provider';

describe('SharingRepository', () => {
  let repository: SharingRepository;
  let mockDb: any;

  const userId = 'user-id-123';
  const photoId = 'photo-id-123';
  const albumId = 'album-id-123';
  const token = 'share-token-123';

  const mockShareLink = {
    id: 'link-id-123',
    userId,
    photoId,
    albumId: null,
    token,
    expiresAt: null,
    createdAt: new Date(),
  };

  const resetMockDb = () => {
    mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockShareLink]),
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockShareLink]),
      delete: jest.fn().mockReturnThis(),
    };
  };

  beforeEach(async () => {
    resetMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SharingRepository, { provide: DRIZZLE, useValue: mockDb }],
    }).compile();

    repository = module.get<SharingRepository>(SharingRepository);
  });

  describe('createPhotoShareLink', () => {
    it('devrait créer un lien de partage pour une photo', async () => {
      const result = await repository.createPhotoShareLink(
        userId,
        photoId,
        token,
        null,
      );

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({
        userId,
        photoId,
        token,
        expiresAt: null,
      });
      expect(result).toEqual(mockShareLink);
    });
  });

  describe('createAlbumShareLink', () => {
    it('devrait créer un lien de partage pour un album', async () => {
      mockDb.returning.mockResolvedValue([
        { ...mockShareLink, photoId: null, albumId },
      ]);

      const result = await repository.createAlbumShareLink(
        userId,
        albumId,
        token,
        null,
      );

      expect(mockDb.values).toHaveBeenCalledWith({
        userId,
        albumId,
        token,
        expiresAt: null,
      });
      expect(result.albumId).toBe(albumId);
    });
  });

  describe('findByToken', () => {
    it('devrait retourner un lien de partage par son token', async () => {
      mockDb.where.mockResolvedValue([mockShareLink]);

      const result = await repository.findByToken(token);

      expect(result).toEqual(mockShareLink);
    });

    it('devrait retourner undefined si aucun lien trouvé', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findByToken('unknown-token');

      expect(result).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('devrait supprimer un lien de partage', async () => {
      mockDb.where.mockResolvedValue(undefined);

      await repository.delete(mockShareLink.id);

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });
});
