import test from 'node:test';
import assert from 'node:assert/strict';

function isValidDateFormat(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function validateDailyLogInput(payload) {
  const errors = {};
  const warnings = [];

  if (!payload.date || !isValidDateFormat(payload.date)) {
    errors.date = 'A valid date in YYYY-MM-DD format is required.';
  }

  const clean = (arr = []) =>
    arr.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean);

  const cleanWork = clean(payload.workDone);
  const cleanAchievements = clean(payload.achievements);
  const cleanFailures = clean(payload.failures);
  const cleanLessons = clean(payload.lessons);
  const cleanHighlights = clean(payload.highlights);
  const cleanReflection = (payload.overallReflection || '').trim();

  const totalContentEntries =
    cleanWork.length +
    cleanAchievements.length +
    cleanFailures.length +
    cleanLessons.length +
    cleanHighlights.length;

  if (!payload.isDraft) {
    if (totalContentEntries === 0 && !cleanReflection) {
      errors.content = 'Please provide at least one entry or reflection before saving.';
    }
  }

  const allItems = [
    ...cleanWork,
    ...cleanAchievements,
    ...cleanFailures,
    ...cleanLessons,
    ...cleanHighlights,
  ];

  for (const item of allItems) {
    if (item.length > 1500) {
      errors.length = 'Each individual bullet entry must not exceed 1,500 characters.';
      break;
    }
  }

  if (cleanFailures.length > 0 && cleanLessons.length === 0) {
    warnings.push('You recorded a challenge or failure but no lessons learned. Adding lessons fosters growth.');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

test('Form Validation - passes for complete valid log', () => {
  const res = validateDailyLogInput({
    date: '2026-11-03',
    workDone: ['Configured TiDB database connection'],
    achievements: ['Integrated Drizzle ORM schemas'],
    failures: ['SSL handshake failed initially'],
    lessons: ['Set rejectUnauthorized to true for TiDB Cloud'],
    highlights: ['All 12 tests passed'],
  });

  assert.equal(res.isValid, true);
  assert.equal(Object.keys(res.errors).length, 0);
  assert.equal(res.warnings.length, 0);
});

test('Form Validation - flags invalid date format', () => {
  const res = validateDailyLogInput({
    date: 'invalid-date',
    workDone: ['Built component'],
    achievements: [],
    failures: [],
    lessons: [],
    highlights: [],
  });

  assert.equal(res.isValid, false);
  assert.match(res.errors.date, /YYYY-MM-DD/);
});

test('Form Validation - flags empty non-draft submissions', () => {
  const res = validateDailyLogInput({
    date: '2026-11-03',
    workDone: [''],
    achievements: [],
    failures: [],
    lessons: [],
    highlights: [],
    isDraft: false,
  });

  assert.equal(res.isValid, false);
  assert.match(res.errors.content, /at least one entry/);
});

test('Form Validation - permits empty draft submissions', () => {
  const res = validateDailyLogInput({
    date: '2026-11-03',
    workDone: [''],
    achievements: [],
    failures: [],
    lessons: [],
    highlights: [],
    isDraft: true,
  });

  assert.equal(res.isValid, true);
});

test('Form Validation - warns when failure is documented without a corresponding lesson', () => {
  const res = validateDailyLogInput({
    date: '2026-11-03',
    workDone: ['Debugged memory leak'],
    achievements: [],
    failures: ['High heap consumption on big array transforms'],
    lessons: [],
    highlights: [],
  });

  assert.equal(res.isValid, true);
  assert.equal(res.warnings.length, 1);
  assert.match(res.warnings[0], /lessons learned/);
});
