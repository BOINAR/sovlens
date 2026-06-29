import { Injectable } from '@nestjs/common';
import { StorageConfigRepository } from './storage-config.repository';
import { UpdateStorageConfigInput } from './storage-config.validation';

@Injectable()
export class StorageConfigService {
  constructor(
    private readonly storageConfigRepository: StorageConfigRepository,
  ) {}

  async getConfig(userId: string) {
    const profile = await this.storageConfigRepository.findByUserId(userId);

    if (!profile) {
      // Par défaut, mode cloud
      return { mode: 'cloud', endpoint: null, bucket: null };
    }

    // On ne retourne jamais les credentials au client
    return {
      mode: profile.mode,
      endpoint: profile.endpoint,
      bucket: profile.bucket,
    };
  }

  async updateConfig(userId: string, data: UpdateStorageConfigInput) {
    const profile = await this.storageConfigRepository.upsert(userId, data);

    return {
      mode: profile.mode,
      endpoint: profile.endpoint,
      bucket: profile.bucket,
    };
  }
}