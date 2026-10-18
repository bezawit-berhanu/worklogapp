import type {
  DailyLog,
  WeeklyReflection,
  MonthlyReflection,
  OverallStats,
  FailureLearningItem,
  RecurringChallengeTheme,
  ConsistencyDay,
  DateRangeFilter,
} from '../types';
import { parseDateString, formatDateString } from './summarizer';

export function calculateOverallStats(
  dailyLogs: DailyLog[],
  weeklyReflections: WeeklyReflection[],
  monthlyReflections: MonthlyReflection[]
): OverallStats {
  const totalDailyLogs = dailyLogs.length;
  const totalWeeklyReflections = weeklyReflections.length;
  const totalMonthlyReflections = monthlyReflections.length;

  let totalAchievements = 0;
  let totalFailuresAndChallenges = 0;
  let totalLessonsLearned = 0;
  let totalHighlights = 0;

  dailyLogs.forEach((log) => {
    totalAchievements += log.achievements?.length || 0;
    totalFailuresAndChallenges += log.failures_and_challenges?.length || 0;
    totalLessonsLearned += log.lessons_learned?.length || 0;
    totalHighlights += log.highlights?.length || 0;
  });

  // Calculate days logged this month
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const daysLoggedThisMonth = new Set(
    dailyLogs.filter((log) => log.date.startsWith(currentMonthPrefix)).map((log) => log.date)
  ).size;

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(dailyLogs);

  return {
    totalDailyLogs,
    totalWeeklyReflections,
    totalMonthlyReflections,
    totalAchievements,
    totalFailuresAndChallenges,
    totalLessonsLearned,
    totalHighlights,
    daysLoggedThisMonth,
    currentStreak,
    longestStreak,
  };
}

export function calculateStreaks(dailyLogs: DailyLog[]): { currentStreak: number; longestStreak: number } {
  if (dailyLogs.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const uniqueDates = Array.from(new Set(dailyLogs.map((l) => l.date))).sort();
  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of uniqueDates) {
    const currDate = parseDateString(dateStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currDate;
  }

  // Current streak calculation (checking if streak includes today or yesterday)
  const today = formatDateString(new Date());
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = formatDateString(yesterdayDate);

  const datesSet = new Set(uniqueDates);
  let currentStreak = 0;

  if (datesSet.has(today)) {
    let checkDate = new Date();
    while (datesSet.has(formatDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (datesSet.has(yesterday)) {
    let checkDate = new Date(yesterdayDate);
    while (datesSet.has(formatDateString(checkDate))) {
      currentStreak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return { currentStreak, longestStreak };
}

// Filter logs by date range filter
export function filterLogsByDateRange<T extends { date?: string; week_start_date?: string; year?: number; month?: number }>(
  items: T[],
  filter: DateRangeFilter
): T[] {
  if (filter.period === 'all') return items;

  const now = new Date();
  let startLimit: Date;

  if (filter.period === '7d') {
    startLimit = new Date();
    startLimit.setDate(now.getDate() - 7);
  } else if (filter.period === '30d') {
    startLimit = new Date();
    startLimit.setDate(now.getDate() - 30);
  } else if (filter.period === '90d') {
    startLimit = new Date();
    startLimit.setDate(now.getDate() - 90);
  } else if (filter.period === 'this_year') {
    startLimit = new Date(now.getFullYear(), 0, 1);
  } else if (filter.period === 'custom' && filter.startDate) {
    startLimit = parseDateString(filter.startDate);
  } else {
    return items;
  }

  const startLimitStr = formatDateString(startLimit);
  const endLimitStr = filter.endDate || formatDateString(now);

  return items.filter((item) => {
    if ('date' in item && typeof item.date === 'string') {
      return item.date >= startLimitStr && item.date <= endLimitStr;
    }
    if ('week_start_date' in item && typeof item.week_start_date === 'string') {
      return item.week_start_date >= startLimitStr && item.week_start_date <= endLimitStr;
    }
    if ('year' in item && 'month' in item && typeof item.year === 'number' && typeof item.month === 'number') {
      const itemPrefix = `${item.year}-${String(item.month).padStart(2, '0')}`;
      return itemPrefix >= startLimitStr.slice(0, 7) && itemPrefix <= endLimitStr.slice(0, 7);
    }
    return true;
  });
}

// Build Failure & Learning explorer items
export function extractFailureLearningRecords(dailyLogs: DailyLog[]): FailureLearningItem[] {
  const records: FailureLearningItem[] = [];

  dailyLogs.forEach((log) => {
    const failures = log.failures_and_challenges || [];
    const lessons = log.lessons_learned || [];

    failures.forEach((failure, idx) => {
      records.push({
        id: `${log.id}-f-${idx}`,
        logId: log.id,
        date: log.date,
        failure,
        relatedLesson: lessons[idx] || (lessons.length > 0 ? lessons[0] : undefined),
      });
    });
  });

  return records.sort((a, b) => b.date.localeCompare(a.date));
}

// Analyze recurring challenge themes
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
  'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when', 'where',
  'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'can', 'just', 'should', 'now', 'struggled', 'trying', 'encounter',
  'encountered', 'issue', 'problem', 'during', 'when', 'while', 'because', 'due'
]);

export function analyzeRecurringThemes(failures: string[]): RecurringChallengeTheme[] {
  if (failures.length === 0) return [];

  const wordFrequency: Record<string, { count: number; examples: string[] }> = {};

  failures.forEach((text) => {
    // clean tokens
    const tokens = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-_]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

    const seenInThisFailure = new Set<string>();
    tokens.forEach((token) => {
      if (!seenInThisFailure.has(token)) {
        seenInThisFailure.add(token);
        if (!wordFrequency[token]) {
          wordFrequency[token] = { count: 0, examples: [] };
        }
        wordFrequency[token].count += 1;
        if (wordFrequency[token].examples.length < 2) {
          wordFrequency[token].examples.push(text);
        }
      }
    });
  });

  // Convert to sorted list of themes with count >= 2 or top results
  const themes = Object.entries(wordFrequency)
    .filter(([, data]) => data.count >= 1)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([word, data]) => ({
      theme: word.charAt(0).toUpperCase() + word.slice(1),
      count: data.count,
      trend: (data.count > 2 ? 'increasing' : 'stable') as 'increasing' | 'decreasing' | 'stable',
      examples: data.examples,
    }));

  return themes;
}

// Generate consistency heatmap data for the past N weeks (e.g., 16 weeks / ~112 days)
export function generateConsistencyGrid(dailyLogs: DailyLog[], weeksCount = 16): {
  weeks: { days: ConsistencyDay[] }[];
  totalLoggedDays: number;
  totalDays: number;
  completionRate: number;
} {
  const logMap = new Map<string, DailyLog>();
  dailyLogs.forEach((l) => logMap.set(l.date, l));

  const today = new Date();
  // Align to end on Saturday/Sunday
  const endDate = new Date(today);
  const totalDays = weeksCount * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalDays + 1);

  const days: ConsistencyDay[] = [];
  let loggedCount = 0;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = formatDateString(d);
    const log = logMap.get(dateStr);

    if (log) {
      loggedCount += 1;
      const totalEntries =
        (log.work_done?.length || 0) +
        (log.achievements?.length || 0) +
        (log.failures_and_challenges?.length || 0) +
        (log.highlights?.length || 0);

      days.push({
        date: dateStr,
        hasLog: true,
        entriesCount: totalEntries,
        achievementsCount: log.achievements?.length || 0,
        failuresCount: log.failures_and_challenges?.length || 0,
        highlightsCount: log.highlights?.length || 0,
      });
    } else {
      days.push({
        date: dateStr,
        hasLog: false,
        entriesCount: 0,
        achievementsCount: 0,
        failuresCount: 0,
        highlightsCount: 0,
      });
    }
  }

  // Chunk into columns of 7 days (weeks)
  const weeks: { days: ConsistencyDay[] }[] = [];
  for (let w = 0; w < weeksCount; w++) {
    weeks.push({
      days: days.slice(w * 7, (w + 1) * 7),
    });
  }

  const completionRate = totalDays > 0 ? Math.round((loggedCount / totalDays) * 100) : 0;

  return {
    weeks,
    totalLoggedDays: loggedCount,
    totalDays,
    completionRate,
  };
}

// Aggregate time-series for trend charts (grouped by month or week)
export interface TrendDataPoint {
  label: string;
  achievements: number;
  failures: number;
  lessons: number;
  highlights: number;
  logsCount: number;
}

export function generateMonthlyTrends(dailyLogs: DailyLog[], monthsCount = 6): TrendDataPoint[] {
  const result: TrendDataPoint[] = [];
  const now = new Date();

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const prefix = `${y}-${String(m).padStart(2, '0')}`;
    const label = d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });

    const monthLogs = dailyLogs.filter((l) => l.date.startsWith(prefix));
    let achievements = 0;
    let failures = 0;
    let lessons = 0;
    let highlights = 0;

    monthLogs.forEach((l) => {
      achievements += l.achievements?.length || 0;
      failures += l.failures_and_challenges?.length || 0;
      lessons += l.lessons_learned?.length || 0;
      highlights += l.highlights?.length || 0;
    });

    result.push({
      label,
      achievements,
      failures,
      lessons,
      highlights,
      logsCount: monthLogs.length,
    });
  }

  return result;
}
