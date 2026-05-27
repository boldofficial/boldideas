import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/db/schema';

const connectionString = process.env.DATABASE_URL;
const ssl = process.env.DATABASE_SSL === 'true' ? 'require' : false;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const client = postgres(connectionString, {
  prepare: false,
  ssl,
  connect_timeout: 20,
});

export const db = drizzle(client, { schema });
