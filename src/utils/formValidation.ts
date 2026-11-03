export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

export interface DailyLogValidationPayload {
  date: string;
  workDone: string[];
  achievements: string[];
  failures: string[];
  lessons: string[];
  highlights: string[];
  overallReflection?: string;
  isDraft?: boolean;
}

export function isValidDateFormat(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

export function validateDailyLogInput(payload: DailyLogValidationPayload): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  if (!payload.date || !isValidDateFormat(payload.date)) {
    errors.date = 'A valid date in YYYY-MM-DD format is required.';
  }

  const clean = (arr: string[] = []) =>
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
