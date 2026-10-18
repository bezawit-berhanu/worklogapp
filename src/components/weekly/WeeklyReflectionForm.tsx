import React, { useState } from 'react';
import { WeeklyReflection, DailyLog } from '../../types';
import { getWeekRange, generateWeeklyOverview, formatDateString } from '../../services/summarizer';
import { BulletListEditor } from '../common/BulletListEditor';
import { CategoryBadge } from '../common/CategoryBadge';
import {
  Calendar,
  Sparkles,
  Save,
  X,
  Layers,
  Info,
} from 'lucide-react';

interface WeeklyReflectionFormProps {
  dailyLogs: DailyLog[];
  initialReflection?: WeeklyReflection | null;
  onSave: (reflection: WeeklyReflection) => void;
  onCancel: () => void;
}

export const WeeklyReflectionForm: React.FC<WeeklyReflectionFormProps> = ({
  dailyLogs,
  initialReflection,
  onSave,
  onCancel,
}) => {
  const currentWeek = getWeekRange(new Date());

  const [id] = useState(initialReflection?.id || `weekly-${Date.now()}`);
  const [startDate, setStartDate] = useState(initialReflection?.week_start_date || currentWeek.startDate);
  const [endDate, setEndDate] = useState(initialReflection?.week_end_date || currentWeek.endDate);

  const [workDone, setWorkDone] = useState<string[]>(initialReflection?.work_done || ['']);
  const [achievements, setAchievements] = useState<string[]>(initialReflection?.achievements || ['']);
  const [failures, setFailures] = useState<string[]>(initialReflection?.failures_and_challenges || ['']);
  const [lessons, setLessons] = useState<string[]>(initialReflection?.lessons_learned || ['']);
  const [highlights, setHighlights] = useState<string[]>(initialReflection?.highlights || ['']);
  const [overallReflection, setOverallReflection] = useState(initialReflection?.overall_reflection || '');
  const [generatedSummary, setGeneratedSummary] = useState(initialReflection?.generated_summary || '');

  const [summaryInfo, setSummaryInfo] = useState<string | null>(null);

  // Auto-generate overview from daily logs of selected week
  const handleGenerateOverview = () => {
    const overview = generateWeeklyOverview(dailyLogs, startDate, endDate);

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
      `Overview generated from ${overview.daysLoggedCount} ${
        overview.daysLoggedCount === 1 ? 'daily log' : 'daily logs'
      } between ${startDate} and ${endDate}. You can edit all fields before saving.`
    );
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    const range = getWeekRange(val);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  const clean = (arr: string[]) => arr.map((x) => x.trim()).filter(Boolean);

  const handleSave = () => {
    const reflection: WeeklyReflection = {
      id,
      week_start_date: startDate,
      week_end_date: endDate,
      work_done: clean(workDone),
      achievements: clean(achievements),
      failures_and_challenges: clean(failures),
      lessons_learned: clean(lessons),
      highlights: clean(highlights),
      overall_reflection: overallReflection.trim(),
      generated_summary: generatedSummary,
      created_at: initialReflection?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(reflection);
  };

  return (
    <div className="card" style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div className="card-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '1.65rem' }}>
            {initialReflection ? 'Edit Weekly Reflection' : 'New Weekly Reflection'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Synthesize progress across the entire week, celebrate major milestones, and evaluate lessons learned.
          </p>
        </div>

        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 0' }}>
        {/* Date Selection & Auto-generate action */}
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
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="weekly-start-date">Week Start (Monday)</label>
              <input
                id="weekly-start-date"
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="weekly-end-date">Week End (Sunday)</label>
              <input
                id="weekly-end-date"
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGenerateOverview}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Sparkles size={16} color="#D97706" />
            <span>Auto-Generate from Week's Daily Logs</span>
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

        {/* 1. What I Worked On */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="work_done" />
              <span>What I Worked On During The Week</span>
            </span>
          </label>
          <BulletListEditor
            items={workDone}
            onChange={setWorkDone}
            placeholder="Key theme or major work completed..."
            categoryLabel="weekly activity"
          />
        </div>

        {/* 2. Major Achievements */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="achievements" />
              <span>Major Achievements & Milestones</span>
            </span>
          </label>
          <BulletListEditor
            items={achievements}
            onChange={setAchievements}
            placeholder="Major weekly accomplishment or breakthrough..."
            categoryLabel="weekly achievement"
          />
        </div>

        {/* 3. Failures & Challenges */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="failures_and_challenges" />
              <span>Failures and Challenges Encountered</span>
            </span>
          </label>
          <BulletListEditor
            items={failures}
            onChange={setFailures}
            placeholder="Key technical challenge or blocker..."
            categoryLabel="weekly challenge"
          />
        </div>

        {/* 4. Lessons Learned */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="lessons_learned" />
              <span>What I Learned from Those Failures</span>
            </span>
          </label>
          <BulletListEditor
            items={lessons}
            onChange={setLessons}
            placeholder="Strategic technical or workflow lesson..."
            categoryLabel="weekly lesson"
          />
        </div>

        {/* 5. Weekly Highlights */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="highlights" />
              <span>Weekly Highlights Worth Remembering</span>
            </span>
          </label>
          <BulletListEditor
            items={highlights}
            onChange={setHighlights}
            placeholder="Memorable win, collaboration, or breakthrough..."
            categoryLabel="weekly highlight"
          />
        </div>

        {/* 6. Overall Reflection on Progress */}
        <div className="form-group">
          <label className="form-label" htmlFor="weekly-overall-reflection">
            <span>Overall Reflection on Weekly Progress</span>
            <span className="form-hint">How did this week move you forward in your professional growth?</span>
          </label>
          <textarea
            id="weekly-overall-reflection"
            className="form-textarea"
            style={{ minHeight: '110px' }}
            placeholder="Reflect deeply on weekly momentum, focus, and growth trajectory..."
            value={overallReflection}
            onChange={(e) => setOverallReflection(e.target.value)}
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
          <span>Save Weekly Reflection</span>
        </button>
      </div>
    </div>
  );
};
