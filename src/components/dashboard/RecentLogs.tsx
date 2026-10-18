import React from 'react';
import { DailyLog, WeeklyReflection, MonthlyReflection } from '../../types';
import { getMonthName } from '../../services/summarizer';
import { Calendar, Layers, CalendarRange, ArrowRight, Award, AlertTriangle, Sparkles } from 'lucide-react';

interface RecentLogsProps {
  dailyLogs: DailyLog[];
  weeklyReflections: WeeklyReflection[];
  monthlyReflections: MonthlyReflection[];
  onSelectDaily: (logId: string) => void;
  onSelectWeekly: (id: string) => void;
  onSelectMonthly: (id: string) => void;
  onNavigate: (page: 'daily' | 'weekly' | 'monthly') => void;
}

export const RecentLogs: React.FC<RecentLogsProps> = ({
  dailyLogs,
  weeklyReflections,
  monthlyReflections,
  onSelectDaily,
  onSelectWeekly,
  onSelectMonthly,
  onNavigate,
}) => {
  const recentDaily = dailyLogs.slice(0, 3);
  const recentWeekly = weeklyReflections.slice(0, 2);
  const recentMonthly = monthlyReflections.slice(0, 1);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      {/* Recent Daily Logs */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calendar size={18} color="#57534E" />
            <span>Recent Daily Entries</span>
          </h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onNavigate('daily')}
            style={{ fontSize: '0.8rem', padding: '2px 8px' }}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentDaily.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', padding: '1rem 0' }}>
            No daily logs yet. Use the "New Daily Log" button to record today's progress.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentDaily.map((log) => (
              <div
                key={log.id}
                onClick={() => onSelectDaily(log.id)}
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    {log.date}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
                    {log.achievements && log.achievements.length > 0 && (
                      <span style={{ color: 'var(--cat-achieve-color)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <Award size={12} /> {log.achievements.length}
                      </span>
                    )}
                    {log.failures_and_challenges && log.failures_and_challenges.length > 0 && (
                      <span style={{ color: 'var(--cat-failure-color)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <AlertTriangle size={12} /> {log.failures_and_challenges.length}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {log.work_done && log.work_done[0]
                    ? log.work_done[0]
                    : log.overall_reflection || 'Work log recorded.'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Reflections */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Layers size={18} color="#57534E" />
            <span>Weekly & Monthly Reflections</span>
          </h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onNavigate('weekly')}
            style={{ fontSize: '0.8rem', padding: '2px 8px' }}
          >
            <span>Weekly Hub</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentWeekly.length === 0 && recentMonthly.length === 0 ? (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem', padding: '1rem 0' }}>
              No weekly or monthly reflections recorded yet. Synthesize your progress at the end of each week.
            </div>
          ) : (
            <>
              {recentWeekly.map((w) => (
                <div
                  key={w.id}
                  onClick={() => onSelectWeekly(w.id)}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      Week: {w.week_start_date} – {w.week_end_date}
                    </span>
                    <span className="category-badge work_done" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                      Weekly
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {w.overall_reflection || `${w.achievements.length} achievements highlighted.`}
                  </div>
                </div>
              ))}

              {recentMonthly.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onSelectMonthly(m.id)}
                  style={{
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-light)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {getMonthName(m.month)} {m.year} Growth Review
                    </span>
                    <span className="category-badge highlights" style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                      Monthly
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.overall_reflection || 'Comprehensive monthly milestone review.'}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
