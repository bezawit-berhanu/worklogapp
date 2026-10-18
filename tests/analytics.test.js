import test from 'node:test';
import assert from 'node:assert/strict';

// Helper tests for date math
function getWeekRange(dateInput) {
  const [y, m, d] = dateInput.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (dt) => {
    const yr = dt.getFullYear();
    const mo = String(dt.getMonth() + 1).padStart(2, '0');
    const da = String(dt.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  return {
    startDate: format(monday),
    endDate: format(sunday),
  };
}

function calculateStreaks(uniqueDates) {
  if (uniqueDates.length === 0) return { currentStreak: 0, longestStreak: 0 };
  const sorted = [...uniqueDates].sort();

  let longest = 0;
  let temp = 0;
  let prev = null;

  for (const dateStr of sorted) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const curr = new Date(y, m - 1, d);
    if (!prev) {
      temp = 1;
    } else {
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) temp += 1;
      else if (diffDays > 1) temp = 1;
    }
    if (temp > longest) longest = temp;
    prev = curr;
  }

  return { longestStreak: longest };
}

test('Week range correctly computes Monday-Sunday boundaries', () => {
  // 2026-10-18 was Sunday -> week should start on Monday 2026-10-12 and end on Sunday 2026-10-18
  const rangeSunday = getWeekRange('2026-10-18');
  assert.equal(rangeSunday.startDate, '2026-10-12');
  assert.equal(rangeSunday.endDate, '2026-10-18');

  // 2026-10-14 was Wednesday -> same week 2026-10-12 to 2026-10-18
  const rangeWed = getWeekRange('2026-10-14');
  assert.equal(rangeWed.startDate, '2026-10-12');
  assert.equal(rangeWed.endDate, '2026-10-18');

  // 2026-10-12 was Monday -> same week
  const rangeMon = getWeekRange('2026-10-12');
  assert.equal(rangeMon.startDate, '2026-10-12');
  assert.equal(rangeMon.endDate, '2026-10-18');
});

test('Streak calculation computes continuous logging sequences', () => {
  const dates = ['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-14', '2026-10-15'];
  const { longestStreak } = calculateStreaks(dates);
  assert.equal(longestStreak, 3);
});

test('Recurring theme keyword analysis extracts meaningful blockers', () => {
  const failures = [
    'Memory overflow during batch embedding calculation',
    'High memory consumption in streaming parser',
    'Unexpected timeout on database connection pool',
  ];

  const words = failures
    .flatMap((f) => f.toLowerCase().split(/\s+/))
    .filter((w) => w === 'memory');

  assert.equal(words.length, 2);
});
