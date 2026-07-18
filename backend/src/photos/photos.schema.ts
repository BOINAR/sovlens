import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { usersTable } from '../users/users.schema';

export const storageModeEnum = pgEnum('storage_mode', ['cloud', 'sovereign']);

export const photosTable = pgTable('photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  objectKey: text('object_key').notNull(),
  storageMode: storageModeEnum('storage_mode').notNull().default('cloud'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
