import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

/**
 * TiDB Connection Manager
 * Reads connection settings from environment variables.
 * Enables SSL encryption required by TiDB Cloud Serverless.
 */
export function createTiDBConnection() {
  const env = typeof process !== 'undefined' && process.env ? process.env : {};
  const metaEnv = typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env ? (import.meta as unknown as { env: Record<string, string> }).env : {};

  const host = env.TIDB_HOST || metaEnv.VITE_TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com';
  const port = Number(env.TIDB_PORT || metaEnv.VITE_TIDB_PORT) || 4000;
  const user = env.TIDB_USER || metaEnv.VITE_TIDB_USER || '';
  const password = env.TIDB_PASSWORD || metaEnv.VITE_TIDB_PASSWORD || '';
  const database = env.TIDB_DATABASE || metaEnv.VITE_TIDB_DATABASE || 'worklog';

  // SSL is required for TiDB Cloud Serverless clusters
  const connection = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
    connectionLimit: 10,
    waitForConnections: true,
  });

  const db = drizzle(connection, { schema, mode: 'default' });
  return { db, connection };
}

export { schema };
