import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from './drizzle.schema';

export const DRIZZLE = 'DRIZZLE';

export type DbClient = NodePgDatabase<typeof schema>;

export const DrizzleProvider = {
  provide: DRIZZLE,
  useFactory: async (): Promise<DbClient> => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    const db = drizzle({
      client: pool,
      schema,
      // Les paramètres SQL contiennent des secrets (hash, clés S3) : jamais en production
      logger: process.env.NODE_ENV !== 'production',
    });

    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations applied');

    return db;
  },
};
