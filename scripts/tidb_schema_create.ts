import 'dotenv/config';
import mysql from 'mysql2/promise';

/**
 * TiDB Schema Initialization Script
 * Creates the required worklog tables directly on TiDB Cloud using MySQL DDL.
 */
async function initializeSchema() {
  const host = process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com';
  const port = Number(process.env.TIDB_PORT) || 4000;
  const user = process.env.TIDB_USER || '';
  const password = process.env.TIDB_PASSWORD || '';
  const database = process.env.TIDB_DATABASE || 'worklog';

  if (!user || !password || user === 'your_tidb_username' || password === 'your_tidb_password') {
    console.log('[INFO] Skipping TiDB schema execution: credentials not yet provided in .env');
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

    console.log('Deploying TiDB database schemas...');

    // 1. Daily Logs Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS daily_logs (
        id VARCHAR(64) PRIMARY KEY,
        date VARCHAR(10) NOT NULL UNIQUE,
        work_done JSON NOT NULL,
        achievements JSON NOT NULL,
        failures_and_challenges JSON NOT NULL,
        lessons_learned JSON NOT NULL,
        highlights JSON NOT NULL,
        overall_reflection TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_daily_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ daily_logs table ready.');

    // 2. Weekly Reflections Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS weekly_reflections (
        id VARCHAR(64) PRIMARY KEY,
        week_start_date VARCHAR(10) NOT NULL,
        week_end_date VARCHAR(10) NOT NULL,
        work_done JSON NOT NULL,
        achievements JSON NOT NULL,
        failures_and_challenges JSON NOT NULL,
        lessons_learned JSON NOT NULL,
        highlights JSON NOT NULL,
        overall_reflection TEXT,
        generated_summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_weekly_range (week_start_date, week_end_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ weekly_reflections table ready.');

    // 3. Monthly Reflections Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS monthly_reflections (
        id VARCHAR(64) PRIMARY KEY,
        month INT NOT NULL,
        year INT NOT NULL,
        work_done JSON NOT NULL,
        achievements JSON NOT NULL,
        failures_and_challenges JSON NOT NULL,
        lessons_learned JSON NOT NULL,
        highlights JSON NOT NULL,
        overall_reflection TEXT,
        next_month_reflection TEXT,
        generated_summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_month_year (year, month)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✓ monthly_reflections table ready.');

    await connection.end();
    console.log('[SUCCESS] All TiDB tables successfully initialized.');
  } catch (err) {
    console.error('[ERROR] Failed to initialize TiDB schema:', err instanceof Error ? err.message : err);
  }
}

initializeSchema();
