import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
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

    // 🔥 TEST DB
    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    return drizzle({
      client: pool,
      schema,
      logger: true,
    });
  },
};
