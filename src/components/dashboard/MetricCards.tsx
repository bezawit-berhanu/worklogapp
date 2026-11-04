import React from 'react';
import type { OverallStats } from '../../types';
import {
  Calendar,
  Award,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Flame,
  Layers,
  CalendarRange,
} from 'lucide-react';

interface MetricCardsProps {
  stats: OverallStats;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <span>Daily Logs</span>
          <Calendar size={18} color="#57534E" />
        </div>
        <div className="stat-value">{stats.totalDailyLogs}</div>
        <div className="stat-footer">
          {stats.daysLoggedThisMonth} {stats.daysLoggedThisMonth === 1 ? 'day' : 'days'} this month
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Current Streak</span>
          <Flame size={18} color="#D97706" />
        </div>
        <div className="stat-value" style={{ color: stats.currentStreak > 0 ? '#D97706' : 'inherit' }}>
          {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
        </div>
        <div className="stat-footer">Longest: {stats.longestStreak} days</div>
      </div>

      <div className="stat-card" style={{ borderLeft: '3px solid var(--cat-achieve-color)' }}>
        <div className="stat-header">
          <span>Achievements</span>
          <Award size={18} color="var(--cat-achieve-color)" />
        </div>
        <div className="stat-value" style={{ color: 'var(--cat-achieve-color)' }}>
          {stats.totalAchievements}
        </div>
      </div>

      <div className="stat-card" style={{ borderLeft: '3px solid var(--cat-failure-color)' }}>
        <div className="stat-header">
          <span>Challenges</span>
          <AlertTriangle size={18} color="var(--cat-failure-color)" />
        </div>
        <div className="stat-value" style={{ color: 'var(--cat-failure-color)' }}>
          {stats.totalFailuresAndChallenges}
        </div>
      </div>

      <div className="stat-card" style={{ borderLeft: '3px solid var(--cat-lesson-color)' }}>
        <div className="stat-header">
          <span>Lessons</span>
          <Lightbulb size={18} color="var(--cat-lesson-color)" />
        </div>
        <div className="stat-value" style={{ color: 'var(--cat-lesson-color)' }}>
          {stats.totalLessonsLearned}
        </div>
      </div>

      <div className="stat-card" style={{ borderLeft: '3px solid var(--cat-highlight-color)' }}>
        <div className="stat-header">
          <span>Highlights</span>
          <Sparkles size={18} color="var(--cat-highlight-color)" />
        </div>
        <div className="stat-value" style={{ color: 'var(--cat-highlight-color)' }}>
          {stats.totalHighlights}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Weekly Reviews</span>
          <Layers size={18} color="#57534E" />
        </div>
        <div className="stat-value">{stats.totalWeeklyReflections}</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span>Monthly Reviews</span>
          <CalendarRange size={18} color="#57534E" />
        </div>
        <div className="stat-value">{stats.totalMonthlyReflections}</div>
      </div>
    </div>
  );
};
