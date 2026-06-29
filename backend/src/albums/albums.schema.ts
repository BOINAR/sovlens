import { pgTable, timestamp, uuid, text, primaryKey } from 'drizzle-orm/pg-core';
import { usersTable } from '../users/users.schema';
import { photosTable } from '../photos/photos.schema';

export const albumsTable = pgTable('albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const albumPhotosTable = pgTable('album_photos', {
  albumId: uuid('album_id').notNull().references(() => albumsTable.id, { onDelete: 'cascade' }),
  photoId: uuid('photo_id').notNull().references(() => photosTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.albumId, t.photoId] }),
]);