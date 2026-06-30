import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsRepository } from './albums.repository';
import { DRIZZLE } from 'src/db/drizzle.provider';

describe('AlbumsRepository', () => {
  let repository: AlbumsRepository;
  let mockDb: any;

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

const resetMockDb = () => {
  mockDb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([mockAlbum]),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
  };
};

  beforeEach(async () => {
    resetMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsRepository,
        { provide: DRIZZLE, useValue: mockDb },
      ],
    }).compile();

    repository = module.get<AlbumsRepository>(AlbumsRepository);
  });

  describe('create', () => {
    it('devrait créer un album', async () => {
      const result = await repository.create(userId, 'Vacances été');

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({ userId, name: 'Vacances été' });
      expect(result).toEqual(mockAlbum);
    });
  });

  describe('findAllByUserId', () => {
    it('devrait retourner tous les albums d\'un utilisateur', async () => {
      mockDb.where.mockResolvedValue([mockAlbum]);

      const result = await repository.findAllByUserId(userId);

      expect(result).toEqual([mockAlbum]);
    });
  });

  describe('findById', () => {
    it('devrait retourner un album par son id', async () => {
      mockDb.where.mockResolvedValue([mockAlbum]);

      const result = await repository.findById(albumId);

      expect(result).toEqual(mockAlbum);
    });

    it('devrait retourner undefined si aucun album', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findById('unknown-id');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('devrait mettre à jour le nom de l\'album', async () => {
      mockDb.returning.mockResolvedValue([{ ...mockAlbum, name: 'Nouveau nom' }]);

      const result = await repository.update(albumId, 'Nouveau nom');

      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Nouveau nom' }),
      );
      expect(result.name).toBe('Nouveau nom');
    });
  });

  describe('delete', () => {
    it('devrait supprimer un album', async () => {
      const result = await repository.delete(albumId);

      expect(mockDb.delete).toHaveBeenCalled();
      expect(result).toEqual(mockAlbum);
    });
  });

  describe('addPhoto', () => {
    it('devrait ajouter une photo à un album', async () => {
      const mockEntry = { albumId, photoId, createdAt: new Date() };
      mockDb.returning.mockResolvedValue([mockEntry]);

      const result = await repository.addPhoto(albumId, photoId);

      expect(mockDb.values).toHaveBeenCalledWith({ albumId, photoId });
      expect(result).toEqual(mockEntry);
    });
  });

  describe('removePhoto', () => {
    it('devrait retirer une photo d\'un album', async () => {
      mockDb.where.mockResolvedValue(undefined);

      await repository.removePhoto(albumId, photoId);

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe('findPhotosInAlbum', () => {
    it('devrait retourner les photos d\'un album', async () => {
      mockDb.where.mockResolvedValue([mockPhoto]);

      const result = await repository.findPhotosInAlbum(albumId);

      expect(mockDb.innerJoin).toHaveBeenCalled();
      expect(result).toEqual([mockPhoto]);
    });
  });

  describe('photoExistsInAlbum', () => {
    it('devrait retourner true si la photo est dans l\'album', async () => {
      mockDb.where.mockResolvedValue([{ albumId, photoId }]);

      const result = await repository.photoExistsInAlbum(albumId, photoId);

      expect(result).toBe(true);
    });

    it('devrait retourner false si la photo n\'est pas dans l\'album', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.photoExistsInAlbum(albumId, photoId);

      expect(result).toBe(false);
    });
  });
});