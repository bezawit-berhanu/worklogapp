import React from 'react';
import type { WeeklyScore } from '../../types';
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';

interface WeeklyScoreBadgeProps {
  scoreData: WeeklyScore;
  compact?: boolean;
}

export const WeeklyScoreBadge: React.FC<WeeklyScoreBadgeProps> = ({ scoreData, compact = false }) => {
  const { score, diff, trend, weekStart, weekEnd } = scoreData;

  // Color classes and badge variants
  const isImproved = trend === 'improved';
  const isDecreased = trend === 'decreased';

  const badgeClass = isImproved
    ? 'score-trend-improved'
    : isDecreased
    ? 'score-trend-decreased'
    : 'score-trend-neutral';

  const trendIcon = isImproved ? (
    <TrendingUp size={14} className="trend-icon" />
  ) : isDecreased ? (
    <TrendingDown size={14} className="trend-icon" />
  ) : (
    <Minus size={14} className="trend-icon" />
  );

  const trendText =
    trend === 'baseline'
      ? 'Baseline week'
      : trend === 'improved'
      ? `${diff}% improved`
      : trend === 'decreased'
      ? `${diff}% decreased`
      : 'Same as last week';

  if (compact) {
    return (
      <div className="weekly-score-pill" title={`Week: ${weekStart} to ${weekEnd}`}>
        <div className="score-percentage-val">{score}%</div>
        <div className={`score-delta-pill ${badgeClass}`}>
          {trendIcon}
          <span>{trendText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="weekly-score-card" title={`Weekly Growth Score for ${weekStart} to ${weekEnd}`}>
      <div className="weekly-score-header">
        <span className="score-label">Score of the Week</span>
        <Award size={16} className="score-icon" />
      </div>

      <div className="weekly-score-body">
        <div className="weekly-score-value">{score}%</div>
        <div className={`weekly-score-trend ${badgeClass}`}>
          {trendIcon}
          <span>{trendText}</span>
        </div>
      </div>

      <div className="weekly-score-footer">
        <span>vs. previous week ({scoreData.previousScore}%)</span>
      </div>
    </div>
  );
};
