import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

/**
 * TiDB Connection Manager
 * Reads connection settings from environment variables.
 * Enables SSL encryption required by TiDB Cloud Serverless.
 */
export function createTiDBConnection() {
  const host = process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com';
  const port = Number(process.env.TIDB_PORT) || 4000;
  const user = process.env.TIDB_USER || '';
  const password = process.env.TIDB_PASSWORD || '';
  const database = process.env.TIDB_DATABASE || 'worklog';

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
