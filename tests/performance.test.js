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
