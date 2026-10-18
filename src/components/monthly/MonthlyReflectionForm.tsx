import React, { useState } from 'react';
import type { MonthlyReflection, DailyLog, WeeklyReflection } from '../../types';
import { generateMonthlyOverview, getMonthName } from '../../services/summarizer';
import { BulletListEditor } from '../common/BulletListEditor';
import { CategoryBadge } from '../common/CategoryBadge';
import {
  Sparkles,
  Save,
  X,
  Info,
} from 'lucide-react';

interface MonthlyReflectionFormProps {
  dailyLogs: DailyLog[];
  weeklyReflections: WeeklyReflection[];
  existingMonthlyReflections: MonthlyReflection[];
  initialReflection?: MonthlyReflection | null;
  onSave: (reflection: MonthlyReflection) => void;
  onCancel: () => void;
}

export const MonthlyReflectionForm: React.FC<MonthlyReflectionFormProps> = ({
  dailyLogs,
  weeklyReflections,
  initialReflection,
  onSave,
  onCancel,
}) => {
  const [id] = useState(() => initialReflection?.id || `monthly-${Date.now()}`);
  const [year, setYear] = useState(() => initialReflection?.year || new Date().getFullYear());
  const [month, setMonth] = useState(() => initialReflection?.month || new Date().getMonth() + 1);

  const [workDone, setWorkDone] = useState<string[]>(initialReflection?.work_done || ['']);
  const [achievements, setAchievements] = useState<string[]>(initialReflection?.achievements || ['']);
  const [failures, setFailures] = useState<string[]>(initialReflection?.failures_and_challenges || ['']);
  const [lessons, setLessons] = useState<string[]>(initialReflection?.lessons_learned || ['']);
  const [highlights, setHighlights] = useState<string[]>(initialReflection?.highlights || ['']);
  const [overallReflection, setOverallReflection] = useState(initialReflection?.overall_reflection || '');
  const [nextMonthReflection, setNextMonthReflection] = useState(
    initialReflection?.next_month_reflection || ''
  );
  const [generatedSummary, setGeneratedSummary] = useState(initialReflection?.generated_summary || '');
  const [summaryInfo, setSummaryInfo] = useState<string | null>(null);

  const handleGenerateOverview = () => {
    const overview = generateMonthlyOverview(
      dailyLogs,
      weeklyReflections,
      year,
      month
    );

    setWorkDone(overview.workDone.length > 0 ? overview.workDone : ['']);
    setAchievements(overview.achievements.length > 0 ? overview.achievements : ['']);
    setFailures(overview.failuresAndChallenges.length > 0 ? overview.failuresAndChallenges : ['']);
    setLessons(overview.lessonsLearned.length > 0 ? overview.lessonsLearned : ['']);
    setHighlights(overview.highlights.length > 0 ? overview.highlights : ['']);
    setGeneratedSummary(overview.summaryNarrative);

    if (!overallReflection) {
      setOverallReflection(overview.summaryNarrative);
    }

    setSummaryInfo(
      `Aggregated ${overview.daysLoggedCount} daily log sessions. ${overview.comparisonText} You can freely customize all reflections below.`
    );
  };

  const clean = (arr: string[]) => arr.map((x) => x.trim()).filter(Boolean);

  const handleSave = () => {
    const reflection: MonthlyReflection = {
      id,
      year: Number(year),
      month: Number(month),
      work_done: clean(workDone),
      achievements: clean(achievements),
      failures_and_challenges: clean(failures),
      lessons_learned: clean(lessons),
      highlights: clean(highlights),
      overall_reflection: overallReflection.trim(),
      next_month_reflection: nextMonthReflection.trim(),
      generated_summary: generatedSummary,
      created_at: initialReflection?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(reflection);
  };

  const yearsList = [year - 1, year, year + 1];
  const monthsList = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="card" style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div className="card-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '1.65rem' }}>
            {initialReflection ? 'Edit Monthly Reflection' : 'New Monthly Reflection'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Review month-long professional growth, synthesize breakthroughs, and set reflective intentions.
          </p>
        </div>

        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 0' }}>
        {/* Month & Year Selection + Auto-generate action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="monthly-month-select">Month</label>
              <select
                id="monthly-month-select"
                className="form-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {monthsList.map((m) => (
                  <option key={m} value={m}>
                    {getMonthName(m)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="monthly-year-select">Year</label>
              <select
                id="monthly-year-select"
                className="form-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGenerateOverview}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Sparkles size={16} color="#D97706" />
            <span>Auto-Generate from Month's Logs</span>
          </button>
        </div>

        {summaryInfo && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              marginBottom: '1.5rem',
              fontSize: '0.84rem',
              color: '#92400E',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>{summaryInfo}</span>
          </div>
        )}

        {/* 1. What I Worked On Throughout The Month */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="work_done" />
              <span>What I Worked On Throughout The Month</span>
            </span>
          </label>
          <BulletListEditor
            items={workDone}
            onChange={setWorkDone}
            placeholder="Major project, study topic, or system advanced..."
            categoryLabel="monthly activity"
          />
        </div>

        {/* 2. Major Achievements and Milestones */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="achievements" />
              <span>Major Achievements & Key Milestones</span>
            </span>
          </label>
          <BulletListEditor
            items={achievements}
            onChange={setAchievements}
            placeholder="Significant milestone, skill acquired, or project delivered..."
            categoryLabel="monthly achievement"
          />
        </div>

        {/* 3. Failures, Recurring Difficulties & Challenges */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="failures_and_challenges" />
              <span>Failures, Recurring Difficulties & Challenges</span>
            </span>
          </label>
          <BulletListEditor
            items={failures}
            onChange={setFailures}
            placeholder="Recurring difficulty, friction pattern, or setback..."
            categoryLabel="monthly challenge"
          />
        </div>

        {/* 4. Key Lessons Learned */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="lessons_learned" />
              <span>Key Lessons Learned This Month</span>
            </span>
          </label>
          <BulletListEditor
            items={lessons}
            onChange={setLessons}
            placeholder="Overarching technical or operational insight..."
            categoryLabel="monthly lesson"
          />
        </div>

        {/* 5. Memorable Highlights */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="highlights" />
              <span>Memorable Highlights & Experiences</span>
            </span>
          </label>
          <BulletListEditor
            items={highlights}
            onChange={setHighlights}
            placeholder="Proudest moment or inspiring breakthrough..."
            categoryLabel="monthly highlight"
          />
        </div>

        {/* 6. Overall Growth Reflection */}
        <div className="form-group">
          <label className="form-label" htmlFor="monthly-overall-reflection">
            <span>Overall Growth Reflection</span>
            <span className="form-hint">How did this month transform your skills, confidence, and career roadmap?</span>
          </label>
          <textarea
            id="monthly-overall-reflection"
            className="form-textarea"
            style={{ minHeight: '120px' }}
            placeholder="Evaluate overall trajectory, habit consistency, and intellectual growth..."
            value={overallReflection}
            onChange={(e) => setOverallReflection(e.target.value)}
          />
        </div>

        {/* 7. Priorities for Next Month (Reflection notes only, not a task manager) */}
        <div className="form-group">
          <label className="form-label" htmlFor="next-month-reflection">
            <span>Priorities & Intentions for Next Month</span>
            <span className="form-hint">Reflective notes on growth direction (not a task checklist)</span>
          </label>
          <textarea
            id="next-month-reflection"
            className="form-textarea"
            style={{ minHeight: '90px' }}
            placeholder="Reflect on areas you want to deepen, habits to nurture, or technical concepts to explore next month..."
            value={nextMonthReflection}
            onChange={(e) => setNextMonthReflection(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <Save size={16} />
          <span>Save Monthly Reflection</span>
        </button>
      </div>
    </div>
  );
};
