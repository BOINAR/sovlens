import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserInput, UpdateUserInput } from './users.validation';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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

    const { passwordHash, ...safeUser } = user;
    return safeUser;
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
