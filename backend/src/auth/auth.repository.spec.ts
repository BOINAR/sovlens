import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from './auth.repository';
import { DRIZZLE } from 'src/db/drizzle.provider';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let mockDb: any;

  const userId = 'user-id-123';

  const mockRefreshToken = {
    id: 'token-id-123',
    userId,
    tokenHash: 'hash-abc',
    expiresAt: new Date(Date.now() + 100000),
    createdAt: new Date(),
  };

  const mockResetToken = {
    id: 'reset-id-123',
    userId,
    tokenHash: 'hash-reset',
    expiresAt: new Date(Date.now() + 100000),
    usedAt: null,
    createdAt: new Date(),
  };

  const resetMockDb = () => {
    mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockRefreshToken]),
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([mockRefreshToken]),
      delete: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
    };
  };

  beforeEach(async () => {
    resetMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        { provide: DRIZZLE, useValue: mockDb },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
  });

  describe('createRefreshToken', () => {
    it('devrait créer un refresh token', async () => {
      const result = await repository.createRefreshToken(
        userId,
        'hash-abc',
        mockRefreshToken.expiresAt,
      );

      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toEqual(mockRefreshToken);
    });
  });

  describe('findRefreshToken', () => {
    it('devrait retourner un refresh token valide', async () => {
      mockDb.where.mockResolvedValue([mockRefreshToken]);

      const result = await repository.findRefreshToken('hash-abc');

      expect(result).toEqual(mockRefreshToken);
    });

    it('devrait retourner undefined si aucun token trouvé', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findRefreshToken('unknown-hash');

      expect(result).toBeUndefined();
    });
  });

  describe('deleteRefreshToken', () => {
    it('devrait supprimer un refresh token', async () => {
      mockDb.where.mockResolvedValue(undefined);

      await repository.deleteRefreshToken('hash-abc');

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe('deleteAllRefreshTokens', () => {
    it('devrait supprimer tous les refresh tokens d\'un utilisateur', async () => {
      mockDb.where.mockResolvedValue(undefined);

      await repository.deleteAllRefreshTokens(userId);

      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe('createPasswordResetToken', () => {
    it('devrait créer un token de réinitialisation', async () => {
      mockDb.returning.mockResolvedValue([mockResetToken]);

      const result = await repository.createPasswordResetToken(
        userId,
        'hash-reset',
        mockResetToken.expiresAt,
      );

      expect(result).toEqual(mockResetToken);
    });
  });

  describe('findPasswordResetToken', () => {
    it('devrait retourner un token de réinitialisation valide', async () => {
      mockDb.where.mockResolvedValue([mockResetToken]);

      const result = await repository.findPasswordResetToken('hash-reset');

      expect(result).toEqual(mockResetToken);
    });

    it('devrait retourner undefined si aucun token trouvé', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findPasswordResetToken('unknown-hash');

      expect(result).toBeUndefined();
    });
  });

  describe('markPasswordResetTokenAsUsed', () => {
    it('devrait marquer un token comme utilisé', async () => {
      mockDb.where.mockResolvedValue(undefined);

      await repository.markPasswordResetTokenAsUsed(mockResetToken.id);

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalled();
    });
  });
});