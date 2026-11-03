import test from 'node:test';
import assert from 'node:assert/strict';

function isValidDateFormat(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function validateWeeklyReflectionInput(payload) {
  const errors = {};
  const warnings = [];

  if (!payload.startDate || !isValidDateFormat(payload.startDate)) {
    errors.startDate = 'A valid start date in YYYY-MM-DD format is required.';
  }
  if (!payload.endDate || !isValidDateFormat(payload.endDate)) {
    errors.endDate = 'A valid end date in YYYY-MM-DD format is required.';
  }
  if (payload.startDate && payload.endDate && payload.startDate > payload.endDate) {
    errors.dateRange = 'Week start date cannot be after the week end date.';
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

  if (totalContentEntries === 0 && !cleanReflection) {
    errors.content =
      'Weekly reflection must include at least one activity, achievement, lesson, or overall thought.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

function validateMonthlyReflectionInput(payload) {
  const errors = {};
  const warnings = [];

  if (!Number.isInteger(payload.year) || payload.year < 2000 || payload.year > 2100) {
    errors.year = 'A valid year between 2000 and 2100 is required.';
  }
  if (!Number.isInteger(payload.month) || payload.month < 1 || payload.month > 12) {
    errors.month = 'A valid month between 1 and 12 is required.';
  }

  const clean = (arr = []) =>
    arr.map((s) => (typeof s === 'string' ? s.trim() : '')).filter(Boolean);

  const cleanWork = clean(payload.workDone);
  const cleanAchievements = clean(payload.achievements);
  const cleanFailures = clean(payload.failures);
  const cleanLessons = clean(payload.lessons);
  const cleanHighlights = clean(payload.highlights);
  const cleanReflection = (payload.overallReflection || '').trim();
  const cleanNextMonth = (payload.nextMonthReflection || '').trim();

  const totalContentEntries =
    cleanWork.length +
    cleanAchievements.length +
    cleanFailures.length +
    cleanLessons.length +
    cleanHighlights.length;

  if (totalContentEntries === 0 && !cleanReflection && !cleanNextMonth) {
    errors.content = 'Monthly reflection must include at least one reflection entry or synthesis.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
}

test('Weekly Reflection Validation - passes with valid dates and content', () => {
  const res = validateWeeklyReflectionInput({
    startDate: '2026-10-26',
    endDate: '2026-11-01',
    workDone: ['Shipped database layer'],
    achievements: ['Completed benchmark suite'],
    failures: [],
    lessons: [],
    highlights: [],
  });

  assert.equal(res.isValid, true);
  assert.equal(Object.keys(res.errors).length, 0);
});

test('Weekly Reflection Validation - flags inverted date range', () => {
  const res = validateWeeklyReflectionInput({
    startDate: '2026-11-05',
    endDate: '2026-11-01',
    workDone: ['Done'],
  });

  assert.equal(res.isValid, false);
  assert.match(res.errors.dateRange, /cannot be after/);
});

test('Monthly Reflection Validation - passes with valid year, month and entries', () => {
  const res = validateMonthlyReflectionInput({
    year: 2026,
    month: 11,
    workDone: ['Architected app system'],
    achievements: ['Delivered milestone'],
    failures: [],
    lessons: [],
    highlights: [],
  });

  assert.equal(res.isValid, true);
});

test('Monthly Reflection Validation - flags out-of-range month number', () => {
  const res = validateMonthlyReflectionInput({
    year: 2026,
    month: 13,
    workDone: ['Done'],
  });

  assert.equal(res.isValid, false);
  assert.match(res.errors.month, /between 1 and 12/);
});
