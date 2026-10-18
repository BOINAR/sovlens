import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { eq, isNotNull, or } from 'drizzle-orm';
import {
  decryptSecret,
  encryptSecret,
  isEncrypted,
  isEncryptionConfigured,
} from '../common/secret-cipher';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { storageProfilesTable } from './storage-config.schema';
import { UpdateStorageConfigInput } from './storage-config.validation';

@Injectable()
export class StorageConfigRepository implements OnModuleInit {
  private readonly logger = new Logger(StorageConfigRepository.name);

  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  // Au démarrage : chiffre les identifiants encore stockés en clair
  async onModuleInit() {
    if (!isEncryptionConfigured()) {
      this.logger.warn(
        'STORAGE_ENCRYPTION_KEY absente : identifiants S3 souverains stockés en clair',
      );
      return;
    }

    const profiles = await this.db
      .select()
      .from(storageProfilesTable)
      .where(
        or(
          isNotNull(storageProfilesTable.accessKey),
          isNotNull(storageProfilesTable.secretKey),
        ),
      );

    const toMigrate = profiles.filter(
      (p) =>
        (p.accessKey && !isEncrypted(p.accessKey)) ||
        (p.secretKey && !isEncrypted(p.secretKey)),
    );

    for (const profile of toMigrate) {
      await this.db
        .update(storageProfilesTable)
        .set({
          accessKey: encryptSecret(profile.accessKey),
          secretKey: encryptSecret(profile.secretKey),
        })
        .where(eq(storageProfilesTable.id, profile.id));
    }

    if (toMigrate.length > 0) {
      this.logger.log(
        `${toMigrate.length} profil(s) de stockage chiffré(s) au repos`,
      );
    }
  }

  async findByUserId(userId: string) {
    const [profile] = await this.db
      .select()
      .from(storageProfilesTable)
      .where(eq(storageProfilesTable.userId, userId));
    return profile ? this.decrypt(profile) : profile;
  }

  private decrypt(profile: typeof storageProfilesTable.$inferSelect) {
    return {
      ...profile,
      accessKey: decryptSecret(profile.accessKey),
      secretKey: decryptSecret(profile.secretKey),
    };
  }

  async upsert(userId: string, data: UpdateStorageConfigInput) {
    const hasNewSovereignFields = data.mode === 'sovereign' && !!data.endpoint;

    const [profile] = await this.db
      .insert(storageProfilesTable)
      .values({
        userId,
        mode: data.mode,
        endpoint: hasNewSovereignFields ? data.endpoint : null,
        accessKey: hasNewSovereignFields ? encryptSecret(data.accessKey) : null,
        secretKey: hasNewSovereignFields ? encryptSecret(data.secretKey) : null,
        bucket: hasNewSovereignFields ? data.bucket : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: storageProfilesTable.userId,
        set: hasNewSovereignFields
          ? {
              mode: data.mode,
              endpoint: data.endpoint,
              accessKey: encryptSecret(data.accessKey),
              secretKey: encryptSecret(data.secretKey),
              bucket: data.bucket,
              updatedAt: new Date(),
            }
          : {
              mode: data.mode,
              updatedAt: new Date(),
            },
      })
      .returning();
    return this.decrypt(profile);
  }
}
