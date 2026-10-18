import React, { useState } from 'react';
import { DailyLog } from '../../types';
import {
  extractFailureLearningRecords,
  analyzeRecurringThemes,
} from '../../services/analytics';
import {
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Search,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';

interface FailureExplorerProps {
  dailyLogs: DailyLog[];
  onOpenLog: (logId: string) => void;
}

export const FailureExplorer: React.FC<FailureExplorerProps> = ({ dailyLogs, onOpenLog }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const records = extractFailureLearningRecords(dailyLogs);
  const allFailures = records.map((r) => r.failure);
  const recurringThemes = analyzeRecurringThemes(allFailures);

  const filteredRecords = records.filter(
    (r) =>
      r.failure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.relatedLesson && r.relatedLesson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalChallenges = records.length;
  const totalLessons = dailyLogs.flatMap((l) => l.lessons_learned || []).length;
  const conversionRate =
    totalChallenges > 0 ? Math.round((totalLessons / totalChallenges) * 100) : 0;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div className="card-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 className="card-title" style={{ margin: 0 }}>
              <AlertTriangle size={18} color="var(--cat-failure-color)" />
              <span>Failure & Learning Growth Analytics</span>
            </h3>
            <span className="category-badge failures_and_challenges">Core Philosophy</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            Understanding blockers, identifying recurring friction points, and connecting challenges directly to lessons learned.
          </p>
        </div>
      </div>

      {/* Constructive Philosophy Banner */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FEF3C7',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem',
          marginBottom: '1.25rem',
          fontSize: '0.84rem',
          color: '#92400E',
          lineHeight: '1.5',
        }}
      >
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Growth Perspective:</strong> A higher failure count reflects ambitious work and rigorous honesty, not inadequacy. Every recorded failure is treated as an empirical data point to extract permanent technical and personal lessons.
        </div>
      </div>

      {/* Analytics Summary Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--cat-failure-bg)',
            border: '1px solid var(--cat-failure-border)',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--cat-failure-color)', fontWeight: 600 }}>
            RECORDED CHALLENGES
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cat-failure-color)', marginTop: '2px' }}>
            {totalChallenges}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Documented problem spaces
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--cat-lesson-bg)',
            border: '1px solid var(--cat-lesson-border)',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--cat-lesson-color)', fontWeight: 600 }}>
            LESSONS DERIVED
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--cat-lesson-color)', marginTop: '2px' }}>
            {totalLessons}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Actionable insights retained
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-medium)',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 600 }}>
            LESSON-TO-CHALLENGE RATIO
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {conversionRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Rate of problem reflection
          </div>
        </div>
      </div>

      {/* Recurring Challenge Themes */}
      {recurringThemes.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sparkles size={15} color="#D97706" />
            <span>Frequently Recurring Friction Themes</span>
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {recurringThemes.map((theme, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{theme.theme}</span>
                <span
                  style={{
                    backgroundColor: 'var(--border-medium)',
                    color: 'var(--text-secondary)',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {theme.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Explorer Table */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Challenge & Lesson Explorer ({filteredRecords.length})
          </h4>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search
              size={14}
              color="var(--text-tertiary)"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search challenges or lessons..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '2rem',
                paddingTop: '0.35rem',
                paddingBottom: '0.35rem',
                fontSize: '0.82rem',
              }}
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div
            style={{
              padding: '1.5rem',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              border: '1px dashed var(--border-light)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
            }}
          >
            {searchTerm
              ? 'No challenges matched your search filter.'
              : 'No challenges recorded yet. Add daily logs to analyze recurring blockers and lessons.'}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {filteredRecords.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{item.date}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onOpenLog(item.logId)}
                    style={{ padding: '2px 6px', fontSize: '0.75rem', gap: '3px' }}
                    title="Open original work log"
                  >
                    <span>View original log</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <AlertTriangle
                    size={15}
                    color="var(--cat-failure-color)"
                    style={{ flexShrink: 0, marginTop: '3px' }}
                  />
                  <span style={{ color: 'var(--cat-failure-color)', fontWeight: 500 }}>
                    {item.failure}
                  </span>
                </div>

                {item.relatedLesson && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.86rem',
                      backgroundColor: 'rgba(254, 252, 232, 0.6)',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '2px solid var(--cat-lesson-color)',
                    }}
                  >
                    <Lightbulb
                      size={14}
                      color="var(--cat-lesson-color)"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                    <span style={{ color: 'var(--cat-lesson-color)' }}>
                      <strong>Lesson:</strong> {item.relatedLesson}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
