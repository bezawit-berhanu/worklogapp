import test from 'node:test';
import assert from 'node:assert/strict';

function calculateWeeklyDayBars(dailyLogs, mondayStr = '2026-10-19') {
  const [y, m, d] = mondayStr.split('-').map(Number);
  const mondayDate = new Date(y, m - 1, d);
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const bars = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(mondayDate);
    currentDay.setDate(mondayDate.getDate() + i);
    const yr = currentDay.getFullYear();
    const mo = String(currentDay.getMonth() + 1).padStart(2, '0');
    const da = String(currentDay.getDate()).padStart(2, '0');
    const dateStr = `${yr}-${mo}-${da}`;

    const log = dailyLogs.find((l) => l.date === dateStr);
    const workItems = log?.work_done || [];
    const achievementItems = log?.achievements || [];
    const failureItems = log?.failures_and_challenges || [];
    const lessonItems = log?.lessons_learned || [];

    const taskCount = workItems.length;
    const achievementsCount = achievementItems.length;
    const failuresCount = failureItems.length;
    const lessonsCount = lessonItems.length;
    const totalVolume = taskCount + achievementsCount + failuresCount;

    let heightLevel = 'empty';
    if (totalVolume >= 4) heightLevel = 'long';
    else if (totalVolume >= 2) heightLevel = 'medium';
    else if (totalVolume === 1) heightLevel = 'short';

    let colorRating = 'gray';
    let evaluationLabel = 'No activity logged';

    if (totalVolume > 0) {
      if (failuresCount > achievementsCount && failuresCount >= 1) {
        colorRating = 'red';
        evaluationLabel = 'High Failure Rate';
      } else if (achievementsCount > failuresCount || (achievementsCount > 0 && failuresCount === 0)) {
        colorRating = 'green';
        evaluationLabel = 'Performed Well';
      } else {
        colorRating = 'yellow';
        evaluationLabel = 'Average Performance';
      }
    }

    bars.push({
      dayIndex: i,
      dayName: dayNames[i],
      date: dateStr,
      taskCount,
      achievementsCount,
      failuresCount,
      lessonsCount,
      heightLevel,
      colorRating,
      evaluationLabel,
    });
  }

  return bars;
}

test('calculateWeeklyDayBars returns exactly 7 days from Mon to Sun', () => {
  const bars = calculateWeeklyDayBars([]);
  assert.equal(bars.length, 7);
  assert.equal(bars[0].dayName, 'Mon');
  assert.equal(bars[6].dayName, 'Sun');
  assert.equal(bars[0].colorRating, 'gray');
  assert.equal(bars[0].heightLevel, 'empty');
});
