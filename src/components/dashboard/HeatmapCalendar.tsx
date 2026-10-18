import React, { useState } from 'react';
import type { DailyLog } from '../../types';
import { generateConsistencyGrid } from '../../services/analytics';
import { Calendar as CalendarIcon } from 'lucide-react';

interface HeatmapCalendarProps {
  dailyLogs: DailyLog[];
  onSelectDate: (date: string) => void;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ dailyLogs, onSelectDate }) => {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    hasLog: boolean;
    entriesCount: number;
    achievementsCount: number;
    failuresCount: number;
  } | null>(null);

  const { weeks, totalLoggedDays, totalDays, completionRate } = generateConsistencyGrid(dailyLogs, 16);

  const getLevelClass = (entriesCount: number, hasLog: boolean) => {
    if (!hasLog) return '';
    if (entriesCount >= 7) return 'level-4';
    if (entriesCount >= 4) return 'level-3';
    if (entriesCount >= 2) return 'level-2';
    return 'level-1';
  };

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div>
          <h3 className="card-title">
            <CalendarIcon size={18} color="#57534E" />
            <span>Logging Consistency Heatmap</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Past 16 weeks of daily logging activity. Click on any active day to view or edit the log.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {totalLoggedDays} / {totalDays} days
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              {completionRate}% consistency rate
            </div>
          </div>
        </div>
      </div>

      <div className="heatmap-container">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Day of week labels */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              fontSize: '9px',
              color: 'var(--text-tertiary)',
              userSelect: 'none',
              paddingTop: '2px',
            }}
          >
            {dayLabels.map((lbl, idx) => (
              <div key={idx} style={{ height: '13px', lineHeight: '13px', width: '12px' }}>
                {idx % 2 === 0 ? lbl : ''}
              </div>
            ))}
          </div>

          {/* Grid columns */}
          <div className="heatmap-grid">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="heatmap-column">
                {week.days.map((day) => {
                  const levelClass = getLevelClass(day.entriesCount, day.hasLog);
                  return (
                    <div
                      key={day.date}
                      className={`heatmap-cell ${levelClass}`}
                      onClick={() => onSelectDate(day.date)}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${day.date}: ${
                        day.hasLog
                          ? `${day.entriesCount} bullet entries (${day.achievementsCount} achievements, ${day.failuresCount} challenges)`
                          : 'No log recorded'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend & Tooltip readout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            {hoveredDay ? (
              <span>
                <strong>{hoveredDay.date}:</strong>{' '}
                {hoveredDay.hasLog ? (
                  <span>
                    {hoveredDay.entriesCount} entries ({hoveredDay.achievementsCount} achievements,{' '}
                    {hoveredDay.failuresCount} challenges) — <em>click to open</em>
                  </span>
                ) : (
                  <span>No log for this day — click to write today</span>
                )}
              </span>
            ) : (
              <span>Hover over squares to inspect details</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', marginRight: '4px' }}>Less</span>
            <div className="heatmap-cell" style={{ width: '11px', height: '11px' }} />
            <div className="heatmap-cell level-1" style={{ width: '11px', height: '11px' }} />
            <div className="heatmap-cell level-2" style={{ width: '11px', height: '11px' }} />
            <div className="heatmap-cell level-3" style={{ width: '11px', height: '11px' }} />
            <div className="heatmap-cell level-4" style={{ width: '11px', height: '11px' }} />
            <span style={{ fontSize: '0.75rem', marginLeft: '4px' }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
