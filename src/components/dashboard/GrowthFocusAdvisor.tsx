import React from 'react';
import type { DailyLog } from '../../types';
import { calculateFocusRecommendations, evaluateAchievements } from '../../services/analytics';
import { Target, Award, AlertCircle, CheckCircle2, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';

interface GrowthFocusAdvisorProps {
  dailyLogs: DailyLog[];
  onLogWorkClick?: () => void;
}

export const GrowthFocusAdvisor: React.FC<GrowthFocusAdvisorProps> = ({ dailyLogs, onLogWorkClick }) => {
  const recommendations = calculateFocusRecommendations(dailyLogs);
  const judgments = evaluateAchievements(dailyLogs);

  return (
    <div className="growth-advisor-grid">
      {/* CARD 1: WHAT TO WORK ON HIGHLY */}
      <div className="card advisor-card focus-card">
        <div className="card-header advisor-header">
          <div className="advisor-title-group">
            <div className="advisor-icon focus-icon">
              <Target size={20} />
            </div>
            <div>
              <h2 className="card-title">What to Work on Highly</h2>
            </div>
          </div>
        </div>

        <div className="card-body advisor-body">
          {recommendations.length === 0 ? (
            <div className="empty-advisor-state">
              <Lightbulb size={24} />
              <p>No high-friction bottlenecks detected. Keep logging daily to track emerging focus areas.</p>
            </div>
          ) : (
            <div className="focus-recommendations-list">
              {recommendations.map((rec) => (
                <div key={rec.id} className={`focus-rec-item severity-${rec.severity}`}>
                  <div className="focus-rec-top">
                    <span className="focus-category-tag">
                      <BookOpen size={13} />
                      {rec.category}
                    </span>
                    <span className={`severity-badge badge-${rec.severity}`}>
                      {rec.severity === 'high' ? 'High Attention' : rec.severity === 'medium' ? 'Recommended' : 'Observation'}
                    </span>
                  </div>

                  <h3 className="focus-rec-title">{rec.title}</h3>
                  <p className="focus-rec-message">{rec.message}</p>

                  <div className="focus-action-box">
                    <div className="focus-action-label">
                      <ArrowRight size={13} />
                      <span>Suggested Action:</span>
                    </div>
                    <p className="focus-action-text">{rec.actionPrompt}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CARD 2: ACHIEVEMENT EVALUATION & PRAISE */}
      <div className="card advisor-card achievement-card">
        <div className="card-header advisor-header">
          <div className="advisor-title-group">
            <div className="advisor-icon achievement-icon">
              <Award size={20} />
            </div>
            <div>
              <h2 className="card-title">What You Did Well On</h2>
            </div>
          </div>
        </div>

        <div className="card-body advisor-body">
          {judgments.length === 0 ? (
            <div className="empty-advisor-state">
              <AlertCircle size={24} />
              <p>Log your daily achievements to receive real evaluations of your work.</p>
            </div>
          ) : (
            <div className="achievement-judgments-list">
              {judgments.map((item) => (
                <div key={item.id} className={`judgment-item impact-${item.impact}`}>
                  <div className="judgment-top">
                    <div className="judgment-badge-row">
                      <CheckCircle2 size={16} className="judgment-check" />
                      <span className="judgment-title">{item.title}</span>
                    </div>
                    <span className={`impact-pill pill-${item.impact}`}>
                      {item.impact === 'outstanding' ? 'Top Win' : item.impact === 'solid' ? 'Solid Progress' : 'Initiative'}
                    </span>
                  </div>

                  <p className="judgment-praise">"{item.praise}"</p>

                  {item.evidence && item.evidence.length > 0 && (
                    <div className="judgment-evidence">
                      <span className="evidence-label">Logged Evidence:</span>
                      <ul className="evidence-list">
                        {item.evidence.map((ev, idx) => (
                          <li key={idx}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {onLogWorkClick && (
            <div className="advisor-footer-action">
              <button type="button" className="btn btn-outline btn-sm" onClick={onLogWorkClick}>
                Log today's achievements & learnings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
