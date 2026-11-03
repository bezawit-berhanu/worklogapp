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

function formatWeeklyReflectionForTiDB(reflection) {
  return {
    id: reflection.id,
    weekStartDate: reflection.week_start_date,
    weekEndDate: reflection.week_end_date,
    workDone: reflection.work_done,
    achievements: reflection.achievements,
    failuresAndChallenges: reflection.failures_and_challenges,
    lessonsLearned: reflection.lessons_learned,
    highlights: reflection.highlights,
    overallReflection: reflection.overall_reflection || null,
    generatedSummary: reflection.generated_summary || null,
    createdAt: new Date(reflection.created_at),
    updatedAt: new Date(reflection.updated_at),
  };
}

test('formatWeeklyReflectionForTiDB converts frontend WeeklyReflection to TiDB table record', () => {
  const localWeekly = {
    id: 'week-1',
    week_start_date: '2026-10-19',
    week_end_date: '2026-10-25',
    work_done: ['Shipped ORM', 'Integrated score widget'],
    achievements: ['80 commits reached', 'TiDB schema deployed'],
    failures_and_challenges: ['Rebase sync needed'],
    lessons_learned: ['Regular fetching prevents rejected pushes'],
    highlights: ['Productive development cycle'],
    overall_reflection: 'Excellent progress',
    generated_summary: 'Weekly recap text',
    created_at: '2026-10-25T18:00:00.000Z',
    updated_at: '2026-10-25T18:00:00.000Z',
  };

  const formatted = formatWeeklyReflectionForTiDB(localWeekly);
  assert.equal(formatted.id, 'week-1');
  assert.equal(formatted.weekStartDate, '2026-10-19');
  assert.equal(formatted.weekEndDate, '2026-10-25');
  assert.equal(formatted.generatedSummary, 'Weekly recap text');
});

function formatMonthlyReflectionForTiDB(reflection) {
  return {
    id: reflection.id,
    month: reflection.month,
    year: reflection.year,
    workDone: reflection.work_done,
    achievements: reflection.achievements,
    failuresAndChallenges: reflection.failures_and_challenges,
    lessonsLearned: reflection.lessons_learned,
    highlights: reflection.highlights,
    overallReflection: reflection.overall_reflection || null,
    nextMonthReflection: reflection.next_month_reflection || null,
    generatedSummary: reflection.generated_summary || null,
    createdAt: new Date(reflection.created_at),
    updatedAt: new Date(reflection.updated_at),
  };
}

test('formatMonthlyReflectionForTiDB converts frontend MonthlyReflection to TiDB table record', () => {
  const localMonthly = {
    id: 'month-10-2026',
    year: 2026,
    month: 10,
    work_done: ['Shipped entire growth tracking suite'],
    achievements: ['All requirements verified and tested'],
    failures_and_challenges: ['Managing multiple subagent restarts'],
    lessons_learned: ['Incremental atomic commits maintain reliable state'],
    highlights: ['Achieved 80 commits directly to main'],
    overall_reflection: 'A monumental month of engineering progress',
    next_month_reflection: 'Focus on deeper algorithm studies',
    generated_summary: 'Monthly overview summary text',
    created_at: '2026-10-31T20:00:00.000Z',
    updated_at: '2026-10-31T20:00:00.000Z',
  };

  const formatted = formatMonthlyReflectionForTiDB(localMonthly);
  assert.equal(formatted.id, 'month-10-2026');
  assert.equal(formatted.month, 10);
  assert.equal(formatted.year, 2026);
  assert.equal(formatted.nextMonthReflection, 'Focus on deeper algorithm studies');
});
