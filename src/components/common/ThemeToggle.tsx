import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isNight } = useTheme();

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm theme-toggle-btn"
      onClick={toggleTheme}
      title={isNight ? 'Switch to Day Theme' : 'Switch to Night Theme'}
      aria-label={`Current theme is ${theme}. Click to switch theme.`}
    >
      {isNight ? (
        <Sun size={17} className="theme-icon sun-icon text-amber" />
      ) : (
        <Moon size={17} className="theme-icon moon-icon" />
      )}
    </button>
  );
};
