import test from 'node:test';
import assert from 'node:assert/strict';

function formatDailyLogForTiDB(log) {
  return {
    id: log.id,
    date: log.date,
    workDone: log.work_done,
    achievements: log.achievements,
    failuresAndChallenges: log.failures_and_challenges,
    lessonsLearned: log.lessons_learned,
    highlights: log.highlights,
    overallReflection: log.overall_reflection || null,
    createdAt: new Date(log.created_at),
    updatedAt: new Date(log.updated_at),
  };
}

test('formatDailyLogForTiDB converts frontend DailyLog into TiDB ORM table record', () => {
  const localLog = {
    id: 'log-101',
    date: '2026-10-21',
    work_done: ['Implemented TiDB Cloud tables'],
    achievements: ['Drizzle schema defined with SSL pool'],
    failures_and_challenges: ['Credentials missing in test env'],
    lessons_learned: ['Add helpful .env validation and fallback'],
    highlights: ['TiDB integration complete'],
    overall_reflection: 'Great day of backend architecture',
    created_at: '2026-10-21T10:00:00.000Z',
    updated_at: '2026-10-21T18:00:00.000Z',
  };

  const formatted = formatDailyLogForTiDB(localLog);
  assert.equal(formatted.id, 'log-101');
  assert.equal(formatted.date, '2026-10-21');
  assert.deepEqual(formatted.workDone, ['Implemented TiDB Cloud tables']);
  assert.deepEqual(formatted.achievements, ['Drizzle schema defined with SSL pool']);
  assert.ok(formatted.createdAt instanceof Date);
  assert.equal(formatted.overallReflection, 'Great day of backend architecture');
});
