import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UsersService } from '../users/users.service';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let mailerService: jest.Mocked<MailerService>;

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
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            updatePassword: jest.fn(),
          },
        },
        {
          provide: AuthRepository,
          useValue: {
            createRefreshToken: jest.fn(),
            findRefreshToken: jest.fn(),
            deleteRefreshToken: jest.fn(),
            deleteAllRefreshTokens: jest.fn(),
            createPasswordResetToken: jest.fn(),
            findPasswordResetToken: jest.fn(),
            markPasswordResetTokenAsUsed: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mocked-access-token'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    authRepository = module.get(AuthRepository);
    jwtService = module.get(JwtService);
    mailerService = module.get(MailerService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      usersService.findByEmail.mockResolvedValue(undefined);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@sovlens.com',
        password: 'password123',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@sovlens.com');
      expect(argon2.hash).toHaveBeenCalledWith('password123');
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'test@sovlens.com',
        passwordHash: 'hashed-password',
      });
      expect(result).toEqual({ message: 'Compte créé avec succès' });
    });

    it("devrait rejeter si l'email existe déjà", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@sovlens.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);

      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      authRepository.createRefreshToken.mockResolvedValue({} as any);

      const result = await service.login({
        email: 'test@sovlens.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(authRepository.createRefreshToken).toHaveBeenCalled();
    });

    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
      usersService.findByEmail.mockResolvedValue(undefined);

      await expect(
        service.login({
          email: 'inconnu@sovlens.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('devrait rejeter si le mot de passe est incorrect', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@sovlens.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('devrait générer de nouveaux tokens avec rotation', async () => {
      const storedToken = {
        id: 'token-id',
        userId: mockUser.id,
        tokenHash: 'old-hash',
        expiresAt: new Date(Date.now() + 100000),
        createdAt: new Date(),
      };

      authRepository.findRefreshToken.mockResolvedValue(storedToken);
      usersService.findById.mockResolvedValue(mockUser);
      authRepository.deleteRefreshToken.mockResolvedValue(undefined);
      authRepository.createRefreshToken.mockResolvedValue({} as any);

      const result = await service.refresh('raw-refresh-token');

      expect(authRepository.deleteRefreshToken).toHaveBeenCalled();
      expect(authRepository.createRefreshToken).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('devrait rejeter si le refresh token est introuvable', async () => {
      authRepository.findRefreshToken.mockResolvedValue(undefined);

      await expect(service.refresh('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('devrait supprimer le refresh token', async () => {
      authRepository.deleteRefreshToken.mockResolvedValue(undefined);

      const result = await service.logout('raw-refresh-token');

      expect(authRepository.deleteRefreshToken).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Déconnecté avec succès' });
    });
  });

  describe('forgotPassword', () => {
    it("devrait envoyer un email si l'utilisateur existe", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      authRepository.createPasswordResetToken.mockResolvedValue({} as any);

      const result = await service.forgotPassword({
        email: 'test@sovlens.com',
      });

      expect(mailerService.sendMail).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Si ce compte existe, un email a été envoyé',
      });
    });

    it("ne devrait pas révéler si l'email n'existe pas", async () => {
      usersService.findByEmail.mockResolvedValue(undefined);

      const result = await service.forgotPassword({
        email: 'inconnu@sovlens.com',
      });

      expect(mailerService.sendMail).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Si ce compte existe, un email a été envoyé',
      });
    });
  });

  describe('resetPassword', () => {
    it('devrait réinitialiser le mot de passe avec un token valide', async () => {
      const storedToken = {
        id: 'reset-token-id',
        userId: mockUser.id,
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 100000),
        usedAt: null,
        createdAt: new Date(),
      };

      authRepository.findPasswordResetToken.mockResolvedValue(storedToken);
      (argon2.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      usersService.updatePassword.mockResolvedValue(mockUser);
      authRepository.markPasswordResetTokenAsUsed.mockResolvedValue(undefined);
      authRepository.deleteAllRefreshTokens.mockResolvedValue(undefined);

      const result = await service.resetPassword({
        token: 'raw-token',
        password: 'newpassword123',
      });

      expect(usersService.updatePassword).toHaveBeenCalledWith(
        mockUser.id,
        'new-hashed-password',
      );
      expect(authRepository.deleteAllRefreshTokens).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual({ message: 'Mot de passe modifié avec succès' });
    });

    it('devrait rejeter si le token est invalide ou expiré', async () => {
      authRepository.findPasswordResetToken.mockResolvedValue(undefined);

      await expect(
        service.resetPassword({ token: 'invalid', password: 'newpassword123' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
