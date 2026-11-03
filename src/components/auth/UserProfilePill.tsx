import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LogIn, ChevronDown } from 'lucide-react';

interface UserProfilePillProps {
  onOpenAuthModal: () => void;
}

export const UserProfilePill: React.FC<UserProfilePillProps> = ({ onOpenAuthModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={onOpenAuthModal}
        title="Sign In or Create Account"
      >
        <LogIn size={15} />
        <span>Sign In</span>
      </button>
    );
  }

  const initials = user.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user.username.slice(0, 2).toUpperCase();

  return (
    <div className="user-profile-wrapper">
      <button
        type="button"
        className="user-profile-pill"
        onClick={() => setDropdownOpen((prev) => !prev)}
        title={`Signed in as ${user.email}`}
      >
        <div className="user-avatar-circle">{initials}</div>
        <div className="user-pill-meta">
          <span className="user-pill-name">{user.name || user.username}</span>
          <span className="user-pill-role">{user.role}</span>
        </div>
        <ChevronDown size={14} className="user-pill-arrow" />
      </button>

      {dropdownOpen && (
        <div className="user-dropdown-menu" onClick={() => setDropdownOpen(false)}>
          <div className="user-dropdown-header">
            <div className="dropdown-user-title">{user.name}</div>
            <div className="dropdown-user-email">{user.email}</div>
          </div>
          <div className="dropdown-divider"></div>
          <button
            type="button"
            className="dropdown-item text-red"
            onClick={() => {
              logout();
              setDropdownOpen(false);
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
