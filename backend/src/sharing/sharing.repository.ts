import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { shareLinksTable } from './sharing.schema';

@Injectable()
export class SharingRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  async createPhotoShareLink(
    userId: string,
    photoId: string,
    token: string,
    expiresAt?: Date | null,
  ) {
    const [link] = await this.db
      .insert(shareLinksTable)
      .values({ userId, photoId, token, expiresAt })
      .returning();
    return link;
  }

  async createAlbumShareLink(
    userId: string,
    albumId: string,
    token: string,
    expiresAt?: Date | null,
  ) {
    const [link] = await this.db
      .insert(shareLinksTable)
      .values({ userId, albumId, token, expiresAt })
      .returning();
    return link;
  }

  async findByToken(token: string) {
    const [link] = await this.db
      .select()
      .from(shareLinksTable)
      .where(eq(shareLinksTable.token, token));
    return link;
  }

  async findAllByUserId(userId: string) {
    return this.db
      .select()
      .from(shareLinksTable)
      .where(eq(shareLinksTable.userId, userId));
  }

  async delete(id: string) {
    await this.db
      .delete(shareLinksTable)
      .where(eq(shareLinksTable.id, id));
  }
}