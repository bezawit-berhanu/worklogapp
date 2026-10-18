import React, { useState } from 'react';
import { ActivePage, AppDataBackup } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  CalendarRange,
  Search,
  Plus,
  Compass,
  Download,
  Upload,
  Sparkles,
  Trash2,
  Database,
  X,
} from 'lucide-react';
import { storage } from '../../services/storage';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onNewDailyLog: () => void;
  onDataChanged: () => void;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  onNewDailyLog,
  onDataChanged,
  showToast,
}) => {
  const [showDataModal, setShowDataModal] = useState(false);

  const handleExportBackup = () => {
    try {
      const data = storage.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `worklog-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('success', 'Backup exported successfully.');
    } catch {
      showToast('error', 'Failed to export backup.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json: AppDataBackup = JSON.parse(event.target?.result as string);
        const result = storage.importBackup(json);
        if (result.success) {
          showToast('success', `Restored ${result.count} entries from backup.`);
          onDataChanged();
          setShowDataModal(false);
        } else {
          showToast('error', result.error || 'Invalid backup format.');
        }
      } catch {
        showToast('error', 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleData = () => {
    storage.loadSampleData();
    showToast('success', 'Sample work logs loaded successfully.');
    onDataChanged();
    setShowDataModal(false);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all work logs and reflections? This cannot be undone.')) {
      storage.clearAllData();
      showToast('info', 'All application data cleared.');
      onDataChanged();
      setShowDataModal(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand-wrapper" onClick={() => onNavigate('dashboard')}>
            <div className="brand-icon">
              <Compass size={20} />
            </div>
            <div>
              <div className="brand-title">WorkLog</div>
              <div className="brand-subtitle">Growth Tracker</div>
            </div>
          </div>

          <nav>
            <ul className="nav-links">
              <li>
                <button
                  type="button"
                  className={`nav-link ${activePage === 'dashboard' ? 'active' : ''}`}
                  onClick={() => onNavigate('dashboard')}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activePage === 'daily' ? 'active' : ''}`}
                  onClick={() => onNavigate('daily')}
                >
                  <Calendar size={16} />
                  <span>Daily Logs</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activePage === 'weekly' ? 'active' : ''}`}
                  onClick={() => onNavigate('weekly')}
                >
                  <Layers size={16} />
                  <span>Weekly</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activePage === 'monthly' ? 'active' : ''}`}
                  onClick={() => onNavigate('monthly')}
                >
                  <CalendarRange size={16} />
                  <span>Monthly</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activePage === 'search' ? 'active' : ''}`}
                  onClick={() => onNavigate('search')}
                >
                  <Search size={16} />
                  <span>History & Search</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowDataModal(true)}
              title="Backup and Data Tools"
            >
              <Database size={16} />
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNewDailyLog}
              id="new-daily-log-btn"
            >
              <Plus size={16} />
              <span>New Daily Log</span>
            </button>
          </div>
        </div>
      </header>

      {showDataModal && (
        <div className="modal-overlay" onClick={() => setShowDataModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="modal-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} />
                <span>Data Management & Backup</span>
              </h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowDataModal(false)}
                style={{ padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-description">
              All your entries are saved permanently in local storage on this browser. You can export a full JSON backup to safeguard your growth history, restore a previous backup, or explore with sample logs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={handleExportBackup}
              >
                <Download size={16} />
                <span>Export Full Backup (JSON)</span>
              </button>

              <label
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', cursor: 'pointer', margin: 0 }}
              >
                <Upload size={16} />
                <span>Import / Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={handleLoadSampleData}
              >
                <Sparkles size={16} />
                <span>Load Sample Demonstration Logs</span>
              </button>

              <button
                type="button"
                className="btn btn-danger"
                style={{ justifyContent: 'flex-start', marginTop: '0.5rem' }}
                onClick={handleClearAll}
              >
                <Trash2 size={16} />
                <span>Clear All Logs</span>
              </button>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowDataModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
