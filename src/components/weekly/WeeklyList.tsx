import React from 'react';
import { WeeklyReflection } from '../../types';
import { Layers, Plus, Calendar, Award, AlertTriangle, Lightbulb, Sparkles, ChevronRight } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface WeeklyListProps {
  reflections: WeeklyReflection[];
  onSelectReflection: (reflection: WeeklyReflection) => void;
  onNewReflection: () => void;
}

export const WeeklyList: React.FC<WeeklyListProps> = ({
  reflections,
  onSelectReflection,
  onNewReflection,
}) => {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Weekly Reflections</h1>
            <p className="page-subtitle">
              Synthesize your weekly growth, review milestones, and extract strategic lessons from daily logs.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={onNewReflection}>
            <Plus size={16} />
            <span>New Weekly Reflection</span>
          </button>
        </div>
      </div>

      {reflections.length === 0 ? (
        <EmptyState
          icon={<Layers size={28} />}
          title="No weekly reflections yet"
          description="At the end of each week, take 10 minutes to auto-generate a weekly summary from your daily logs and reflect on your overall growth trajectory."
          actionLabel="Create This Week's Reflection"
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
                  <Calendar size={18} color="var(--text-tertiary)" />
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Week: {ref.week_start_date} – {ref.week_end_date}
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
                    {ref.lessons_learned && ref.lessons_learned.length > 0 && (
                      <span className="category-badge lessons_learned">
                        <Lightbulb size={12} /> {ref.lessons_learned.length} lessons
                      </span>
                    )}
                  </div>
                  <ChevronRight size={18} color="var(--text-tertiary)" />
                </div>
              </div>

              {/* Work done preview */}
              {ref.work_done && ref.work_done.length > 0 && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Weekly focus: </strong>
                  {ref.work_done.slice(0, 3).join(' • ')}
                </div>
              )}

              {/* Overall reflection quote */}
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
