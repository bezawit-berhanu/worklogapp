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

test('calculateWeeklyDayBars evaluates high output with high achievements as Long Green bar', () => {
  const logs = [
    {
      id: 'log-mon',
      date: '2026-10-19',
      work_done: ['Finished feature A', 'Finished feature B'],
      achievements: ['Shipped release 1.0', 'Passed all integration tests'],
      failures_and_challenges: [],
      lessons_learned: [],
    },
  ];

  const bars = calculateWeeklyDayBars(logs);
  const monBar = bars[0];
  assert.equal(monBar.dayName, 'Mon');
  assert.equal(monBar.heightLevel, 'long'); // 2 work + 2 achievements = 4 volume (long)
  assert.equal(monBar.colorRating, 'green'); // high achievements outnumber failures
  assert.equal(monBar.evaluationLabel, 'Performed Well');
});

test('calculateWeeklyDayBars evaluates high volume with average performance as Long Yellow bar', () => {
  const logs = [
    {
      id: 'log-tue',
      date: '2026-10-20',
      work_done: ['Attended 2 workshops', 'Read chapters 1 and 2'],
      achievements: ['Finished reading'],
      failures_and_challenges: ['Did not finish exercises'],
      lessons_learned: ['Need more hands-on practice'],
    },
  ];

  const bars = calculateWeeklyDayBars(logs);
  const tueBar = bars[1];
  assert.equal(tueBar.dayName, 'Tue');
  assert.equal(tueBar.heightLevel, 'long'); // 2 work + 1 ach + 1 fail = 4 volume
  assert.equal(tueBar.colorRating, 'yellow'); // balanced outcome / average performance
  assert.equal(tueBar.evaluationLabel, 'Average Performance');
});

test('calculateWeeklyDayBars evaluates high volume with dominant failures as Long Red bar', () => {
  const logs = [
    {
      id: 'log-wed',
      date: '2026-10-21',
      work_done: ['Spent 8 hours debugging server cluster'],
      achievements: [],
      failures_and_challenges: [
        'Database connection pool exhausted',
        'TLS handshake certificates rejected',
        'CORS policy blocked client requests',
      ],
      lessons_learned: ['Review cloud security groups and SSL configs systematically'],
    },
  ];

  const bars = calculateWeeklyDayBars(logs);
  const wedBar = bars[2];
  assert.equal(wedBar.dayName, 'Wed');
  assert.equal(wedBar.heightLevel, 'long'); // 1 work + 3 failures = 4 volume
  assert.equal(wedBar.colorRating, 'red'); // failures dominate achievements
  assert.equal(wedBar.evaluationLabel, 'High Failure Rate');
});

test('calculateWeeklyDayBars evaluates medium and short volume bars accurately', () => {
  const logs = [
    {
      id: 'log-thu',
      date: '2026-10-22',
      work_done: ['Reviewed PR #4'],
      achievements: ['Merged PR cleanly'],
      failures_and_challenges: [],
      lessons_learned: [],
    },
    {
      id: 'log-fri',
      date: '2026-10-23',
      work_done: ['Single study task'],
      achievements: [],
      failures_and_challenges: [],
      lessons_learned: [],
    },
  ];

  const bars = calculateWeeklyDayBars(logs);
  const thuBar = bars[3]; // Thursday: 2 items (Medium)
  const friBar = bars[4]; // Friday: 1 item (Short)

  assert.equal(thuBar.heightLevel, 'medium');
  assert.equal(friBar.heightLevel, 'short');
});
