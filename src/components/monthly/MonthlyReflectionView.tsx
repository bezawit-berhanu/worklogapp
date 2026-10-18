import React, { useState } from 'react';
import type { MonthlyReflection } from '../../types';
import { getMonthName } from '../../services/summarizer';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  CalendarRange,
  Edit3,
  Trash2,
  ArrowLeft,
  Briefcase,
  Award,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BookOpen,
  Target,
} from 'lucide-react';

interface MonthlyReflectionViewProps {
  reflection: MonthlyReflection;
  onEdit: (reflection: MonthlyReflection) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const MonthlyReflectionView: React.FC<MonthlyReflectionViewProps> = ({
  reflection,
  onEdit,
  onDelete,
  onBack,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="card" style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div className="card-header" style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onBack} title="Go back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarRange size={18} color="var(--text-tertiary)" />
              <h2 className="page-title" style={{ fontSize: '1.75rem', margin: 0 }}>
                {getMonthName(reflection.month)} {reflection.year} Review
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              Monthly Retrospective • Saved {new Date(reflection.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(reflection)}>
            <Edit3 size={15} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '1.5rem 0' }}>
        {/* 1. What I Worked On */}
        {reflection.work_done && reflection.work_done.length > 0 && (
          <div className="category-section work_done">
            <div className="category-title" style={{ color: 'var(--cat-work-color)' }}>
              <Briefcase size={16} />
              <span>What I Worked On Throughout The Month</span>
            </div>
            <ul className="bullet-item-list">
              {reflection.work_done.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 2. Major Achievements and Milestones */}
        {reflection.achievements && reflection.achievements.length > 0 && (
          <div className="category-section achievements">
            <div className="category-title" style={{ color: 'var(--cat-achieve-color)' }}>
              <Award size={16} />
              <span>Major Achievements & Key Milestones</span>
            </div>
            <ul className="bullet-item-list">
              {reflection.achievements.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Failures, Recurring Difficulties & Challenges */}
        {reflection.failures_and_challenges && reflection.failures_and_challenges.length > 0 && (
          <div className="category-section failures_and_challenges">
            <div className="category-title" style={{ color: 'var(--cat-failure-color)' }}>
              <AlertTriangle size={16} />
              <span>Failures, Recurring Difficulties & Challenges</span>
            </div>
            <ul className="bullet-item-list">
              {reflection.failures_and_challenges.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Key Lessons Learned */}
        {reflection.lessons_learned && reflection.lessons_learned.length > 0 && (
          <div className="category-section lessons_learned">
            <div className="category-title" style={{ color: 'var(--cat-lesson-color)' }}>
              <Lightbulb size={16} />
              <span>Key Lessons Learned</span>
            </div>
            <ul className="bullet-item-list">
              {reflection.lessons_learned.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. Highlights */}
        {reflection.highlights && reflection.highlights.length > 0 && (
          <div className="category-section highlights">
            <div className="category-title" style={{ color: 'var(--cat-highlight-color)' }}>
              <Sparkles size={16} />
              <span>Memorable Highlights & Experiences</span>
            </div>
            <ul className="bullet-item-list">
              {reflection.highlights.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 6. Overall Growth Reflection */}
        {reflection.overall_reflection && (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-medium)',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '0.5rem',
              }}
            >
              <BookOpen size={16} color="var(--text-secondary)" />
              <span>Overall Growth Reflection</span>
            </div>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-main)',
                lineHeight: '1.6',
              }}
            >
              {reflection.overall_reflection}
            </p>
          </div>
        )}

        {/* 7. Priorities for Next Month */}
        {reflection.next_month_reflection && (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-medium)',
              marginTop: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '0.5rem',
              }}
            >
              <Target size={16} color="#B45309" />
              <span>Growth Priorities for Next Month (Reflection Notes)</span>
            </div>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-main)',
                lineHeight: '1.6',
              }}
            >
              {reflection.next_month_reflection}
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Monthly Reflection?"
        message={`Are you sure you want to permanently delete the monthly reflection for ${getMonthName(
          reflection.month
        )} ${reflection.year}? The underlying daily logs and weekly reflections will remain intact.`}
        confirmLabel="Delete Reflection"
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete(reflection.id);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
