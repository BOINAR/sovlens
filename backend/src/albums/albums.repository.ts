import { Inject, Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DRIZZLE, DbClient } from 'src/db/drizzle.provider';
import { albumsTable, albumPhotosTable } from './albums.schema';
import { photosTable } from '../photos/photos.schema';

@Injectable()
export class AlbumsRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DbClient) {}

  async create(userId: string, name: string) {
    const [album] = await this.db
      .insert(albumsTable)
      .values({ userId, name })
      .returning();
    return album;
  }

  async findAllByUserId(userId: string) {
    return this.db
      .select()
      .from(albumsTable)
      .where(eq(albumsTable.userId, userId));
  }

  async findById(id: string) {
    const [album] = await this.db
      .select()
      .from(albumsTable)
      .where(eq(albumsTable.id, id));
    return album;
  }

  async update(id: string, name: string) {
    const [album] = await this.db
      .update(albumsTable)
      .set({ name, updatedAt: new Date() })
      .where(eq(albumsTable.id, id))
      .returning();
    return album;
  }

  async delete(id: string) {
    const [album] = await this.db
      .delete(albumsTable)
      .where(eq(albumsTable.id, id))
      .returning();
    return album;
  }

  async addPhoto(albumId: string, photoId: string) {
    const [entry] = await this.db
      .insert(albumPhotosTable)
      .values({ albumId, photoId })
      .returning();
    return entry;
  }

  async removePhoto(albumId: string, photoId: string) {
    await this.db
      .delete(albumPhotosTable)
      .where(
        and(
          eq(albumPhotosTable.albumId, albumId),
          eq(albumPhotosTable.photoId, photoId),
        ),
      );
  }

  async findPhotosInAlbum(albumId: string) {
    return this.db
      .select({
        id: photosTable.id,
        userId: photosTable.userId,
        filename: photosTable.filename,
        originalName: photosTable.originalName,
        mimeType: photosTable.mimeType,
        size: photosTable.size,
        objectKey: photosTable.objectKey,
        storageMode: photosTable.storageMode,
        createdAt: photosTable.createdAt,
        updatedAt: photosTable.updatedAt,
      })
      .from(albumPhotosTable)
      .innerJoin(photosTable, eq(albumPhotosTable.photoId, photosTable.id))
      .where(eq(albumPhotosTable.albumId, albumId));
  }

  async photoExistsInAlbum(albumId: string, photoId: string) {
    const [entry] = await this.db
      .select()
      .from(albumPhotosTable)
      .where(
        and(
          eq(albumPhotosTable.albumId, albumId),
          eq(albumPhotosTable.photoId, photoId),
        ),
      );
    return !!entry;
  }
}
