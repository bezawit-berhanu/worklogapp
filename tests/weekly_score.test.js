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
