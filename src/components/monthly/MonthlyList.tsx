import React from 'react';
import type { MonthlyReflection } from '../../types';
import { getMonthName } from '../../services/summarizer';
import { CalendarRange, Plus, Award, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface MonthlyListProps {
  reflections: MonthlyReflection[];
  onSelectReflection: (reflection: MonthlyReflection) => void;
  onNewReflection: () => void;
}

export const MonthlyList: React.FC<MonthlyListProps> = ({
  reflections,
  onSelectReflection,
  onNewReflection,
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Monthly Reflections</h1>
            <p className="page-subtitle">
              Long-term reviews of your professional and academic growth, recurring challenges, and evolution.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={onNewReflection}>
            <Plus size={16} />
            <span>New Monthly Reflection</span>
          </button>
        </div>
      </div>

      {reflections.length === 0 ? (
        <EmptyState
          icon={<CalendarRange size={28} />}
          title="No monthly reflections yet"
          description="Reviewing entire months allows you to step back from the daily weeds, celebrate cumulative progress, and spot recurring challenges."
          actionLabel="Create Monthly Reflection"
          onAction={onNewReflection}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reflections.map((ref) => (
            <div
              key={ref.id}
              className="card"
              onClick={() => onSelectReflection(ref)}
              style={{
                cursor: 'pointer',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CalendarRange size={18} color="var(--text-tertiary)" />
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {getMonthName(ref.month)} {ref.year} Retrospective
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {ref.achievements && ref.achievements.length > 0 && (
                      <span className="category-badge achievements">
                        <Award size={12} /> {ref.achievements.length} achievements
                      </span>
                    )}
                    {ref.failures_and_challenges && ref.failures_and_challenges.length > 0 && (
                      <span className="category-badge failures_and_challenges">
                        <AlertTriangle size={12} /> {ref.failures_and_challenges.length} challenges
                      </span>
                    )}
                    {ref.highlights && ref.highlights.length > 0 && (
                      <span className="category-badge highlights">
                        <Sparkles size={12} /> {ref.highlights.length} highlights
                      </span>
                    )}
                  </div>
                  <ChevronRight size={18} color="var(--text-tertiary)" />
                </div>
              </div>

              {/* Work done preview */}
              {ref.work_done && ref.work_done.length > 0 && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Monthly focus: </strong>
                  {ref.work_done.slice(0, 3).join(' • ')}
                </div>
              )}

              {/* Overall growth quote */}
              {ref.overall_reflection && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: 'var(--text-tertiary)',
                    borderLeft: '2px solid var(--border-medium)',
                    paddingLeft: '0.65rem',
                  }}
                >
                  "{ref.overall_reflection}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
