import React, { useState } from 'react';
import { DailyLog } from '../../types';
import { formatDateString } from '../../services/summarizer';
import {
  Calendar,
  Plus,
  Search,
  Award,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface DailyLogListProps {
  logs: DailyLog[];
  onSelectLog: (log: DailyLog) => void;
  onNewLogForDate: (date: string) => void;
}

export const DailyLogList: React.FC<DailyLogListProps> = ({
  logs,
  onSelectLog,
  onNewLogForDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDateString(new Date()));

  // Map existing logs by date for fast lookup
  const dateLogMap = new Map<string, DailyLog>();
  logs.forEach((l) => dateLogMap.set(l.date, l));

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const inDate = log.date.includes(term);
    const inWork = log.work_done?.some((w) => w.toLowerCase().includes(term));
    const inAchieve = log.achievements?.some((a) => a.toLowerCase().includes(term));
    const inFailures = log.failures_and_challenges?.some((f) => f.toLowerCase().includes(term));
    const inLessons = log.lessons_learned?.some((l) => l.toLowerCase().includes(term));
    const inHighlights = log.highlights?.some((h) => h.toLowerCase().includes(term));
    const inReflection = log.overall_reflection?.toLowerCase().includes(term);

    return inDate || inWork || inAchieve || inFailures || inLessons || inHighlights || inReflection;
  });

  const selectedDateLog = dateLogMap.get(selectedDate);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Daily Work Logs</h1>
            <p className="page-subtitle">
              Your day-to-day record of activities, accomplishments, setbacks, and technical insights.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input
                type="date"
                className="form-input"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDateLog ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectLog(selectedDateLog)}
                >
                  <span>Open {selectedDate} Log</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onNewLogForDate(selectedDate)}
                >
                  <Plus size={14} />
                  <span>Log {selectedDate}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and stats bar */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search
            size={16}
            color="var(--text-tertiary)"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search daily entries by keyword, concept, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.1rem', fontSize: '0.88rem' }}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> entries
        </div>
      </div>

      {/* Log list */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={<Calendar size={28} />}
          title={searchTerm ? 'No entries match your search' : 'No daily logs recorded yet'}
          description={
            searchTerm
              ? `No logs found containing "${searchTerm}". Try a different keyword or clear the search.`
              : 'Consistent daily logging is the cornerstone of genuine professional growth. Record your first log today!'
          }
          actionLabel="Log Today's Work"
          onAction={() => onNewLogForDate(formatDateString(new Date()))}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredLogs.map((log) => {
            const hasAchievements = log.achievements && log.achievements.length > 0;
            const hasFailures = log.failures_and_challenges && log.failures_and_challenges.length > 0;
            const hasLessons = log.lessons_learned && log.lessons_learned.length > 0;
            const hasHighlights = log.highlights && log.highlights.length > 0;

            return (
              <div
                key={log.id}
                className="card"
                onClick={() => onSelectLog(log)}
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
                      {log.date}
                    </span>
                    {log.is_draft && (
                      <span
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          fontSize: '0.72rem',
                          padding: '1px 7px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 600,
                        }}
                      >
                        Draft
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {hasAchievements && (
                        <span className="category-badge achievements">
                          <Award size={12} /> {log.achievements.length}
                        </span>
                      )}
                      {hasFailures && (
                        <span className="category-badge failures_and_challenges">
                          <AlertTriangle size={12} /> {log.failures_and_challenges.length}
                        </span>
                      )}
                      {hasLessons && (
                        <span className="category-badge lessons_learned">
                          <Lightbulb size={12} /> {log.lessons_learned.length}
                        </span>
                      )}
                      {hasHighlights && (
                        <span className="category-badge highlights">
                          <Sparkles size={12} /> {log.highlights.length}
                        </span>
                      )}
                    </div>
                    <ChevronRight size={18} color="var(--text-tertiary)" />
                  </div>
                </div>

                {/* Main activities preview */}
                {log.work_done && log.work_done.length > 0 && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-main)' }}>Work done: </strong>
                    {log.work_done.join(' • ')}
                  </div>
                )}

                {/* Reflection quote if exists */}
                {log.overall_reflection && (
                  <div
                    style={{
                      fontSize: '0.84rem',
                      fontStyle: 'italic',
                      color: 'var(--text-tertiary)',
                      borderLeft: '2px solid var(--border-medium)',
                      paddingLeft: '0.65rem',
                    }}
                  >
                    "{log.overall_reflection}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
