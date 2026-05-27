
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const ssl = process.env.DATABASE_SSL === 'true' ? 'require' : false;

/**
 * DATABASE SINGLETON: Essential for Next.js Development.
 * Without this, every hot-reload creates a NEW connection pool.
 * Managed PostgreSQL hosts can quickly hit connection limits during hot reloads.
 */
const globalForDb = global as unknown as {
    db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

const client = globalForDb.db ? null : postgres(connectionString, { 
    prepare: false, 
    ssl,
    connect_timeout: 20 
});

export const db = globalForDb.db ?? drizzle(client!, { schema });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
