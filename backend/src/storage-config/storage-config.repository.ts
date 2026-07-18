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
    const hasNewSovereignFields = data.mode === 'sovereign' && !!data.endpoint;

    const [profile] = await this.db
      .insert(storageProfilesTable)
      .values({
        userId,
        mode: data.mode,
        endpoint: hasNewSovereignFields ? data.endpoint : null,
        accessKey: hasNewSovereignFields ? data.accessKey : null,
        secretKey: hasNewSovereignFields ? data.secretKey : null,
        bucket: hasNewSovereignFields ? data.bucket : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: storageProfilesTable.userId,
        set: hasNewSovereignFields
          ? {
              mode: data.mode,
              endpoint: data.endpoint,
              accessKey: data.accessKey,
              secretKey: data.secretKey,
              bucket: data.bucket,
              updatedAt: new Date(),
            }
          : {
              mode: data.mode,
              updatedAt: new Date(),
            },
      })
      .returning();
    return profile;
  }
}