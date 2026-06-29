import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { usersTable } from '../users/users.schema';
import { photosTable } from '../photos/photos.schema';
import { albumsTable } from '../albums/albums.schema';

export const shareLinksTable = pgTable('share_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  photoId: uuid('photo_id').references(() => photosTable.id, { onDelete: 'cascade' }),
  albumId: uuid('album_id').references(() => albumsTable.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});