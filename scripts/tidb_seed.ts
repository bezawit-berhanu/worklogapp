import 'dotenv/config';
import mysql from 'mysql2/promise';

/**
 * TiDB Sample Data Seeder
 * Populates TiDB Cloud with realistic work logs across diverse performance categories.
 */
async function seedTiDB() {
  const host = process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com';
  const port = Number(process.env.TIDB_PORT) || 4000;
  const user = process.env.TIDB_USER || '';
  const password = process.env.TIDB_PASSWORD || '';
  const database = process.env.TIDB_DATABASE || 'worklog';

  if (!user || !password || user === 'your_tidb_username' || password === 'your_tidb_password') {
    console.log('[INFO] Skipping TiDB seeding: credentials not yet provided in .env');
    return;
  }

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    });

    console.log('Seeding TiDB Cloud database...');

    const sampleLog = {
      id: 'tidb-sample-1',
      date: '2026-10-21',
      work_done: JSON.stringify(['Configured TiDB Drizzle schema', 'Implemented TLS connection pool', 'Wrote unit tests']),
      achievements: JSON.stringify(['Clean database connection with SSL', '80 commits requirement met']),
      failures_and_challenges: JSON.stringify(['Handling remote git branch divergence']),
      lessons_learned: JSON.stringify(['Always fetch and rebase before pushing to main']),
      highlights: JSON.stringify(['Direct push to main on user behalf completed']),
      overall_reflection: 'Great engineering milestone achieved.',
    };

    await connection.query(
      `INSERT INTO daily_logs (id, date, work_done, achievements, failures_and_challenges, lessons_learned, highlights, overall_reflection)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       work_done = VALUES(work_done),
       achievements = VALUES(achievements),
       updated_at = CURRENT_TIMESTAMP`,
      [
        sampleLog.id,
        sampleLog.date,
        sampleLog.work_done,
        sampleLog.achievements,
        sampleLog.failures_and_challenges,
        sampleLog.lessons_learned,
        sampleLog.highlights,
        sampleLog.overall_reflection,
      ]
    );

    console.log('✓ Seed record successfully inserted into daily_logs');
    await connection.end();
  } catch (err) {
    console.error('[ERROR] TiDB seeding error:', err instanceof Error ? err.message : err);
  }
}

seedTiDB();
