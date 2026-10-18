import React, { useState } from 'react';
import { WeeklyReflection } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Calendar,
  Edit3,
  Trash2,
  ArrowLeft,
  Briefcase,
  Award,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface WeeklyReflectionViewProps {
  reflection: WeeklyReflection;
  onEdit: (reflection: WeeklyReflection) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const WeeklyReflectionView: React.FC<WeeklyReflectionViewProps> = ({
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
              <Calendar size={18} color="var(--text-tertiary)" />
              <h2 className="page-title" style={{ fontSize: '1.75rem', margin: 0 }}>
                Week: {reflection.week_start_date} – {reflection.week_end_date}
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              Weekly Reflection • Recorded {new Date(reflection.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
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
              <span>What I Worked On During The Week</span>
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

        {/* 2. Major Achievements */}
        {reflection.achievements && reflection.achievements.length > 0 && (
          <div className="category-section achievements">
            <div className="category-title" style={{ color: 'var(--cat-achieve-color)' }}>
              <Award size={16} />
              <span>Major Weekly Achievements</span>
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

        {/* 3. Failures & Challenges */}
        {reflection.failures_and_challenges && reflection.failures_and_challenges.length > 0 && (
          <div className="category-section failures_and_challenges">
            <div className="category-title" style={{ color: 'var(--cat-failure-color)' }}>
              <AlertTriangle size={16} />
              <span>Challenges Encountered</span>
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

        {/* 4. Lessons Learned */}
        {reflection.lessons_learned && reflection.lessons_learned.length > 0 && (
          <div className="category-section lessons_learned">
            <div className="category-title" style={{ color: 'var(--cat-lesson-color)' }}>
              <Lightbulb size={16} />
              <span>Lessons Learned from Failures</span>
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
              <span>Weekly Highlights Worth Remembering</span>
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

        {/* 6. Overall Reflection */}
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
              <span>Overall Reflection on Weekly Progress</span>
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
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Weekly Reflection?"
        message={`Are you sure you want to delete the weekly reflection for ${reflection.week_start_date} to ${reflection.week_end_date}? The underlying daily logs will remain completely intact.`}
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
