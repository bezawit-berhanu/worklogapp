import test from 'node:test';
import assert from 'node:assert/strict';

function generateWeeklyNarrative(daysLoggedCount, achievementsCount, failuresCount, lessonsCount, highlightsCount, weekStart = '2026-10-19', weekEnd = '2026-10-25') {
  if (daysLoggedCount === 0) {
    return `No daily logs were recorded for the week of ${weekStart} to ${weekEnd}.`;
  }
  const positiveScore = achievementsCount > 0
    ? Math.round((achievementsCount / (achievementsCount + failuresCount * 0.7)) * 100)
    : (failuresCount === 0 ? 100 : 40);

  return `Week of ${weekStart} to ${weekEnd}: Recorded ${daysLoggedCount} days (${Math.min(100, Math.round((daysLoggedCount / 5) * 100))}% weekly consistency). Accomplished ${achievementsCount} achievements, faced ${failuresCount} challenges, distilled ${lessonsCount} lessons, and recorded ${highlightsCount} highlights. Weekly achievement ratio: ${positiveScore}%.`;
}

test('generateWeeklyNarrative produces accurate consistency rate and positive achievement ratio', () => {
  const narrative = generateWeeklyNarrative(4, 5, 2, 2, 3);
  assert.ok(narrative.includes('80% weekly consistency'));
  assert.ok(narrative.includes('Weekly achievement ratio: 78%'));
});
