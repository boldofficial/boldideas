
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

/**
 * DATABASE SINGLETON: Essential for Next.js Development.
 * Without this, every hot-reload creates a NEW connection pool.
 * Supabase soon hits its limit and returns CONNECT_TIMEOUT or AUTH FATAL.
 */
const globalForDb = global as unknown as {
    db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

const client = globalForDb.db ? null : postgres(connectionString, { 
    prepare: false, 
    ssl: 'require',
    connect_timeout: 20 
});

export const db = globalForDb.db ?? drizzle(client!, { schema });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
