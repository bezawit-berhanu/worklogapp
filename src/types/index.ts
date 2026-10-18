export type ReflectionCategory =
  | 'work_done'
  | 'achievements'
  | 'failures_and_challenges'
  | 'lessons_learned'
  | 'highlights'
  | 'overall_reflection';

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  work_done: string[];
  achievements: string[];
  failures_and_challenges: string[];
  lessons_learned: string[];
  highlights: string[];
  overall_reflection?: string;
  is_draft?: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeeklyReflection {
  id: string;
  week_start_date: string; // YYYY-MM-DD
  week_end_date: string;   // YYYY-MM-DD
  work_done: string[];
  achievements: string[];
  failures_and_challenges: string[];
  lessons_learned: string[];
  highlights: string[];
  overall_reflection: string;
  generated_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyReflection {
  id: string;
  year: number;
  month: number; // 1 - 12
  work_done: string[];
  achievements: string[];
  failures_and_challenges: string[];
  lessons_learned: string[];
  highlights: string[];
  overall_reflection: string;
  next_month_reflection?: string; // Growth intentions & reflection notes
  generated_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface AppDataBackup {
  version: number;
  exported_at: string;
  daily_logs: DailyLog[];
  weekly_reflections: WeeklyReflection[];
  monthly_reflections: MonthlyReflection[];
}

export interface OverallStats {
  totalDailyLogs: number;
  totalWeeklyReflections: number;
  totalMonthlyReflections: number;
  totalAchievements: number;
  totalFailuresAndChallenges: number;
  totalLessonsLearned: number;
  totalHighlights: number;
  daysLoggedThisMonth: number;
  currentStreak: number;
  longestStreak: number;
}

export interface FailureLearningItem {
  id: string;
  logId: string;
  date: string;
  failure: string;
  relatedLesson?: string;
}

export interface RecurringChallengeTheme {
  theme: string;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  examples: string[];
}

export interface ConsistencyDay {
  date: string; // YYYY-MM-DD
  hasLog: boolean;
  entriesCount: number; // total bullet items
  achievementsCount: number;
  failuresCount: number;
  highlightsCount: number;
}

export interface DateRangeFilter {
  period: '7d' | '30d' | '90d' | 'this_year' | 'all' | 'custom';
  startDate?: string;
  endDate?: string;
}

export type ActivePage = 'dashboard' | 'daily' | 'weekly' | 'monthly' | 'search';
