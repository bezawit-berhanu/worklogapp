import type { DailyLog, WeeklyReflection, MonthlyReflection } from '../types';

export interface WeekRange {
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string;   // YYYY-MM-DD (Sunday)
  label: string;
}

// Helper to get start and end of week (Monday to Sunday) for any given date
export function getWeekRange(dateInput: Date | string): WeekRange {
  const d = typeof dateInput === 'string' ? parseDateString(dateInput) : new Date(dateInput);
  const day = d.getDay();
  // Monday is 1, Sunday is 0
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startDate = formatDateString(monday);
  const endDate = formatDateString(sunday);

  const startFormatted = monday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endFormatted = sunday.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    startDate,
    endDate,
    label: `${startFormatted} – ${endFormatted}`,
  };
}

export function parseDateString(str: string): Date {
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getMonthName(monthNumber: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || '';
}

// Generate an intelligent structured weekly overview from daily logs of that week
export function generateWeeklyOverview(
  dailyLogs: DailyLog[],
  weekStart: string,
  weekEnd: string
): {
  daysLoggedCount: number;
  workDone: string[];
  achievements: string[];
  failuresAndChallenges: string[];
  lessonsLearned: string[];
  highlights: string[];
  summaryNarrative: string;
} {
  const weekLogs = dailyLogs.filter(
    (log) => log.date >= weekStart && log.date <= weekEnd
  );

  const daysLoggedCount = weekLogs.length;

  const workDone = Array.from(new Set(weekLogs.flatMap((log) => log.work_done || []))).filter(Boolean);
  const achievements = Array.from(new Set(weekLogs.flatMap((log) => log.achievements || []))).filter(Boolean);
  const failuresAndChallenges = Array.from(
    new Set(weekLogs.flatMap((log) => log.failures_and_challenges || []))
  ).filter(Boolean);
  const lessonsLearned = Array.from(
    new Set(weekLogs.flatMap((log) => log.lessons_learned || []))
  ).filter(Boolean);
  const highlights = Array.from(new Set(weekLogs.flatMap((log) => log.highlights || []))).filter(Boolean);

  let summaryNarrative = '';
  if (daysLoggedCount === 0) {
    summaryNarrative = `No daily logs were recorded for the week of ${weekStart} to ${weekEnd}. You can still write your weekly reflection manually.`;
  } else {
    summaryNarrative = `Week of ${weekStart} to ${weekEnd}: Recorded ${daysLoggedCount} ${
      daysLoggedCount === 1 ? 'day' : 'days'
    } of daily work. Accomplished ${achievements.length} measurable ${
      achievements.length === 1 ? 'achievement' : 'achievements'
    }, faced ${failuresAndChallenges.length} ${
      failuresAndChallenges.length === 1 ? 'challenge' : 'challenges'
    }, distilled ${lessonsLearned.length} key ${
      lessonsLearned.length === 1 ? 'lesson' : 'lessons'
    }, and recorded ${highlights.length} memorable ${
      highlights.length === 1 ? 'highlight' : 'highlights'
    }.`;
  }

  return {
    daysLoggedCount,
    workDone,
    achievements,
    failuresAndChallenges,
    lessonsLearned,
    highlights,
    summaryNarrative,
  };
}

// Generate an intelligent structured monthly overview from daily and weekly logs
export function generateMonthlyOverview(
  dailyLogs: DailyLog[],
  weeklyReflections: WeeklyReflection[],
  year: number,
  month: number
): {
  daysLoggedCount: number;
  totalAchievements: number;
  totalFailures: number;
  totalLessons: number;
  totalHighlights: number;
  workDone: string[];
  achievements: string[];
  failuresAndChallenges: string[];
  lessonsLearned: string[];
  highlights: string[];
  summaryNarrative: string;
  comparisonText: string;
} {
  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const monthDailyLogs = dailyLogs.filter((log) => log.date.startsWith(monthPrefix));
  const daysLoggedCount = monthDailyLogs.length;

  // Aggregate daily items
  const dailyWork = monthDailyLogs.flatMap((l) => l.work_done || []);
  const dailyAchievements = monthDailyLogs.flatMap((l) => l.achievements || []);
  const dailyFailures = monthDailyLogs.flatMap((l) => l.failures_and_challenges || []);
  const dailyLessons = monthDailyLogs.flatMap((l) => l.lessons_learned || []);
  const dailyHighlights = monthDailyLogs.flatMap((l) => l.highlights || []);

  // Filter weekly reflections that fall in this month
  const monthWeekly = weeklyReflections.filter((w) => w.week_start_date.startsWith(monthPrefix));
  const weeklyWork = monthWeekly.flatMap((w) => w.work_done || []);
  const weeklyAchievements = monthWeekly.flatMap((w) => w.achievements || []);
  const weeklyFailures = monthWeekly.flatMap((w) => w.failures_and_challenges || []);
  const weeklyLessons = monthWeekly.flatMap((w) => w.lessons_learned || []);
  const weeklyHighlights = monthWeekly.flatMap((w) => w.highlights || []);

  const workDone = Array.from(new Set([...dailyWork, ...weeklyWork])).filter(Boolean);
  const achievements = Array.from(new Set([...dailyAchievements, ...weeklyAchievements])).filter(Boolean);
  const failuresAndChallenges = Array.from(new Set([...dailyFailures, ...weeklyFailures])).filter(Boolean);
  const lessonsLearned = Array.from(new Set([...dailyLessons, ...weeklyLessons])).filter(Boolean);
  const highlights = Array.from(new Set([...dailyHighlights, ...weeklyHighlights])).filter(Boolean);

  // Month comparison: find previous month
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthPrefix = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  const prevMonthDailyLogs = dailyLogs.filter((l) => l.date.startsWith(prevMonthPrefix));
  const prevAchievementsCount = prevMonthDailyLogs.flatMap((l) => l.achievements || []).length;
  const prevDaysCount = prevMonthDailyLogs.length;

  let comparisonText = '';
  if (prevDaysCount === 0 && daysLoggedCount > 0) {
    comparisonText = `First active month recorded with ${daysLoggedCount} days of focused logging.`;
  } else if (prevDaysCount > 0) {
    const daysDiff = daysLoggedCount - prevDaysCount;
    const achDiff = achievements.length - prevAchievementsCount;
    const daysSign = daysDiff >= 0 ? `+${daysDiff}` : `${daysDiff}`;
    const achSign = achDiff >= 0 ? `+${achDiff}` : `${achDiff}`;
    comparisonText = `Compared to ${getMonthName(prevMonth)} ${prevYear}: ${daysSign} logged days (${daysLoggedCount} vs ${prevDaysCount}), and ${achSign} recorded achievements (${achievements.length} vs ${prevAchievementsCount}).`;
  } else {
    comparisonText = 'No previous month data available for direct comparison yet.';
  }

  const summaryNarrative = `${getMonthName(month)} ${year} Growth Summary: You logged ${daysLoggedCount} daily sessions, accumulating ${achievements.length} major accomplishments, encountering ${failuresAndChallenges.length} challenges, extracting ${lessonsLearned.length} lessons, and celebrating ${highlights.length} memorable breakthroughs. ${comparisonText}`;

  return {
    daysLoggedCount,
    totalAchievements: achievements.length,
    totalFailures: failuresAndChallenges.length,
    totalLessons: lessonsLearned.length,
    totalHighlights: highlights.length,
    workDone,
    achievements,
    failuresAndChallenges,
    lessonsLearned,
    highlights,
    summaryNarrative,
    comparisonText,
  };
}
