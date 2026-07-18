import { Inject, Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { photosTable } from './photos.schema';

@Injectable()
export class PhotosRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  async create(data: {
    userId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    objectKey: string;
    storageMode?: 'cloud' | 'sovereign';
  }) {
    const [photo] = await this.db.insert(photosTable).values(data).returning();
    return photo;
  }

  async findAllByUserId(userId: string) {
    return this.db
      .select()
      .from(photosTable)
      .where(eq(photosTable.userId, userId))
      .orderBy(desc(photosTable.createdAt));
  }

  async findById(id: string) {
    const [photo] = await this.db
      .select()
      .from(photosTable)
      .where(eq(photosTable.id, id));
    return photo;
  }

  async delete(id: string) {
    const [photo] = await this.db
      .delete(photosTable)
      .where(eq(photosTable.id, id))
      .returning();
    return photo;
  }
}
