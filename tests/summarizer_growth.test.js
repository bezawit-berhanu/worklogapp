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

function generateMonthlyNarrative(month, year, daysLoggedCount, achievementsCount, failuresCount, lessonsCount, highlightsCount) {
  const conversionRate = failuresCount > 0
    ? Math.min(100, Math.round((lessonsCount / failuresCount) * 100))
    : 100;

  return `Month ${month}/${year}: You logged ${daysLoggedCount} daily sessions, accumulating ${achievementsCount} major accomplishments, encountering ${failuresCount} challenges, extracting ${lessonsCount} lessons (${conversionRate}% obstacle-to-learning resilience), and celebrating ${highlightsCount} breakthroughs.`;
}

test('generateMonthlyNarrative calculates obstacle-to-learning resilience percentage', () => {
  const narrative = generateMonthlyNarrative(10, 2026, 18, 25, 10, 8, 12);
  assert.ok(narrative.includes('80% obstacle-to-learning resilience'));
  assert.ok(narrative.includes('25 major accomplishments'));
});
