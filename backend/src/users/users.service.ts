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

    return this.usersRepository.create(data);
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