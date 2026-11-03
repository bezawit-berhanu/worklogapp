import test from 'node:test';
import assert from 'node:assert/strict';

function getMondaySundayBoundaries(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (dt) => {
    const yr = dt.getFullYear();
    const mo = String(dt.getMonth() + 1).padStart(2, '0');
    const da = String(dt.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  return {
    weekStart: fmt(monday),
    weekEnd: fmt(sunday),
  };
}

function calculateWeeklyScore(dailyLogs, refDate = new Date()) {
  const { weekStart, weekEnd } = getMondaySundayBoundaries(refDate);

  const prevRefDate = new Date(refDate);
  prevRefDate.setDate(prevRefDate.getDate() - 7);
  const prevWeek = getMondaySundayBoundaries(prevRefDate);

  const getWeekStats = (start, end) => {
    const weekLogs = dailyLogs.filter((l) => l.date >= start && l.date <= end);
    let totalTasks = 0;
    let achievementsCount = 0;
    let failuresCount = 0;
    let lessonsCount = 0;

    weekLogs.forEach((l) => {
      totalTasks += l.work_done?.length || 0;
      achievementsCount += l.achievements?.length || 0;
      failuresCount += l.failures_and_challenges?.length || 0;
      lessonsCount += l.lessons_learned?.length || 0;
    });

    const loggedDaysCount = weekLogs.length;

    if (loggedDaysCount === 0 && totalTasks === 0) {
      return { score: 0, loggedDaysCount, totalTasks, achievementsCount, failuresCount, lessonsCount };
    }

    const consistencyScore = Math.min(35, (loggedDaysCount / 5) * 35);
    const volumeScore = Math.min(25, totalTasks * 3.5);

    let ratioScore = 0;
    if (achievementsCount + failuresCount > 0) {
      const positiveRatio = achievementsCount / (achievementsCount + failuresCount * 0.6);
      ratioScore = Math.min(25, positiveRatio * 25);
    } else if (totalTasks > 0) {
      ratioScore = 18;
    }

    let resilienceScore = 0;
    if (failuresCount > 0) {
      const learningRatio = Math.min(1, lessonsCount / failuresCount);
      resilienceScore = Math.min(15, learningRatio * 15);
    } else if (achievementsCount > 0) {
      resilienceScore = 15;
    }

    const calculated = Math.min(100, Math.max(0, Math.round(consistencyScore + volumeScore + ratioScore + resilienceScore)));
    return { score: calculated, loggedDaysCount, totalTasks, achievementsCount, failuresCount, lessonsCount };
  };

  const currentStats = getWeekStats(weekStart, weekEnd);
  const prevStats = getWeekStats(prevWeek.weekStart, prevWeek.weekEnd);

  let trend = 'unchanged';
  let diff = 0;

  if (prevStats.score === 0 && currentStats.score === 0) {
    trend = 'baseline';
    diff = 0;
  } else if (prevStats.score === 0 && currentStats.score > 0) {
    trend = 'improved';
    diff = currentStats.score;
  } else {
    diff = Math.abs(currentStats.score - prevStats.score);
    if (currentStats.score > prevStats.score) trend = 'improved';
    else if (currentStats.score < prevStats.score) trend = 'decreased';
    else trend = 'unchanged';
  }

  return {
    score: currentStats.score,
    previousScore: prevStats.score,
    diff,
    trend,
    weekStart,
    weekEnd,
    loggedDaysCount: currentStats.loggedDaysCount,
    totalTasks: currentStats.totalTasks,
    achievementsCount: currentStats.achievementsCount,
    failuresCount: currentStats.failuresCount,
    lessonsCount: currentStats.lessonsCount,
  };
}

test('getMondaySundayBoundaries returns 7-day Monday to Sunday range', () => {
  const boundaries = getMondaySundayBoundaries(new Date('2026-10-21'));
  assert.equal(boundaries.weekStart, '2026-10-19');
  assert.equal(boundaries.weekEnd, '2026-10-25');
});

test('calculateWeeklyScore returns 0% score and baseline trend for empty logs', () => {
  const result = calculateWeeklyScore([], new Date('2026-10-21'));
  assert.equal(result.score, 0);
  assert.equal(result.diff, 0);
  assert.equal(result.trend, 'baseline');
});

test('calculateWeeklyScore awards high percentage score for consistent high-achievement week', () => {
  const dailyLogs = [
    {
      id: 'log-1',
      date: '2026-10-19',
      work_done: ['Finished course module 4', 'Implemented REST endpoints'],
      achievements: ['Completed coursework with top grade', 'Passed all test suites'],
      failures_and_challenges: [],
      lessons_learned: [],
    },
    {
      id: 'log-2',
      date: '2026-10-20',
      work_done: ['Integrated TiDB ORM schemas', 'Added unit tests'],
      achievements: ['Database migrations verified'],
      failures_and_challenges: ['SSL handshake error'],
      lessons_learned: ['Need TLSv1.2 with rejectUnauthorized for TiDB Cloud'],
    },
    {
      id: 'log-3',
      date: '2026-10-21',
      work_done: ['Reviewed computer science data structures'],
      achievements: ['Understood AVL tree balancing'],
      failures_and_challenges: [],
      lessons_learned: [],
    },
  ];

  const result = calculateWeeklyScore(dailyLogs, new Date('2026-10-21'));
  assert.ok(result.score >= 70, `Expected score >= 70, got ${result.score}`);
  assert.equal(result.loggedDaysCount, 3);
  assert.equal(result.achievementsCount, 4);
  assert.equal(result.failuresCount, 1);
});

test('calculateWeeklyScore computes improved delta when current week outperforms prior week', () => {
  const dailyLogs = [
    {
      id: 'prior-1',
      date: '2026-10-14',
      work_done: ['Setup workspace'],
      achievements: [],
      failures_and_challenges: ['Setup delays'],
      lessons_learned: [],
    },
    {
      id: 'curr-1',
      date: '2026-10-19',
      work_done: ['Shipped feature A', 'Shipped feature B'],
      achievements: ['Completed milestone 1', 'Completed milestone 2'],
      failures_and_challenges: [],
      lessons_learned: [],
    },
  ];

  const result = calculateWeeklyScore(dailyLogs, new Date('2026-10-21'));
  assert.equal(result.trend, 'improved');
  assert.ok(result.diff > 0);
  assert.ok(result.score > result.previousScore);
});

test('calculateWeeklyScore computes decreased delta when current week output drops', () => {
  const dailyLogs = [
    {
      id: 'prior-1',
      date: '2026-10-12',
      work_done: ['Built module', 'Completed lab'],
      achievements: ['Passed test', 'Earned certification'],
      failures_and_challenges: [],
      lessons_learned: [],
    },
    {
      id: 'curr-1',
      date: '2026-10-20',
      work_done: ['Quick meeting notes'],
      achievements: [],
      failures_and_challenges: ['Felt tired, didn\'t code'],
      lessons_learned: [],
    },
  ];

  const result = calculateWeeklyScore(dailyLogs, new Date('2026-10-21'));
  assert.equal(result.trend, 'decreased');
  assert.ok(result.diff > 0);
  assert.ok(result.score < result.previousScore);
});
