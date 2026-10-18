import React from 'react';
import type { DailyLog } from '../../types';
import { generateMonthlyTrends } from '../../services/analytics';
import { BarChart3 } from 'lucide-react';

interface MonthlyBarChartProps {
  dailyLogs: DailyLog[];
}

export const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ dailyLogs }) => {
  const trends = generateMonthlyTrends(dailyLogs, 5);
  const maxVal = Math.max(3, ...trends.map((t) => Math.max(t.achievements, t.highlights, t.failures)));

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <BarChart3 size={18} color="#57534E" />
            <span>Monthly Activity & Output Comparison</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Volume of achievements and memorable breakthroughs across the past 5 months.
          </p>
        </div>
      </div>

      {dailyLogs.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No monthly data yet. As you add work logs, comparative volume will appear here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${trends.length}, 1fr)`,
              gap: '1rem',
              alignItems: 'flex-end',
              height: '160px',
              paddingTop: '1rem',
              borderBottom: '1px solid var(--border-light)',
            }}
          >
            {trends.map((t, idx) => {
              const achHeight = (t.achievements / maxVal) * 100;
              const highHeight = (t.highlights / maxVal) * 100;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '4px',
                      height: '100%',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Achievements bar */}
                    <div
                      style={{
                        height: `${Math.max(4, achHeight)}%`,
                        width: '18px',
                        backgroundColor: 'var(--cat-achieve-color)',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                      title={`${t.label} Achievements: ${t.achievements}`}
                    />
                    {/* Highlights bar */}
                    <div
                      style={{
                        height: `${Math.max(4, highHeight)}%`,
                        width: '18px',
                        backgroundColor: 'var(--cat-highlight-color)',
                        borderRadius: '3px 3px 0 0',
                        transition: 'height 0.3s ease',
                      }}
                      title={`${t.label} Highlights: ${t.highlights}`}
                    />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {t.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--cat-achieve-color)',
                }}
              />
              <span>Achievements</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--cat-highlight-color)',
                }}
              />
              <span>Highlights</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
