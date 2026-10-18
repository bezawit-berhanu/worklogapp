import React, { useState } from 'react';
import { DailyLog, WeeklyReflection, MonthlyReflection } from '../../types';
import { getMonthName } from '../../services/summarizer';
import {
  Search,
  Filter,
  Calendar,
  Layers,
  CalendarRange,
  Award,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface SearchHistoryProps {
  dailyLogs: DailyLog[];
  weeklyReflections: WeeklyReflection[];
  monthlyReflections: MonthlyReflection[];
  onOpenDaily: (log: DailyLog) => void;
  onOpenWeekly: (reflection: WeeklyReflection) => void;
  onOpenMonthly: (reflection: MonthlyReflection) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  dailyLogs,
  weeklyReflections,
  monthlyReflections,
  onOpenDaily,
  onOpenWeekly,
  onOpenMonthly,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entryTypeFilter, setEntryTypeFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'achievements' | 'failures' | 'lessons' | 'highlights'
  >('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Unify entries into searchable items
  interface SearchResultItem {
    id: string;
    type: 'daily' | 'weekly' | 'monthly';
    dateLabel: string;
    comparableDate: string;
    workDone: string[];
    achievements: string[];
    failures: string[];
    lessons: string[];
    highlights: string[];
    reflection: string;
    rawItem: DailyLog | WeeklyReflection | MonthlyReflection;
  }

  const allItems: SearchResultItem[] = [
    ...dailyLogs.map((d) => ({
      id: d.id,
      type: 'daily' as const,
      dateLabel: d.date,
      comparableDate: d.date,
      workDone: d.work_done || [],
      achievements: d.achievements || [],
      failures: d.failures_and_challenges || [],
      lessons: d.lessons_learned || [],
      highlights: d.highlights || [],
      reflection: d.overall_reflection || '',
      rawItem: d,
    })),
    ...weeklyReflections.map((w) => ({
      id: w.id,
      type: 'weekly' as const,
      dateLabel: `Week: ${w.week_start_date} – ${w.week_end_date}`,
      comparableDate: w.week_start_date,
      workDone: w.work_done || [],
      achievements: w.achievements || [],
      failures: w.failures_and_challenges || [],
      lessons: w.lessons_learned || [],
      highlights: w.highlights || [],
      reflection: w.overall_reflection || '',
      rawItem: w,
    })),
    ...monthlyReflections.map((m) => ({
      id: m.id,
      type: 'monthly' as const,
      dateLabel: `${getMonthName(m.month)} ${m.year}`,
      comparableDate: `${m.year}-${String(m.month).padStart(2, '0')}-01`,
      workDone: m.work_done || [],
      achievements: m.achievements || [],
      failures: m.failures_and_challenges || [],
      lessons: m.lessons_learned || [],
      highlights: m.highlights || [],
      reflection: m.overall_reflection || '',
      rawItem: m,
    })),
  ];

  // Filtering logic
  const filteredResults = allItems.filter((item) => {
    // 1. Entry Type Filter
    if (entryTypeFilter !== 'all' && item.type !== entryTypeFilter) {
      return false;
    }

    // 2. Category Filter
    if (categoryFilter === 'achievements' && item.achievements.length === 0) return false;
    if (categoryFilter === 'failures' && item.failures.length === 0) return false;
    if (categoryFilter === 'lessons' && item.lessons.length === 0) return false;
    if (categoryFilter === 'highlights' && item.highlights.length === 0) return false;

    // 3. Date Range Filter
    if (startDate && item.comparableDate < startDate) return false;
    if (endDate && item.comparableDate > endDate) return false;

    // 4. Keyword Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const inDate = item.dateLabel.toLowerCase().includes(term);
      const inWork = item.workDone.some((w) => w.toLowerCase().includes(term));
      const inAchieve = item.achievements.some((a) => a.toLowerCase().includes(term));
      const inFailures = item.failures.some((f) => f.toLowerCase().includes(term));
      const inLessons = item.lessons.some((l) => l.toLowerCase().includes(term));
      const inHighlights = item.highlights.some((h) => h.toLowerCase().includes(term));
      const inReflection = item.reflection.toLowerCase().includes(term);

      return (
        inDate || inWork || inAchieve || inFailures || inLessons || inHighlights || inReflection
      );
    }

    return true;
  });

  // Sort descending by date
  filteredResults.sort((a, b) => b.comparableDate.localeCompare(a.comparableDate));

  const handleResetFilters = () => {
    setSearchTerm('');
    setEntryTypeFilter('all');
    setCategoryFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const handleItemClick = (item: SearchResultItem) => {
    if (item.type === 'daily') onOpenDaily(item.rawItem as DailyLog);
    else if (item.type === 'weekly') onOpenWeekly(item.rawItem as WeeklyReflection);
    else if (item.type === 'monthly') onOpenMonthly(item.rawItem as MonthlyReflection);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">History & Search</h1>
            <p className="page-subtitle">
              Locate any past accomplishment, re-read how you solved an obscure bug, or examine past lessons learned.
            </p>
          </div>

          {(searchTerm || entryTypeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate) && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleResetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={18}
            color="var(--text-tertiary)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search all records for keywords, technologies, bugs, insights (e.g. 'docker', 'latency', 'sql')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.4rem', fontSize: '0.95rem' }}
          />
        </div>

        {/* Filter Controls Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Entry type filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                TYPE:
              </span>
              <select
                className="form-select"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                value={entryTypeFilter}
                onChange={(e) =>
                  setEntryTypeFilter(e.target.value as 'all' | 'daily' | 'weekly' | 'monthly')
                }
              >
                <option value="all">All Types</option>
                <option value="daily">Daily Logs Only</option>
                <option value="weekly">Weekly Reflections Only</option>
                <option value="monthly">Monthly Reflections Only</option>
              </select>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                CONTAINING:
              </span>
              <select
                className="form-select"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value as 'all' | 'achievements' | 'failures' | 'lessons' | 'highlights'
                  )
                }
              >
                <option value="all">Any Category</option>
                <option value="achievements">With Achievements</option>
                <option value="failures">With Failures / Challenges</option>
                <option value="lessons">With Lessons Learned</option>
                <option value="highlights">With Highlights</option>
              </select>
            </div>
          </div>

          {/* Date range filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              DATES:
            </span>
            <input
              type="date"
              className="form-input"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="From"
              title="From date"
            />
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>–</span>
            <input
              type="date"
              className="form-input"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="To"
              title="To date"
            />
          </div>
        </div>
      </div>

      {/* Results List */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Showing <strong>{filteredResults.length}</strong> matching {filteredResults.length === 1 ? 'record' : 'records'}
      </div>

      {filteredResults.length === 0 ? (
        <EmptyState
          icon={<Search size={28} />}
          title="No results found"
          description="Try broadening your search keywords or adjusting your category and date filters."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredResults.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() => handleItemClick(item)}
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
                  {item.type === 'daily' && <Calendar size={18} color="var(--cat-work-color)" />}
                  {item.type === 'weekly' && <Layers size={18} color="var(--cat-achieve-color)" />}
                  {item.type === 'monthly' && (
                    <CalendarRange size={18} color="var(--cat-highlight-color)" />
                  )}
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.dateLabel}
                  </span>
                  <span
                    className={`category-badge ${
                      item.type === 'daily'
                        ? 'work_done'
                        : item.type === 'weekly'
                        ? 'achievements'
                        : 'highlights'
                    }`}
                    style={{ fontSize: '0.7rem' }}
                  >
                    {item.type.toUpperCase()}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span>Open full entry</span>
                  <ExternalLink size={14} />
                </div>
              </div>

              {/* Categorical previews */}
              {item.workDone.length > 0 && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Work: </strong>
                  {item.workDone.slice(0, 2).join(' • ')}
                </div>
              )}

              {item.achievements.length > 0 && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--cat-achieve-color)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                  }}
                >
                  <Award size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item.achievements.slice(0, 2).join(' • ')}</span>
                </div>
              )}

              {item.failures.length > 0 && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--cat-failure-color)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                  }}
                >
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item.failures.slice(0, 2).join(' • ')}</span>
                </div>
              )}

              {item.lessons.length > 0 && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--cat-lesson-color)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.4rem',
                  }}
                >
                  <Lightbulb size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item.lessons.slice(0, 2).join(' • ')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
