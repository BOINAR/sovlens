import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { StorageService } from '../storage/storage.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;
  let storageService: jest.Mocked<StorageService>;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@sovlens.com',
    passwordHash: 'hashed-password',
    avatarKey: null as string | null,
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
            updateAvatarKey: jest.fn(),
          },
        },
        {
          provide: StorageService,
          useValue: {
            upload: jest.fn(),
            delete: jest.fn(),
            getSignedUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
    storageService = module.get(StorageService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it("devrait créer un utilisateur si l'email n'existe pas", async () => {
      usersRepository.findByEmail.mockResolvedValue(undefined);
      usersRepository.create.mockResolvedValue(mockUser);

      const result = await service.create({
        email: 'test@sovlens.com',
        passwordHash: 'hashed-password',
      });

      expect(usersRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("devrait rejeter si l'email existe déjà", async () => {
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

    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
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

    it("devrait retourner undefined si l'utilisateur n'existe pas", async () => {
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

    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
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

    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
      usersRepository.updatePassword.mockResolvedValue(undefined as any);

      await expect(
        service.updatePassword('unknown-id', 'new-hash'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMe', () => {
    it('devrait renvoyer avatarUrl null sans avatar, sans exposer les clés', async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getMe(mockUser.id);

      expect(result.avatarUrl).toBeNull();
      expect(result).not.toHaveProperty('passwordHash');
      expect(result).not.toHaveProperty('avatarKey');
      expect(storageService.getSignedUrl).not.toHaveBeenCalled();
    });

    it("devrait renvoyer une URL signée si l'avatar existe", async () => {
      usersRepository.findById.mockResolvedValue({
        ...mockUser,
        avatarKey: 'user-id-123/avatar/a.png',
      });
      storageService.getSignedUrl.mockResolvedValue('https://signed');

      const result = await service.getMe(mockUser.id);

      expect(storageService.getSignedUrl).toHaveBeenCalledWith(
        'user-id-123/avatar/a.png',
      );
      expect(result.avatarUrl).toBe('https://signed');
    });
  });

  describe('uploadAvatar', () => {
    it('devrait rejeter un format non supporté', async () => {
      await expect(
        service.uploadAvatar(mockUser.id, Buffer.from('x'), 'image/gif'),
      ).rejects.toThrow(BadRequestException);
      expect(storageService.upload).not.toHaveBeenCalled();
    });

    it('devrait rejeter un fichier de plus de 5 Mo', async () => {
      const big = Buffer.alloc(5 * 1024 * 1024 + 1);
      await expect(
        service.uploadAvatar(mockUser.id, big, 'image/png'),
      ).rejects.toThrow(BadRequestException);
      expect(storageService.upload).not.toHaveBeenCalled();
    });

    it("devrait stocker le nouvel avatar et supprimer l'ancien", async () => {
      usersRepository.findById.mockResolvedValue({
        ...mockUser,
        avatarKey: 'user-id-123/avatar/old.png',
      });

      await service.uploadAvatar(mockUser.id, Buffer.from('x'), 'image/png');

      const newKey = storageService.upload.mock.calls[0][1];
      expect(newKey).toMatch(/^user-id-123\/avatar\/.+\.png$/);
      expect(usersRepository.updateAvatarKey).toHaveBeenCalledWith(
        mockUser.id,
        newKey,
      );
      expect(storageService.delete).toHaveBeenCalledWith(
        'user-id-123/avatar/old.png',
      );
    });

    it("ne devrait pas échouer si la suppression de l'ancien avatar échoue", async () => {
      usersRepository.findById.mockResolvedValue({
        ...mockUser,
        avatarKey: 'user-id-123/avatar/old.png',
      });
      storageService.delete.mockRejectedValue(new Error('S3 down'));

      await expect(
        service.uploadAvatar(mockUser.id, Buffer.from('x'), 'image/webp'),
      ).resolves.toBeDefined();
    });
  });

  describe('removeAvatar', () => {
    it("devrait vider la clé et supprimer l'objet", async () => {
      usersRepository.findById.mockResolvedValue({
        ...mockUser,
        avatarKey: 'user-id-123/avatar/a.png',
      });

      await service.removeAvatar(mockUser.id);

      expect(usersRepository.updateAvatarKey).toHaveBeenCalledWith(
        mockUser.id,
        null,
      );
      expect(storageService.delete).toHaveBeenCalledWith(
        'user-id-123/avatar/a.png',
      );
    });

    it("ne devrait rien faire s'il n'y a pas d'avatar", async () => {
      usersRepository.findById.mockResolvedValue(mockUser);

      await service.removeAvatar(mockUser.id);

      expect(usersRepository.updateAvatarKey).not.toHaveBeenCalled();
      expect(storageService.delete).not.toHaveBeenCalled();
    });
  });
});
