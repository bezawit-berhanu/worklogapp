import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateWeeklyScore, getMondaySundayBoundaries } from '../src/services/analytics.ts';

test('getMondaySundayBoundaries returns 7-day Monday to Sunday range', () => {
  const boundaries = getMondaySundayBoundaries(new Date('2026-10-21')); // Wednesday
  assert.equal(boundaries.weekStart, '2026-10-19'); // Monday
  assert.equal(boundaries.weekEnd, '2026-10-25');   // Sunday
});
