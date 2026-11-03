import test from 'node:test';
import assert from 'node:assert/strict';

function calculateFocusRecommendations(dailyLogs) {
  const recommendations = [];
  const allFailures = dailyLogs.flatMap((l) => l.failures_and_challenges || []);
  const allWork = dailyLogs.flatMap((l) => l.work_done || []);
  const combinedText = [...allFailures, ...allWork].join(' ').toLowerCase();

  const courseKeywords = ['course', 'class', 'lecture', 'study', 'exam', 'assignment', 'homework', 'tutorial', 'curriculum', 'module'];
  const courseMentions = courseKeywords.reduce((acc, kw) => acc + (combinedText.split(kw).length - 1), 0);
  const courseFailureCount = allFailures.filter((f) => courseKeywords.some((kw) => f.toLowerCase().includes(kw))).length;

  if (courseFailureCount > 0 || courseMentions > 0) {
    recommendations.push({
      id: 'focus-courses',
      category: 'Coursework & Learning',
      title: 'Course Progression & Dedicated Study',
      message: 'You need to work more on taking your courses properly: ensure you attend lectures attentively, take structured study notes, and finish problem sets before starting other tasks.',
      severity: courseFailureCount > 1 ? 'high' : 'medium',
      actionPrompt: 'Schedule fixed 90-minute study blocks each morning dedicated solely to your curriculum courses.',
      relatedCount: courseFailureCount || 1,
    });
  } else {
    recommendations.push({
      id: 'focus-courses-baseline',
      category: 'Coursework & Learning',
      title: 'Coursework Discipline',
      message: 'You need to work more on taking your courses properly and tracking your academic progress alongside project work.',
      severity: 'medium',
      actionPrompt: 'Log your daily coursework modules and lecture milestones in your daily entries.',
      relatedCount: 0,
    });
  }

  const bugKeywords = ['bug', 'debug', 'error', 'broken', 'crash', 'test', 'fail', 'syntax', 'type', 'compiler'];
  const bugFailures = allFailures.filter((f) => bugKeywords.some((kw) => f.toLowerCase().includes(kw)));

  if (bugFailures.length > 0) {
    recommendations.push({
      id: 'focus-testing',
      category: 'Engineering & Code Quality',
      title: 'Testing & Systematic Debugging',
      message: 'You need to work more on writing unit tests and testing edge cases early: recurring debugging bottlenecks suggest logic should be verified with small, isolated tests.',
      severity: bugFailures.length >= 2 ? 'high' : 'medium',
      actionPrompt: 'Write a unit test before refactoring and use step-by-step debug traces to isolate issues quickly.',
      relatedCount: bugFailures.length,
    });
  }

  return recommendations;
}

test('calculateFocusRecommendations alerts user to work more on taking courses properly when coursework issues appear', () => {
  const logs = [
    {
      id: '1',
      date: '2026-10-20',
      work_done: ['Tried doing math course'],
      achievements: [],
      failures_and_challenges: ['Fell behind on course lectures and missed assignment deadline'],
      lessons_learned: ['Need to plan weekly study schedule'],
    },
  ];

  const recs = calculateFocusRecommendations(logs);
  const courseRec = recs.find((r) => r.id === 'focus-courses');
  assert.ok(courseRec, 'Expected course recommendation to be present');
  assert.ok(courseRec.message.includes('You need to work more on taking your courses properly'));
});

test('calculateFocusRecommendations alerts user to write tests when bug patterns emerge', () => {
  const logs = [
    {
      id: '2',
      date: '2026-10-21',
      work_done: ['Refactored API router'],
      achievements: [],
      failures_and_challenges: ['Unexpected bug caused runtime crash in production', 'Syntax error on load'],
      lessons_learned: ['Need automated testing before deploy'],
    },
  ];

  const recs = calculateFocusRecommendations(logs);
  const bugRec = recs.find((r) => r.id === 'focus-testing');
  assert.ok(bugRec, 'Expected testing recommendation to be present');
  assert.equal(bugRec.severity, 'high');
  assert.ok(bugRec.message.includes('writing unit tests'));
});

function evaluateAchievements(dailyLogs) {
  const judgments = [];
  const allAchievements = dailyLogs.flatMap((l) => (l.achievements || []).map((a) => ({ text: a, date: l.date })));
  const allLessons = dailyLogs.flatMap((l) => l.lessons_learned || []);

  if (allAchievements.length === 0) {
    return [
      {
        id: 'eval-first-step',
        title: 'Ready for Breakthroughs',
        praise: 'You did well on initiating your personal growth journey. Log your first achievements to receive qualitative evaluations.',
        impact: 'growing',
      },
    ];
  }

  const sortedAchievements = [...allAchievements].reverse();
  const topAchievements = sortedAchievements.slice(0, 3);

  if (topAchievements.length > 0) {
    const mainItem = topAchievements[0].text;
    judgments.push({
      id: 'eval-recent-feat',
      title: 'Key Technical & Practical Accomplishment',
      praise: `You did well on ${mainItem} — this demonstrates tangible, forward momentum.`,
      impact: 'outstanding',
      evidence: topAchievements.map((a) => a.text),
    });
  }

  if (allLessons.length > 0) {
    judgments.push({
      id: 'eval-resilience',
      title: 'Growth Mindset & Problem Solving',
      praise: `You did well on transforming ${allLessons.length} obstacles into concrete lessons learned.`,
      impact: 'outstanding',
      evidence: allLessons.slice(0, 3),
    });
  }

  return judgments;
}

test('evaluateAchievements praises user achievements and transformation of lessons', () => {
  const logs = [
    {
      id: '3',
      date: '2026-10-21',
      work_done: ['Built TiDB integration'],
      achievements: ['Configured Drizzle ORM schemas with SSL encryption'],
      failures_and_challenges: ['Driver timeout'],
      lessons_learned: ['Increased connection pool timeout'],
    },
  ];

  const judgments = evaluateAchievements(logs);
  assert.ok(judgments.length >= 2);
  assert.ok(judgments[0].praise.includes('You did well on Configured Drizzle ORM schemas with SSL encryption'));
  assert.ok(judgments[1].praise.includes('You did well on transforming 1 obstacles into concrete lessons learned'));
});
