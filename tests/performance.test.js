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
