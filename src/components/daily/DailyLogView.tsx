import React, { useState } from 'react';
import { DailyLog } from '../../types';
import { CategoryBadge } from '../common/CategoryBadge';
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

interface DailyLogViewProps {
  log: DailyLog;
  onEdit: (log: DailyLog) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({ log, onEdit, onDelete, onBack }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="card" style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* View Header */}
      <div
        className="card-header"
        style={{ paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-light)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onBack} title="Go back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="var(--text-tertiary)" />
              <h2 className="page-title" style={{ fontSize: '1.75rem', margin: 0 }}>
                {log.date}
              </h2>
              {log.is_draft && (
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                  }}
                >
                  Draft
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
              Logged on {new Date(log.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(log)}>
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
        {log.work_done && log.work_done.length > 0 && (
          <div className="category-section work_done">
            <div className="category-title" style={{ color: 'var(--cat-work-color)' }}>
              <Briefcase size={16} />
              <span>What I Worked On</span>
            </div>
            <ul className="bullet-item-list">
              {log.work_done.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 2. Achievements */}
        {log.achievements && log.achievements.length > 0 && (
          <div className="category-section achievements">
            <div className="category-title" style={{ color: 'var(--cat-achieve-color)' }}>
              <Award size={16} />
              <span>Achievements & Milestones</span>
            </div>
            <ul className="bullet-item-list">
              {log.achievements.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Failures & Challenges */}
        {log.failures_and_challenges && log.failures_and_challenges.length > 0 && (
          <div className="category-section failures_and_challenges">
            <div className="category-title" style={{ color: 'var(--cat-failure-color)' }}>
              <AlertTriangle size={16} />
              <span>Failures & Challenges Faced</span>
            </div>
            <ul className="bullet-item-list">
              {log.failures_and_challenges.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Lessons Learned */}
        {log.lessons_learned && log.lessons_learned.length > 0 && (
          <div className="category-section lessons_learned">
            <div className="category-title" style={{ color: 'var(--cat-lesson-color)' }}>
              <Lightbulb size={16} />
              <span>Lessons Learned from Challenges</span>
            </div>
            <ul className="bullet-item-list">
              {log.lessons_learned.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. Highlights */}
        {log.highlights && log.highlights.length > 0 && (
          <div className="category-section highlights">
            <div className="category-title" style={{ color: 'var(--cat-highlight-color)' }}>
              <Sparkles size={16} />
              <span>Highlights & Breakthroughs</span>
            </div>
            <ul className="bullet-item-list">
              {log.highlights.map((item, idx) => (
                <li key={idx} className="bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 6. Overall Reflection */}
        {log.overall_reflection && (
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
              <span>Overall Reflection</span>
            </div>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-main)',
                lineHeight: '1.6',
                fontStyle: 'italic',
              }}
            >
              "{log.overall_reflection}"
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Work Log?"
        message={`Are you sure you want to permanently delete the work log for ${log.date}? This action cannot be undone.`}
        confirmLabel="Permanently Delete"
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete(log.id);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
