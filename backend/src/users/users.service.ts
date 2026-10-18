import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UsersRepository } from './users.repository';
import { CreateUserInput, UpdateUserInput } from './users.validation';
import { StorageService } from '../storage/storage.service';

const AVATAR_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const AVATAR_MAX_SIZE = 5 * 1024 * 1024;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(data: CreateUserInput) {
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Un utilisateur existe déjà avec cet email');
    }

    try {
      return await this.usersRepository.create(data);
    } catch (error) {
      // Deux inscriptions simultanées : la contrainte unique tranche
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Un utilisateur existe déjà avec cet email',
        );
      }
      throw error;
    }
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const { passwordHash, avatarKey, ...safeUser } = user;
    return safeUser;
  }

  // Profil de l'utilisateur connecté, avec une URL signée pour l'avatar
  async getMe(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const { passwordHash, avatarKey, ...safeUser } = user;
    const avatarUrl = avatarKey
      ? await this.storageService.getSignedUrl(avatarKey)
      : null;

    return { ...safeUser, avatarUrl };
  }

  // L'avatar est une donnée de compte : il reste sur le stockage cloud SovLens
  // quel que soit le mode de stockage des photos
  async uploadAvatar(id: string, file: Buffer, mimeType: string) {
    const extension = AVATAR_MIME_TYPES[mimeType];

    if (!extension) {
      throw new BadRequestException('Format non supporté (JPEG, PNG ou WebP)');
    }

    if (file.length > AVATAR_MAX_SIZE) {
      throw new BadRequestException("L'avatar ne doit pas dépasser 5 Mo");
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const avatarKey = `${id}/avatar/${randomUUID()}.${extension}`;
    await this.storageService.upload(file, avatarKey, mimeType);
    await this.usersRepository.updateAvatarKey(id, avatarKey);

    if (user.avatarKey) {
      await this.deleteObjectSafely(user.avatarKey);
    }

    return this.getMe(id);
  }

  async removeAvatar(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.avatarKey) {
      await this.usersRepository.updateAvatarKey(id, null);
      await this.deleteObjectSafely(user.avatarKey);
    }

    return this.getMe(id);
  }

  // Un objet orphelin dans le bucket ne doit pas faire échouer la requête
  private async deleteObjectSafely(key: string) {
    try {
      await this.storageService.delete(key);
    } catch (error) {
      this.logger.warn(`Suppression de l'ancien avatar impossible (${key})`);
      this.logger.debug(error);
    }
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await this.usersRepository.update(id, data);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async updatePassword(id: string, passwordHash: string) {
    const user = await this.usersRepository.updatePassword(id, passwordHash);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }
}

// Code Postgres 23505 = unique_violation (Drizzle encapsule l'erreur pg dans `cause`)
function isUniqueViolation(error: unknown): boolean {
  const err = error as { code?: string; cause?: { code?: string } };
  return err?.code === '23505' || err?.cause?.code === '23505';
}
