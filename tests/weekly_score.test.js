import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateWeeklyScore, getMondaySundayBoundaries } from '../src/services/analytics.ts';

test('getMondaySundayBoundaries returns 7-day Monday to Sunday range', () => {
  const boundaries = getMondaySundayBoundaries(new Date('2026-10-21')); // Wednesday
  assert.equal(boundaries.weekStart, '2026-10-19'); // Monday
  assert.equal(boundaries.weekEnd, '2026-10-25');   // Sunday
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
      highlights: ['Great productive morning'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'log-2',
      date: '2026-10-20',
      work_done: ['Integrated TiDB ORM schemas', 'Added unit tests'],
      achievements: ['Database migrations verified'],
      failures_and_challenges: ['SSL handshake error'],
      lessons_learned: ['Need TLSv1.2 with rejectUnauthorized for TiDB Cloud'],
      highlights: ['TiDB running smoothly'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'log-3',
      date: '2026-10-21',
      work_done: ['Reviewed computer science data structures'],
      achievements: ['Understood AVL tree balancing'],
      failures_and_challenges: [],
      lessons_learned: [],
      highlights: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const result = calculateWeeklyScore(dailyLogs, new Date('2026-10-21'));
  assert.ok(result.score >= 70, `Expected score >= 70, got ${result.score}`);
  assert.equal(result.loggedDaysCount, 3);
  assert.equal(result.achievementsCount, 4);
  assert.equal(result.failuresCount, 1);
});
