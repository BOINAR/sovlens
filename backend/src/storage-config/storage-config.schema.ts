import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { usersTable } from '../users/users.schema';

export const storageModeConfigEnum = pgEnum('storage_mode_config', [
  'cloud',
  'sovereign',
]);

export const storageProfilesTable = pgTable('storage_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  mode: storageModeConfigEnum('mode').notNull().default('cloud'),
  endpoint: text('endpoint'),
  accessKey: text('access_key'),
  secretKey: text('secret_key'),
  bucket: text('bucket'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
