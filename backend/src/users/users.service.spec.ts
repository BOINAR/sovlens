import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@sovlens.com',
    passwordHash: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('devrait créer un utilisateur si l\'email n\'existe pas', async () => {
      usersRepository.findByEmail.mockResolvedValue(undefined);
      usersRepository.create.mockResolvedValue(mockUser);

      const result = await service.create({
        email: 'test@sovlens.com',
        passwordHash: 'hashed-password',
      });

      expect(usersRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('devrait rejeter si l\'email existe déjà', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.create({ email: 'test@sovlens.com', passwordHash: 'hash' }),
      ).rejects.toThrow(ConflictException);

      expect(usersRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('devrait retourner un utilisateur sans le passwordHash', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(result).not.toHaveProperty('passwordHash');
      expect(result).toHaveProperty('email', mockUser.email);
    });

    it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
      usersRepository.findById.mockResolvedValue(undefined);

      await expect(service.findById('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('devrait retourner un utilisateur par email', async () => {
      usersRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@sovlens.com');

      expect(result).toEqual(mockUser);
    });

    it('devrait retourner undefined si l\'utilisateur n\'existe pas', async () => {
      usersRepository.findByEmail.mockResolvedValue(undefined);

      const result = await service.findByEmail('inconnu@sovlens.com');

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un utilisateur', async () => {
      usersRepository.update.mockResolvedValue({
        ...mockUser,
        email: 'nouveau@sovlens.com',
      });

      const result = await service.update(mockUser.id, {
        email: 'nouveau@sovlens.com',
      });

      expect(result.email).toBe('nouveau@sovlens.com');
    });

    it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
      usersRepository.update.mockResolvedValue(undefined as any);

      await expect(
        service.update('unknown-id', { email: 'test@sovlens.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePassword', () => {
    it('devrait mettre à jour le mot de passe', async () => {
      usersRepository.updatePassword.mockResolvedValue(mockUser);

      const result = await service.updatePassword(mockUser.id, 'new-hash');

      expect(usersRepository.updatePassword).toHaveBeenCalledWith(
        mockUser.id,
        'new-hash',
      );
      expect(result).toEqual(mockUser);
    });

    it('devrait rejeter si l\'utilisateur n\'existe pas', async () => {
      usersRepository.updatePassword.mockResolvedValue(undefined as any);

      await expect(
        service.updatePassword('unknown-id', 'new-hash'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});