import React, { useState } from 'react';
import type { DailyLog, DayBarData } from '../../types';
import { calculateWeeklyDayBars, getMondaySundayBoundaries } from '../../services/analytics';
import { BarChart3, Info, ChevronRight, CheckCircle2, AlertTriangle, Lightbulb, BookOpen } from 'lucide-react';

interface WeeklyPerformanceBarGraphProps {
  dailyLogs: DailyLog[];
  onSelectDate?: (date: string) => void;
}

export const WeeklyPerformanceBarGraph: React.FC<WeeklyPerformanceBarGraphProps> = ({
  dailyLogs,
  onSelectDate,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayBarData | null>(null);
  const bars = calculateWeeklyDayBars(dailyLogs);
  const { weekStart, weekEnd } = getMondaySundayBoundaries();

  // Active day to display details for
  const activeDay = selectedDay || bars.find((b) => b.isToday) || bars.find((b) => b.hasLog) || bars[0];

  return (
    <div className="card weekly-bars-card">
      <div className="card-header weekly-bars-header">
        <div>
          <div className="weekly-bars-title-row">
            <div className="advisor-icon" style={{ background: '#f5efe6', color: '#8c5836' }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="card-title">Weekly Performance Report (Mon – Sun)</h2>
              <p className="card-subtitle">
                Weekly output volume and success ratio across days • {weekStart} to {weekEnd}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="weekly-bars-legend">
          <div className="legend-section">
            <span className="legend-group-title">Color Rating:</span>
            <div className="legend-item">
              <span className="legend-swatch swatch-green"></span>
              <span>Green: Performed Well</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch swatch-yellow"></span>
              <span>Yellow: Average Performance</span>
            </div>
            <div className="legend-item">
              <span className="legend-swatch swatch-red"></span>
              <span>Red: High Failure Rate</span>
            </div>
          </div>

          <div className="legend-section">
            <span className="legend-group-title">Bar Length:</span>
            <span className="legend-subtext">Long (4+ tasks) • Medium (2-3) • Short (1)</span>
          </div>
        </div>
      </div>

      <div className="card-body weekly-bars-body">
        {/* The 7-Day Chart Stage */}
        <div className="bars-chart-container">
          <div className="bars-stage">
            {bars.map((bar) => {
              const isSelected = activeDay?.date === bar.date;

              // Height CSS class mapping
              const heightClass =
                bar.heightLevel === 'long'
                  ? 'bar-height-long'
                  : bar.heightLevel === 'medium'
                  ? 'bar-height-medium'
                  : bar.heightLevel === 'short'
                  ? 'bar-height-short'
                  : 'bar-height-empty';

              // Color CSS class mapping
              const colorClass =
                bar.colorRating === 'green'
                  ? 'bar-color-green'
                  : bar.colorRating === 'yellow'
                  ? 'bar-color-yellow'
                  : bar.colorRating === 'red'
                  ? 'bar-color-red'
                  : 'bar-color-gray';

              return (
                <div
                  key={bar.date}
                  className={`bar-column ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(bar)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedDay(bar);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${bar.dayName} ${bar.date}: ${bar.evaluationLabel}`}
                >
                  <div className="bar-track">
                    <div
                      className={`bar-pill ${heightClass} ${colorClass}`}
                      title={`${bar.dayName} (${bar.date}): ${bar.evaluationLabel}`}
                    >
                      {bar.taskCount > 0 && <span className="bar-count-badge">{bar.taskCount}</span>}
                    </div>
                  </div>

                  <div className="bar-day-meta">
                    <span className={`bar-day-name ${bar.isToday ? 'today-indicator' : ''}`}>
                      {bar.dayName}
                    </span>
                    <span className="bar-day-num">{bar.date.slice(8)}</span>
                    {bar.isToday && <span className="today-dot" title="Today"></span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Breakdown Detail Panel */}
        {activeDay && (
          <div className="bar-detail-panel">
            <div className="bar-detail-header">
              <div className="detail-header-left">
                <span className="detail-day-title">
                  {activeDay.dayName}, {activeDay.date}
                </span>
                <span className={`detail-status-pill pill-${activeDay.colorRating}`}>
                  {activeDay.evaluationLabel}
                </span>
                {activeDay.isToday && <span className="detail-today-pill">Today</span>}
              </div>

              {onSelectDate && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onSelectDate(activeDay.date)}
                >
                  <span>{activeDay.hasLog ? 'Edit Day Log' : 'Log This Day'}</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>

            {/* Quick Metrics for the Day */}
            <div className="bar-detail-stats-row">
              <div className="detail-stat-box">
                <span className="stat-label">Tasks Worked On</span>
                <span className="stat-val">{activeDay.taskCount}</span>
              </div>
              <div className="detail-stat-box">
                <span className="stat-label">Achievements</span>
                <span className="stat-val text-green">{activeDay.achievementsCount}</span>
              </div>
              <div className="detail-stat-box">
                <span className="stat-label">Failures / Blockers</span>
                <span className="stat-val text-red">{activeDay.failuresCount}</span>
              </div>
              <div className="detail-stat-box">
                <span className="stat-label">Lessons Captured</span>
                <span className="stat-val text-amber">{activeDay.lessonsCount}</span>
              </div>
            </div>

            {/* Itemized Lists */}
            {activeDay.hasLog ? (
              <div className="bar-detail-content-grid">
                {activeDay.items.work.length > 0 && (
                  <div className="detail-category-card">
                    <h4 className="detail-category-title">
                      <BookOpen size={14} />
                      <span>What I Worked On</span>
                    </h4>
                    <ul className="detail-list">
                      {activeDay.items.work.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeDay.items.achievements.length > 0 && (
                  <div className="detail-category-card">
                    <h4 className="detail-category-title text-green">
                      <CheckCircle2 size={14} />
                      <span>Achievements & Wins</span>
                    </h4>
                    <ul className="detail-list">
                      {activeDay.items.achievements.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeDay.items.failures.length > 0 && (
                  <div className="detail-category-card">
                    <h4 className="detail-category-title text-red">
                      <AlertTriangle size={14} />
                      <span>Challenges & Failures</span>
                    </h4>
                    <ul className="detail-list">
                      {activeDay.items.failures.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeDay.items.lessons.length > 0 && (
                  <div className="detail-category-card">
                    <h4 className="detail-category-title text-amber">
                      <Lightbulb size={14} />
                      <span>Lessons Learned</span>
                    </h4>
                    <ul className="detail-list">
                      {activeDay.items.lessons.map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="detail-empty-day">
                <Info size={16} />
                <span>No work log recorded for this date. Click "Log This Day" to record your activities.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
