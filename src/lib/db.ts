import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

function getConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return url;
}

const sql = neon(getConnectionString());
export const db = drizzle(sql, { schema });

/**
 * @deprecated Will be removed once all consumers use Drizzle queries directly.
 * Kept temporarily for backward compatibility during migration.
 */
export function isDbEnabled(): boolean {
  return !!process.env.DATABASE_URL;
}

