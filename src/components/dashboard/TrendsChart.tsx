import React, { useState } from 'react';
import { DailyLog, DateRangeFilter } from '../../types';
import { generateMonthlyTrends, filterLogsByDateRange } from '../../services/analytics';
import { TrendingUp, Filter } from 'lucide-react';

interface TrendsChartProps {
  dailyLogs: DailyLog[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ dailyLogs }) => {
  const [filterPeriod, setFilterPeriod] = useState<DateRangeFilter['period']>('all');

  const filteredLogs = filterLogsByDateRange(dailyLogs, { period: filterPeriod });
  const trends = generateMonthlyTrends(filteredLogs, 6);

  // Determine max value for SVG scaling
  const maxValue = Math.max(
    5,
    ...trends.flatMap((t) => [t.achievements, t.failures, t.lessons, t.highlights])
  );

  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Build points
  const getX = (index: number) => {
    if (trends.length <= 1) return paddingX + graphWidth / 2;
    return paddingX + (index / (trends.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    return height - paddingY - (val / maxValue) * graphHeight;
  };

  const createPath = (dataKey: 'achievements' | 'failures' | 'lessons') => {
    if (trends.length === 0) return '';
    return trends
      .map((t, idx) => {
        const x = getX(idx);
        const y = getY(t[dataKey]);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <TrendingUp size={18} color="#57534E" />
            <span>Growth Trajectory Over Time</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Monthly evolution of recorded achievements, challenges faced, and lessons distilled.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} color="#8C827A" />
          <select
            className="form-select"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value as DateRangeFilter['period'])}
          >
            <option value="all">All Time</option>
            <option value="this_year">This Year</option>
            <option value="90d">Last 90 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {dailyLogs.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          No records yet. Statistics and growth lines will render as you save daily entries.
        </div>
      ) : (
        <div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              style={{ width: '100%', height: 'auto', maxHeight: '250px' }}
            >
              {/* Background grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = height - paddingY - pct * graphHeight;
                const valueLabel = Math.round(pct * maxValue);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="var(--border-light)"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      fontSize="10"
                      fill="var(--text-tertiary)"
                      textAnchor="end"
                    >
                      {valueLabel}
                    </text>
                  </g>
                );
              })}

              {/* Data Lines */}
              <path
                d={createPath('achievements')}
                fill="none"
                stroke="var(--cat-achieve-color)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={createPath('failures')}
                fill="none"
                stroke="var(--cat-failure-color)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={createPath('lessons')}
                fill="none"
                stroke="var(--cat-lesson-color)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {trends.map((t, idx) => {
                const x = getX(idx);
                return (
                  <g key={idx}>
                    <circle
                      cx={x}
                      cy={getY(t.achievements)}
                      r="4"
                      fill="var(--cat-achieve-color)"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={x}
                      cy={getY(t.failures)}
                      r="4"
                      fill="var(--cat-failure-color)"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={x}
                      cy={getY(t.lessons)}
                      r="4"
                      fill="var(--cat-lesson-color)"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    {/* X axis labels */}
                    <text
                      x={x}
                      y={height - 8}
                      fontSize="10"
                      fill="var(--text-secondary)"
                      textAnchor="middle"
                      fontWeight="500"
                    >
                      {t.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
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
                  borderRadius: '50%',
                  backgroundColor: 'var(--cat-failure-color)',
                }}
              />
              <span>Challenges Faced</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--cat-lesson-color)',
                }}
              />
              <span>Lessons Learned</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
