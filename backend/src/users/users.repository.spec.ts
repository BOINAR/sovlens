import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { DRIZZLE } from 'src/db/drizzle.provider';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockDb: any;

  const userId = 'user-id-123';

  const mockUser = {
    id: userId,
    email: 'test@sovlens.com',
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

const resetMockDb = () => {
  mockDb = {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([mockUser]),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
  };
};

  beforeEach(async () => {
    resetMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: DRIZZLE, useValue: mockDb },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  describe('create', () => {
    it('devrait créer un utilisateur', async () => {
      const data = { email: 'test@sovlens.com', passwordHash: 'hashed-password' };

      const result = await repository.create(data);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('devrait retourner un utilisateur par son id', async () => {
      mockDb.where.mockResolvedValue([mockUser]);

      const result = await repository.findById(userId);

      expect(result).toEqual(mockUser);
    });

    it('devrait retourner undefined si aucun utilisateur', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findById('unknown-id');

      expect(result).toBeUndefined();
    });
  });

  describe('findByEmail', () => {
    it('devrait retourner un utilisateur par email', async () => {
      mockDb.where.mockResolvedValue([mockUser]);

      const result = await repository.findByEmail('test@sovlens.com');

      expect(result).toEqual(mockUser);
    });

    it('devrait retourner undefined si aucun utilisateur', async () => {
      mockDb.where.mockResolvedValue([]);

      const result = await repository.findByEmail('inconnu@sovlens.com');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un utilisateur', async () => {
      mockDb.returning.mockResolvedValue([
        { ...mockUser, email: 'nouveau@sovlens.com' },
      ]);

      const result = await repository.update(userId, {
        email: 'nouveau@sovlens.com',
      });

      expect(mockDb.set).toHaveBeenCalled();
      expect(result.email).toBe('nouveau@sovlens.com');
    });
  });

  describe('updatePassword', () => {
    it('devrait mettre à jour le mot de passe', async () => {
      mockDb.returning.mockResolvedValue([
        { ...mockUser, passwordHash: 'new-hash' },
      ]);

      const result = await repository.updatePassword(userId, 'new-hash');

      expect(mockDb.set).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'new-hash' }),
      );
      expect(result.passwordHash).toBe('new-hash');
    });
  });
});