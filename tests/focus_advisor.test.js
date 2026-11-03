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
