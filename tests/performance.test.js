import test from 'node:test';
import assert from 'node:assert/strict';

function calculateStreaksBenchmark(dailyLogs) {
  if (dailyLogs.length === 0) return { currentStreak: 0, longestStreak: 0 };
  const uniqueDates = Array.from(new Set(dailyLogs.map((l) => l.date))).sort();
  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of uniqueDates) {
    const currDate = new Date(dateStr);
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

  return { currentStreak: tempStreak, longestStreak };
}

test('Performance Benchmark - Streak calculation over 500 entries executes under 15ms', () => {
  // Generate 500 sequential synthetic log dates
  const logs = [];
  const base = new Date('2025-01-01');
  for (let i = 0; i < 500; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    logs.push({
      id: `log-${i}`,
      date: d.toISOString().slice(0, 10),
      work_done: ['Work task 1', 'Work task 2'],
    });
  }

  const start = performance.now();
  const res = calculateStreaksBenchmark(logs);
  const duration = performance.now() - start;

  assert.equal(res.longestStreak, 500);
  assert.ok(duration < 15, `Streak calculation took ${duration.toFixed(2)}ms (expected < 15ms)`);
});

function benchmarkScoreCalculation(logs, start, end) {
  const weekLogs = logs.filter((l) => l.date >= start && l.date <= end);
  let totalTasks = 0;
  let achievementsCount = 0;
  let failuresCount = 0;
  let lessonsCount = 0;

  for (const l of weekLogs) {
    totalTasks += l.work_done?.length || 0;
    achievementsCount += l.achievements?.length || 0;
    failuresCount += l.failures_and_challenges?.length || 0;
    lessonsCount += l.lessons_learned?.length || 0;
  }

  const daysCount = weekLogs.length;
  const consistencyScore = Math.min(35, Math.round((daysCount / 5) * 35));
  const volumeScore = Math.min(30, Math.round((totalTasks / 15) * 30));
  const winRatio = (achievementsCount + 1) / (achievementsCount + failuresCount + 1);
  const qualityScore = Math.min(25, Math.round(winRatio * 25));
  const learningScore =
    failuresCount > 0 ? Math.min(10, Math.round((lessonsCount / failuresCount) * 10)) : 10;

  return Math.min(100, consistencyScore + volumeScore + qualityScore + learningScore);
}

test('Performance Benchmark - Weekly score calculation over 1,000 logs executes under 20ms', () => {
  const logs = [];
  const base = new Date('2024-01-01');
  for (let i = 0; i < 1000; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    logs.push({
      id: `log-${i}`,
      date: d.toISOString().slice(0, 10),
      work_done: ['Activity 1', 'Activity 2'],
      achievements: ['Achievement A'],
      failures_and_challenges: ['Issue X'],
      lessons_learned: ['Lesson learned Y'],
    });
  }

  const start = performance.now();
  const score = benchmarkScoreCalculation(logs, '2026-01-01', '2026-01-07');
  const duration = performance.now() - start;

  assert.ok(score >= 0 && score <= 100);
  assert.ok(duration < 20, `Scoring calculation took ${duration.toFixed(2)}ms (expected < 20ms)`);
});

function benchmarkWeeklyDayBars(logs) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const logMap = new Map(logs.map((l) => [l.date, l]));
  const results = [];

  for (let i = 0; i < 7; i++) {
    const d = `2026-11-0${i + 1}`;
    const log = logMap.get(d);
    const totalItems = log
      ? (log.work_done?.length || 0) +
        (log.achievements?.length || 0) +
        (log.failures_and_challenges?.length || 0)
      : 0;

    let heightCategory = 'empty';
    if (totalItems >= 4) heightCategory = 'long';
    else if (totalItems >= 2) heightCategory = 'medium';
    else if (totalItems === 1) heightCategory = 'short';

    let colorRating = 'gray';
    if (log) {
      const ach = log.achievements?.length || 0;
      const fail = log.failures_and_challenges?.length || 0;
      if (fail > ach) colorRating = 'red';
      else if (ach > fail) colorRating = 'green';
      else colorRating = 'yellow';
    }

    results.push({
      dayIndex: i,
      dayName: dayNames[i],
      date: d,
      totalItems,
      heightCategory,
      colorRating,
    });
  }

  return results;
}

test('Performance Benchmark - Mon-Sun bar generation for 52 consecutive weeks executes under 25ms', () => {
  const logs = [];
  for (let d = 1; d <= 365; d++) {
    logs.push({
      id: `day-${d}`,
      date: `2026-11-${String((d % 28) + 1).padStart(2, '0')}`,
      work_done: ['Task 1', 'Task 2'],
      achievements: ['Won challenge'],
      failures_and_challenges: [],
    });
  }

  const start = performance.now();
  for (let w = 0; w < 52; w++) {
    const bars = benchmarkWeeklyDayBars(logs);
    assert.equal(bars.length, 7);
  }
  const duration = performance.now() - start;

  assert.ok(duration < 25, `52-week bar generation took ${duration.toFixed(2)}ms (expected < 25ms)`);
});

test('Performance Benchmark - 1,000 rapid theme transitions complete under 15ms', () => {
  const store = {};
  const mockStorage = {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => {
      store[k] = String(v);
    },
  };

  let theme = 'day';
  const start = performance.now();
  for (let i = 0; i < 1000; i++) {
    theme = theme === 'day' ? 'night' : 'day';
    mockStorage.setItem('worklog_theme_preference_v1', theme);
    const read = mockStorage.getItem('worklog_theme_preference_v1');
    assert.equal(read, theme);
  }
  const duration = performance.now() - start;

  assert.ok(duration < 15, `1,000 theme toggles took ${duration.toFixed(2)}ms (expected < 15ms)`);
});
