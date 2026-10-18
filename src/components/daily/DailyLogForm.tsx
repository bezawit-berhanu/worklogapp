import { useState } from 'react';
import type { DailyLog } from '../../types';
import { storage } from '../../services/storage';
import { formatDateString } from '../../services/summarizer';
import { BulletListEditor } from '../common/BulletListEditor';
import { CategoryBadge } from '../common/CategoryBadge';
import {
  Calendar,
  Save,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  FileEdit,
} from 'lucide-react';

interface DailyLogFormProps {
  initialLog?: DailyLog | null;
  initialDate?: string;
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
  onSwitchToEdit: (existingLog: DailyLog) => void;
}

export const DailyLogForm = ({
  initialLog,
  initialDate,
  onSave,
  onCancel,
  onSwitchToEdit,
}: DailyLogFormProps) => {
  const [id] = useState(() => initialLog?.id || `daily-${Date.now()}`);
  const [date, setDate] = useState(() => initialLog?.date || initialDate || formatDateString(new Date()));
  const [workDone, setWorkDone] = useState<string[]>(initialLog?.work_done || ['']);
  const [achievements, setAchievements] = useState<string[]>(initialLog?.achievements || ['']);
  const [failures, setFailures] = useState<string[]>(initialLog?.failures_and_challenges || ['']);
  const [lessons, setLessons] = useState<string[]>(initialLog?.lessons_learned || ['']);
  const [highlights, setHighlights] = useState<string[]>(initialLog?.highlights || ['']);
  const [overallReflection, setOverallReflection] = useState(initialLog?.overall_reflection || '');

  const [saveStatus, setSaveStatus] = useState<'saved' | 'draft' | 'unsaved'>('saved');

  // Derive duplicate warning directly
  const duplicateWarning =
    !initialLog || initialLog.date !== date
      ? (() => {
          const existing = storage.getDailyLogByDate(date);
          return existing && existing.id !== id ? existing : null;
        })()
      : null;

  // Mark unsaved on any change
  const handleFieldChange = () => {
    setSaveStatus('unsaved');
  };

  const cleanItems = (items: string[]) => items.map((i) => i.trim()).filter(Boolean);

  const handleSave = (isDraft = false) => {
    const cleanedWork = cleanItems(workDone);
    const cleanedAchievements = cleanItems(achievements);
    const cleanedFailures = cleanItems(failures);
    const cleanedLessons = cleanItems(lessons);
    const cleanedHighlights = cleanItems(highlights);

    const logToSave: DailyLog = {
      id,
      date,
      work_done: cleanedWork,
      achievements: cleanedAchievements,
      failures_and_challenges: cleanedFailures,
      lessons_learned: cleanedLessons,
      highlights: cleanedHighlights,
      overall_reflection: overallReflection.trim(),
      is_draft: isDraft,
      created_at: initialLog?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(logToSave);
  };

  return (
    <div className="card" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="card-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="page-title" style={{ fontSize: '1.65rem' }}>
              {initialLog ? 'Edit Daily Work Log' : 'New Daily Work Log'}
            </h2>
            {saveStatus === 'unsaved' && (
              <span style={{ fontSize: '0.75rem', color: '#D97706', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={12} /> Unsaved changes
              </span>
            )}
            {saveStatus === 'saved' && (
              <span style={{ fontSize: '0.75rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle size={12} /> Ready to save
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Record what you built, accomplished, encountered, and learned today. Complete in ~5 minutes.
          </p>
        </div>

        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '1.5rem 0' }}>
        {/* Date Selection */}
        <div className="form-group" style={{ maxWidth: '280px' }}>
          <label className="form-label" htmlFor="daily-log-date">
            <span>Log Date</span>
            <Calendar size={14} color="#78716C" />
          </label>
          <input
            id="daily-log-date"
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              handleFieldChange();
            }}
          />
        </div>

        {/* Duplicate Entry Warning */}
        {duplicateWarning && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.86rem',
              color: '#92400E',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>
                A work log already exists for <strong>{date}</strong>. Would you like to edit that entry instead?
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onSwitchToEdit(duplicateWarning)}
              style={{ flexShrink: 0 }}
            >
              <FileEdit size={14} />
              <span>Edit Existing Entry</span>
            </button>
          </div>
        )}

        {/* 1. What I Worked On */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="work_done" />
              <span>What I Worked On</span>
            </span>
            <span className="form-hint">Tasks, code, study sessions, problems tackled</span>
          </label>
          <BulletListEditor
            items={workDone}
            onChange={(items) => {
              setWorkDone(items);
              handleFieldChange();
            }}
            placeholder="e.g. Implemented search indexing pipeline with TypeScript"
            categoryLabel="activity"
          />
        </div>

        {/* 2. Achievements */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="achievements" />
              <span>Achievements</span>
            </span>
            <span className="form-hint">Accomplishments, milestones, concepts mastered</span>
          </label>
          <BulletListEditor
            items={achievements}
            onChange={(items) => {
              setAchievements(items);
              handleFieldChange();
            }}
            placeholder="e.g. Reduced query execution latency by 40%"
            categoryLabel="achievement"
          />
        </div>

        {/* 3. Failures & Challenges */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="failures_and_challenges" />
              <span>Failures & Challenges</span>
            </span>
            <span className="form-hint">Blockers, bugs, misunderstandings, friction points</span>
          </label>
          <BulletListEditor
            items={failures}
            onChange={(items) => {
              setFailures(items);
              handleFieldChange();
            }}
            placeholder="e.g. Memory overflow during batch embedding generation"
            categoryLabel="challenge"
          />
        </div>

        {/* 4. Lessons Learned */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="lessons_learned" />
              <span>Learnings from Failures / Challenges</span>
            </span>
            <span className="form-hint">What caused the issue and the technical takeaway</span>
          </label>
          <BulletListEditor
            items={lessons}
            onChange={(items) => {
              setLessons(items);
              handleFieldChange();
            }}
            placeholder="e.g. Chunk batch operations into async streams of 250 records"
            categoryLabel="lesson"
          />
        </div>

        {/* 5. Highlights */}
        <div className="form-group">
          <label className="form-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CategoryBadge category="highlights" />
              <span>Highlights & Breakthroughs</span>
            </span>
            <span className="form-hint">Wins, exciting moments, personal discoveries</span>
          </label>
          <BulletListEditor
            items={highlights}
            onChange={(items) => {
              setHighlights(items);
              handleFieldChange();
            }}
            placeholder="e.g. The automated test suite caught a subtle edge case instantly"
            categoryLabel="highlight"
          />
        </div>

        {/* 6. Overall Reflection */}
        <div className="form-group">
          <label className="form-label" htmlFor="overall-reflection-input">
            <span>Overall Reflection (Optional)</span>
            <span className="form-hint">Short synthesis of mindset and energy</span>
          </label>
          <textarea
            id="overall-reflection-input"
            className="form-textarea"
            placeholder="A brief high-level reflection on today's progress..."
            value={overallReflection}
            onChange={(e) => {
              setOverallReflection(e.target.value);
              handleFieldChange();
            }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-light)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleSave(true)}
            title="Save draft to finish later"
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSave(false)}
            id="save-daily-log-btn"
          >
            <Save size={16} />
            <span>Save Work Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};
