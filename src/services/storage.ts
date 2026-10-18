import { DailyLog, WeeklyReflection, MonthlyReflection, AppDataBackup } from '../types';

const STORAGE_KEYS = {
  DAILY_LOGS: 'worklog_daily_entries_v1',
  WEEKLY_REFLECTIONS: 'worklog_weekly_reflections_v1',
  MONTHLY_REFLECTIONS: 'worklog_monthly_reflections_v1',
  DRAFT_DAILY_LOG: 'worklog_draft_daily_v1',
};

// Seed sample entries to demonstrate the app capabilities if user clicks "Load Sample Data"
export const SAMPLE_DAILY_LOGS: DailyLog[] = [
  {
    id: 'sample-1',
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    work_done: [
      'Implemented vector search indexing pipeline for documentation assistant',
      'Refactored API error handlers and added structured logging',
      'Studied SQL window functions for cumulative retention analysis',
    ],
    achievements: [
      'Decreased documentation query latency by 42% with pre-computed embeddings',
      'Completed ALX Data Analytics advanced aggregation module ahead of schedule',
    ],
    failures_and_challenges: [
      'Struggled with memory overflow during batch embedding generation on 5,000 documents',
      'Misunderstood SQL frame clauses (ROWS vs RANGE BETWEEN) leading to skewed rolling averages',
    ],
    lessons_learned: [
      'Chunk large workloads into async streams of 250 items to keep RAM bounded',
      'Always test window functions against edge cases with duplicate timestamps to verify RANGE behavior',
    ],
    highlights: [
      'The new documentation search found exact matches for obscure syntax instantly!',
      'Deep eureka moment understanding how partition pruning accelerates analytical queries',
    ],
    overall_reflection:
      'High-focus day with breakthrough technical clarity on both backend indexing and data aggregation principles.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'sample-2',
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    work_done: [
      'Built reusable metrics calculation engine with zero external charting bloat',
      'Conducted profiling on React re-renders in heavy list views',
      'Reviewed team PR on automated schema migrations',
    ],
    achievements: [
      'Achieved a 98+ Lighthouse performance score on desktop and mobile',
      'Derived automated weekly aggregation logic without losing raw bullet granularity',
    ],
    failures_and_challenges: [
      'Encountered CSS flex wrap clipping on small viewport resolutions',
    ],
    lessons_learned: [
      'Use min-width: 0 on flex children to prevent text overflow truncation bugs',
    ],
    highlights: [
      'Pair programming session went exceptionally well; resolved a tricky state synchronization bug in 15 minutes',
    ],
    overall_reflection:
      'A satisfying day of polishing UI resilience and refining foundational data structures.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'sample-3',
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    work_done: [
      'Wrote comprehensive unit tests for calendar date boundary edge cases',
      'Designed warm editorial color palette for comfortable multi-hour reading',
      'Explored failure classification patterns to identify recurring blocker themes',
    ],
    achievements: [
      '100% test pass rate on leap year and month-end boundary computations',
      'Created intuitive failure explorer linking root causes directly to their lessons',
    ],
    failures_and_challenges: [
      'Local timezone offsets caused a 1-day shift when parsing ISO strings without date components',
    ],
    lessons_learned: [
      'Always parse YYYY-MM-DD explicitly into year, month, day components rather than relying on UTC midnight parsing',
    ],
    highlights: [
      'Received uplifting feedback on the clarity and empathy of the failure reflection framework',
    ],
    overall_reflection:
      'A deeply reflective session that validated the core philosophy: failures are data points for deliberate growth.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

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
    const existing = this.getDailyLogs();
    if (existing.length === 0) {
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(SAMPLE_DAILY_LOGS));
    }
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.WEEKLY_REFLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.MONTHLY_REFLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.DRAFT_DAILY_LOG);
  }
}

export const storage = new StorageService();
