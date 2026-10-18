import { Test, TestingModule } from '@nestjs/testing';
import { StorageConfigRepository } from './storage-config.repository';
import { DRIZZLE } from 'src/db/drizzle.provider';
import { randomBytes } from 'crypto';
import { encryptSecret, isEncrypted } from '../common/secret-cipher';

describe('StorageConfigRepository', () => {
  let repository: StorageConfigRepository;
  let mockDb: any;

  const userId = 'user-id-123';

  const mockProfile = {
    id: 'profile-id-123',
    userId,
    mode: 'sovereign' as const,
    endpoint: 'http://192.168.1.20:3900',
    accessKey: 'access-key',
    secretKey: 'secret-key',
    bucket: 'sovlens-photos',
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockProfile]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockProfile]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageConfigRepository,
        { provide: DRIZZLE, useValue: mockDb },
      ],
    }).compile();

    repository = module.get<StorageConfigRepository>(StorageConfigRepository);

    jest.clearAllMocks();
    Object.assign(mockDb, {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockProfile]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      onConflictDoUpdate: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockProfile]),
    });
  });

  describe('findByUserId', () => {
    it('devrait retourner le profil de stockage', async () => {
      const result = await repository.findByUserId(userId);

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
    });

    it('devrait retourner undefined si aucun profil', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findByUserId(userId);

      expect(result).toBeUndefined();
    });
  });

  describe('upsert', () => {
    it('devrait créer/mettre à jour un profil en mode souverain', async () => {
      const result = await repository.upsert(userId, {
        mode: 'sovereign',
        endpoint: 'http://192.168.1.20:3900',
        accessKey: 'access-key',
        secretKey: 'secret-key',
        bucket: 'sovlens-photos',
      });

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.onConflictDoUpdate).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
    });

    it('devrait mettre les champs souverains à null en mode cloud', async () => {
      mockDb.returning.mockResolvedValue([
        { ...mockProfile, mode: 'cloud', endpoint: null, bucket: null },
      ]);

      const result = await repository.upsert(userId, { mode: 'cloud' });

      expect(mockDb.values).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'cloud',
          endpoint: null,
          accessKey: null,
          secretKey: null,
          bucket: null,
        }),
      );
      expect(result.mode).toBe('cloud');
    });
  });

  describe('chiffrement au repos', () => {
    const originalKey = process.env.STORAGE_ENCRYPTION_KEY;

    beforeEach(() => {
      process.env.STORAGE_ENCRYPTION_KEY = randomBytes(32).toString('base64');
    });

    afterEach(() => {
      process.env.STORAGE_ENCRYPTION_KEY = originalKey;
    });

    it('devrait chiffrer les identifiants avant écriture', async () => {
      await repository.upsert(userId, {
        mode: 'sovereign',
        endpoint: 'http://192.168.1.20:3900',
        bucket: 'sovlens-photos',
        accessKey: 'access-key',
        secretKey: 'secret-key',
      });

      const written = mockDb.values.mock.calls[0][0];
      expect(isEncrypted(written.accessKey)).toBe(true);
      expect(isEncrypted(written.secretKey)).toBe(true);
      expect(written.secretKey).not.toContain('secret-key');
    });

    it('devrait déchiffrer les identifiants à la lecture', async () => {
      mockDb.where.mockResolvedValue([
        {
          ...mockProfile,
          accessKey: encryptSecret('access-key'),
          secretKey: encryptSecret('secret-key'),
        },
      ]);

      const result = await repository.findByUserId(userId);

      expect(result?.accessKey).toBe('access-key');
      expect(result?.secretKey).toBe('secret-key');
    });
  });
});
