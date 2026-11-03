import 'dotenv/config';
import mysql from 'mysql2/promise';

/**
 * TiDB Connection Health & Diagnostics Script
 * Run with: npm run db:check or npx tsx scripts/tidb_test_connection.ts
 */
async function testConnection() {
  const host = process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com';
  const port = Number(process.env.TIDB_PORT) || 4000;
  const user = process.env.TIDB_USER || '';
  const password = process.env.TIDB_PASSWORD || '';
  const database = process.env.TIDB_DATABASE || 'worklog';

  console.log('--- TiDB Cloud Connection Check ---');
  console.log(`Host:     ${host}`);
  console.log(`Port:     ${port}`);
  console.log(`Database: ${database}`);
  console.log(`User:     ${user ? user : '(not yet set in .env)'}`);
  console.log(`Password: ${password ? '********' : '(not yet set in .env)'}`);

  if (!user || !password || user === 'your_tidb_username' || password === 'your_tidb_password') {
    console.log('\n[INFO] TiDB credentials have not been configured yet.');
    console.log('Please open .env and replace your_tidb_username and your_tidb_password with your actual TiDB Cloud credentials.');
    return;
  }

  try {
    console.log('\nAttempting SSL connection to TiDB Cloud cluster...');
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
    });

    const [rows] = await connection.query('SELECT VERSION() AS version, 1 + 1 AS ping');
    console.log('\n[SUCCESS] Successfully connected to TiDB Cloud!');
    console.log('Cluster Info:', rows);

    await connection.end();
  } catch (err) {
    console.error('\n[ERROR] Connection failed:', err instanceof Error ? err.message : err);
  }
}

testConnection();
