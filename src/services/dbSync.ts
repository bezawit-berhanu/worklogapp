import type { DailyLog, WeeklyReflection, MonthlyReflection } from '../types';

/**
 * TiDB Cloud Synchronization & Configuration Manager
 * Manages database status, credential presence check, and sync operations.
 */
export interface TiDBConfigStatus {
  isConfigured: boolean;
  host: string;
  database: string;
  hasUser: boolean;
  hasPassword: boolean;
}

export function getTiDBStatus(): TiDBConfigStatus {
  const host = import.meta.env.VITE_TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com';
  const database = import.meta.env.VITE_TIDB_DATABASE || 'worklog';
  const hasUser = Boolean(import.meta.env.VITE_TIDB_USER && import.meta.env.VITE_TIDB_USER !== 'your_tidb_username');
  const hasPassword = Boolean(import.meta.env.VITE_TIDB_PASSWORD && import.meta.env.VITE_TIDB_PASSWORD !== 'your_tidb_password');

  return {
    isConfigured: hasUser && hasPassword,
    host,
    database,
    hasUser,
    hasPassword,
  };
}

/**
 * Format local daily log to TiDB table format
 */
export function formatDailyLogForTiDB(log: DailyLog) {
  return {
    id: log.id,
    date: log.date,
    workDone: log.work_done,
    achievements: log.achievements,
    failuresAndChallenges: log.failures_and_challenges,
    lessonsLearned: log.lessons_learned,
    highlights: log.highlights,
    overallReflection: log.overall_reflection || null,
    createdAt: new Date(log.created_at),
    updatedAt: new Date(log.updated_at),
  };
}

/**
 * Format local weekly reflection to TiDB table format
 */
export function formatWeeklyReflectionForTiDB(reflection: WeeklyReflection) {
  return {
    id: reflection.id,
    weekStartDate: reflection.week_start_date,
    weekEndDate: reflection.week_end_date,
    workDone: reflection.work_done,
    achievements: reflection.achievements,
    failuresAndChallenges: reflection.failures_and_challenges,
    lessonsLearned: reflection.lessons_learned,
    highlights: reflection.highlights,
    overallReflection: reflection.overall_reflection || null,
    generatedSummary: reflection.generated_summary || null,
    createdAt: new Date(reflection.created_at),
    updatedAt: new Date(reflection.updated_at),
  };
}

/**
 * Format local monthly reflection to TiDB table format
 */
export function formatMonthlyReflectionForTiDB(reflection: MonthlyReflection) {
  return {
    id: reflection.id,
    month: reflection.month,
    year: reflection.year,
    workDone: reflection.work_done,
    achievements: reflection.achievements,
    failuresAndChallenges: reflection.failures_and_challenges,
    lessonsLearned: reflection.lessons_learned,
    highlights: reflection.highlights,
    overallReflection: reflection.overall_reflection || null,
    nextMonthReflection: reflection.next_month_reflection || null,
    generatedSummary: reflection.generated_summary || null,
    createdAt: new Date(reflection.created_at),
    updatedAt: new Date(reflection.updated_at),
  };
}
