import type { DailyLog, WeeklyReflection, MonthlyReflection, AppDataBackup } from '../types';
import { getMondaySundayBoundaries } from './analytics';

const STORAGE_KEYS = {
  DAILY_LOGS: 'worklog_daily_entries_v1',
  WEEKLY_REFLECTIONS: 'worklog_weekly_reflections_v1',
  MONTHLY_REFLECTIONS: 'worklog_monthly_reflections_v1',
  DRAFT_DAILY_LOG: 'worklog_draft_daily_v1',
};

/**
 * Dynamically builds realistic sample logs aligned with the current week Monday-Sunday
 * and previous week to demonstrate all features:
 * - Long Green bar (Mon)
 * - Long Yellow bar (Tue)
 * - Long Red bar (Wed)
 * - Medium Green bar (Thu)
 * - Short Green bar (Fri)
 * - Focus recommendations & achievement evaluations
 */
export function generateSampleLogs(): DailyLog[] {
  const { weekStart } = getMondaySundayBoundaries(new Date());
  const [y, m, d] = weekStart.split('-').map(Number);
  const monday = new Date(y, m - 1, d);

  const getOffsetDate = (dayOffset: number) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + dayOffset);
    const yr = dt.getFullYear();
    const mo = String(dt.getMonth() + 1).padStart(2, '0');
    const da = String(dt.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  return [
    // Previous Week Baseline
    {
      id: 'sample-prev-1',
      date: getOffsetDate(-7),
      work_done: ['Project initial setup', 'Reviewing repository guidelines'],
      achievements: ['Setup environment'],
      failures_and_challenges: ['Slow internet connection delayed npm installs'],
      lessons_learned: ['Cache dependencies locally to avoid network bottlenecks'],
      highlights: ['Kicked off professional work log project'],
      overall_reflection: 'Initial exploratory progress.',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    // Monday: High Output + Performed Well -> LONG GREEN BAR
    {
      id: 'sample-mon',
      date: getOffsetDate(0),
      work_done: [
        'Implemented vector search indexing pipeline for documentation assistant',
        'Refactored API error handlers and added structured logging',
        'Configured Drizzle ORM schemas with TiDB Cloud connection pool',
      ],
      achievements: [
        'Decreased documentation query latency by 42% with pre-computed embeddings',
        'Shipped full database migration suite with TLSv1.2 encryption',
      ],
      failures_and_challenges: [
        'Fell behind on course module 3 lectures and missed tutorial exercises',
      ],
      lessons_learned: [
        'Must block out dedicated morning hours for core coursework lectures',
      ],
      highlights: [
        'The new vector search found exact matches for obscure syntax instantly!',
        'Pair programming breakthrough with clean ORM architecture',
      ],
      overall_reflection:
        'Outstanding high-output start to the week with significant technical milestones.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Tuesday: High Output + Average Performance -> LONG YELLOW BAR
    {
      id: 'sample-tue',
      date: getOffsetDate(1),
      work_done: [
        'Attended 2 technical workshops on distributed databases',
        'Read chapters 4 and 5 of database architecture book',
      ],
      achievements: [
        'Completed comprehensive reading notes on write-ahead logging',
      ],
      failures_and_challenges: [
        'Did not finish practical code exercises due to prolonged meeting sessions',
      ],
      lessons_learned: [
        'Balance theoretical study with immediate hands-on coding drills',
      ],
      highlights: [
        'Deep discussion with fellow engineers on distributed consensus protocols',
      ],
      overall_reflection:
        'A steady, routine study day with balanced progress across theory and notes.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Wednesday: High Output + Most of it is Failure -> LONG RED BAR
    {
      id: 'sample-wed',
      date: getOffsetDate(2),
      work_done: [
        'Spent 7 hours debugging database cluster connection drops',
      ],
      achievements: [],
      failures_and_challenges: [
        'SSL handshake error: certificate authority unknown on legacy node',
        'Connection pool exhausted under concurrent stress testing',
        'Database credentials rejected due to unescaped special characters in .env',
      ],
      lessons_learned: [
        'Verify TLS versions and certificate bundles before running batch queries',
        'Always URL-encode special characters in MySQL connection strings',
      ],
      highlights: [
        'Identified the exact line in connection pool configuration causing the memory leak',
      ],
      overall_reflection:
        'Extremely challenging day with repeated blockers, but extracted crucial infrastructure lessons.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Thursday: Steady Output + High Wins -> MEDIUM GREEN BAR
    {
      id: 'sample-thu',
      date: getOffsetDate(3),
      work_done: [
        'Added unit tests for weekly score and performance metrics',
      ],
      achievements: [
        '100% test pass rate across 16 test suites',
        'Integrated responsive WeeklyPerformanceBarGraph widget',
      ],
      failures_and_challenges: [],
      lessons_learned: [],
      highlights: [
        'All test suites executed in under 250ms with zero errors',
      ],
      overall_reflection:
        'High productivity day recovering smoothly from yesterday\'s setbacks.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Friday: Single Task + Win -> SHORT GREEN BAR
    {
      id: 'sample-fri',
      date: getOffsetDate(4),
      work_done: [
        'Documented TiDB cloud setup and deployment instructions in README',
      ],
      achievements: [
        'Completed comprehensive technical documentation guide',
      ],
      failures_and_challenges: [],
      lessons_learned: [],
      highlights: [
        'Clear documentation appreciated by teammates',
      ],
      overall_reflection:
        'Focused wrap-up to the week\'s core development tasks.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
}

export const SAMPLE_DAILY_LOGS: DailyLog[] = generateSampleLogs();

class StorageService {
  // ---- Daily Logs ----
  getDailyLogs(): DailyLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      if (!data) return [];
      const parsed: DailyLog[] = JSON.parse(data);
      return parsed.sort((a, b) => b.date.localeCompare(a.date));
    } catch (e) {
      console.error('Failed to load daily logs from localStorage:', e);
      return [];
    }
  }

  getDailyLogByDate(date: string): DailyLog | undefined {
    const logs = this.getDailyLogs();
    return logs.find((log) => log.date === date);
  }

  getDailyLogById(id: string): DailyLog | undefined {
    const logs = this.getDailyLogs();
    return logs.find((log) => log.id === id);
  }

  saveDailyLog(log: DailyLog): { success: boolean; error?: string } {
    try {
      const logs = this.getDailyLogs();
      const existingIndex = logs.findIndex((item) => item.id === log.id);
      
      // Check for duplicate date with different id
      const duplicateDateLog = logs.find((item) => item.date === log.date && item.id !== log.id);
      if (duplicateDateLog) {
        return {
          success: false,
          error: `An entry for ${log.date} already exists. Please edit that entry instead of creating a duplicate.`,
        };
      }

      if (existingIndex >= 0) {
        logs[existingIndex] = {
          ...log,
          updated_at: new Date().toISOString(),
        };
      } else {
        logs.push({
          ...log,
          created_at: log.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
      // Clear draft if it matches this log's date
      this.clearDailyDraft();
      return { success: true };
    } catch (e) {
      console.error('Error saving daily log:', e);
      return { success: false, error: 'Could not write to local storage.' };
    }
  }

  deleteDailyLog(id: string): boolean {
    try {
      const logs = this.getDailyLogs().filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
      return true;
    } catch (e) {
      console.error('Error deleting daily log:', e);
      return false;
    }
  }

  // Draft daily log
  getDailyDraft(): Partial<DailyLog> | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DRAFT_DAILY_LOG);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  saveDailyDraft(draft: Partial<DailyLog>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT_DAILY_LOG, JSON.stringify(draft));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }

  clearDailyDraft(): void {
    localStorage.removeItem(STORAGE_KEYS.DRAFT_DAILY_LOG);
  }

  // ---- Weekly Reflections ----
  getWeeklyReflections(): WeeklyReflection[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_REFLECTIONS);
      if (!data) return [];
      const parsed: WeeklyReflection[] = JSON.parse(data);
      return parsed.sort((a, b) => b.week_start_date.localeCompare(a.week_start_date));
    } catch (e) {
      console.error('Failed to load weekly reflections:', e);
      return [];
    }
  }

  getWeeklyReflectionById(id: string): WeeklyReflection | undefined {
    return this.getWeeklyReflections().find((item) => item.id === id);
  }

  getWeeklyReflectionByWeek(startDate: string): WeeklyReflection | undefined {
    return this.getWeeklyReflections().find((item) => item.week_start_date === startDate);
  }

  saveWeeklyReflection(reflection: WeeklyReflection): { success: boolean; error?: string } {
    try {
      const reflections = this.getWeeklyReflections();
      const existingIndex = reflections.findIndex((item) => item.id === reflection.id);

      if (existingIndex >= 0) {
        reflections[existingIndex] = {
          ...reflection,
          updated_at: new Date().toISOString(),
        };
      } else {
        reflections.push({
          ...reflection,
          created_at: reflection.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      localStorage.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, JSON.stringify(reflections));
      return { success: true };
    } catch (e) {
      console.error('Error saving weekly reflection:', e);
      return { success: false, error: 'Could not save weekly reflection.' };
    }
  }

  deleteWeeklyReflection(id: string): boolean {
    try {
      const filtered = this.getWeeklyReflections().filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.WEEKLY_REFLECTIONS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting weekly reflection:', e);
      return false;
    }
  }

  // ---- Monthly Reflections ----
  getMonthlyReflections(): MonthlyReflection[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MONTHLY_REFLECTIONS);
      if (!data) return [];
      const parsed: MonthlyReflection[] = JSON.parse(data);
      return parsed.sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
    } catch (e) {
      console.error('Failed to load monthly reflections:', e);
      return [];
    }
  }

  getMonthlyReflectionById(id: string): MonthlyReflection | undefined {
    return this.getMonthlyReflections().find((item) => item.id === id);
  }

  getMonthlyReflectionByYearMonth(year: number, month: number): MonthlyReflection | undefined {
    return this.getMonthlyReflections().find((item) => item.year === year && item.month === month);
  }

  saveMonthlyReflection(reflection: MonthlyReflection): { success: boolean; error?: string } {
    try {
      const list = this.getMonthlyReflections();
      const existingIndex = list.findIndex((item) => item.id === reflection.id);

      if (existingIndex >= 0) {
        list[existingIndex] = {
          ...reflection,
          updated_at: new Date().toISOString(),
        };
      } else {
        list.push({
          ...reflection,
          created_at: reflection.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      localStorage.setItem(STORAGE_KEYS.MONTHLY_REFLECTIONS, JSON.stringify(list));
      return { success: true };
    } catch (e) {
      console.error('Error saving monthly reflection:', e);
      return { success: false, error: 'Could not save monthly reflection.' };
    }
  }

  deleteMonthlyReflection(id: string): boolean {
    try {
      const filtered = this.getMonthlyReflections().filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.MONTHLY_REFLECTIONS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting monthly reflection:', e);
      return false;
    }
  }

  // ---- Backup & Export / Import ----
  exportBackup(): AppDataBackup {
    return {
      version: 1,
      exported_at: new Date().toISOString(),
      daily_logs: this.getDailyLogs(),
      weekly_reflections: this.getWeeklyReflections(),
      monthly_reflections: this.getMonthlyReflections(),
    };
  }

  importBackup(backup: AppDataBackup): { success: boolean; count: number; error?: string } {
    try {
      if (!backup || !Array.isArray(backup.daily_logs)) {
        return { success: false, count: 0, error: 'Invalid backup file structure.' };
      }

      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(backup.daily_logs || []));
      localStorage.setItem(
        STORAGE_KEYS.WEEKLY_REFLECTIONS,
        JSON.stringify(backup.weekly_reflections || [])
      );
      localStorage.setItem(
        STORAGE_KEYS.MONTHLY_REFLECTIONS,
        JSON.stringify(backup.monthly_reflections || [])
      );

      const total =
        (backup.daily_logs?.length || 0) +
        (backup.weekly_reflections?.length || 0) +
        (backup.monthly_reflections?.length || 0);

      return { success: true, count: total };
    } catch (e) {
      console.error('Import failed:', e);
      return { success: false, count: 0, error: 'Failed to restore backup.' };
    }
  }

  loadSampleData(): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(generateSampleLogs()));
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_REFLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.MONTHLY_REFLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.DRAFT_DAILY_LOG);
  }
}

export const storage = new StorageService();
