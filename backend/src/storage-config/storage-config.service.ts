import { BadRequestException, Injectable } from '@nestjs/common';
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
      return { mode: 'cloud', endpoint: null, bucket: null };
    }

    return {
      mode: profile.mode,
      endpoint: profile.endpoint,
      bucket: profile.bucket,
    };
  }

  async updateConfig(userId: string, data: UpdateStorageConfigInput) {
    if (data.mode === 'sovereign' && !data.endpoint) {
      const existing = await this.storageConfigRepository.findByUserId(userId);
      if (!existing?.endpoint || !existing?.accessKey || !existing?.secretKey || !existing?.bucket) {
        throw new BadRequestException(
          'Aucune configuration souveraine enregistrée. Renseignez vos identifiants S3 dans les Paramètres.',
        );
      }
    }

    const profile = await this.storageConfigRepository.upsert(userId, data);

    return {
      mode: profile.mode,
      endpoint: profile.endpoint,
      bucket: profile.bucket,
    };
  }
}