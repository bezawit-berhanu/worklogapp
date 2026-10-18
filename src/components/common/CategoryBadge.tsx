import React from 'react';
import { ReflectionCategory } from '../../types';
import { Briefcase, Award, AlertTriangle, Lightbulb, Sparkles, BookOpen } from 'lucide-react';

interface CategoryBadgeProps {
  category: ReflectionCategory;
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, showIcon = true }) => {
  const meta: Record<
    ReflectionCategory,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    work_done: {
      label: 'What I Worked On',
      icon: <Briefcase size={12} />,
      className: 'category-badge work_done',
    },
    achievements: {
      label: 'Achievements',
      icon: <Award size={12} />,
      className: 'category-badge achievements',
    },
    failures_and_challenges: {
      label: 'Failures & Challenges',
      icon: <AlertTriangle size={12} />,
      className: 'category-badge failures_and_challenges',
    },
    lessons_learned: {
      label: 'Lessons Learned',
      icon: <Lightbulb size={12} />,
      className: 'category-badge lessons_learned',
    },
    highlights: {
      label: 'Highlights',
      icon: <Sparkles size={12} />,
      className: 'category-badge highlights',
    },
    overall_reflection: {
      label: 'Overall Reflection',
      icon: <BookOpen size={12} />,
      className: 'category-badge',
    },
  };

  const item = meta[category] || meta.work_done;

  return (
    <span className={item.className}>
      {showIcon && item.icon}
      <span>{item.label}</span>
    </span>
  );
};
