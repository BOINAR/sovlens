import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { storageProfilesTable } from './storage-config.schema';
import { UpdateStorageConfigInput } from './storage-config.validation';

@Injectable()
export class StorageConfigRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  async findByUserId(userId: string) {
    const [profile] = await this.db
      .select()
      .from(storageProfilesTable)
      .where(eq(storageProfilesTable.userId, userId));
    return profile;
  }

  async upsert(userId: string, data: UpdateStorageConfigInput) {
    const [profile] = await this.db
      .insert(storageProfilesTable)
      .values({
        userId,
        mode: data.mode,
        endpoint: data.mode === 'sovereign' ? data.endpoint : null,
        accessKey: data.mode === 'sovereign' ? data.accessKey : null,
        secretKey: data.mode === 'sovereign' ? data.secretKey : null,
        bucket: data.mode === 'sovereign' ? data.bucket : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: storageProfilesTable.userId,
        set: {
          mode: data.mode,
          endpoint: data.mode === 'sovereign' ? data.endpoint : null,
          accessKey: data.mode === 'sovereign' ? data.accessKey : null,
          secretKey: data.mode === 'sovereign' ? data.secretKey : null,
          bucket: data.mode === 'sovereign' ? data.bucket : null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return profile;
  }
}