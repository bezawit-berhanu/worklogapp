import React, { useState, useEffect, useCallback } from 'react';
import { ActivePage, DailyLog, WeeklyReflection, MonthlyReflection } from './types';
import { storage } from './services/storage';
import { calculateOverallStats } from './services/analytics';
import { formatDateString } from './services/summarizer';
import { Navbar } from './components/common/Navbar';
import { Toast, ToastMessage } from './components/common/Toast';

// Dashboard Components
import { MetricCards } from './components/dashboard/MetricCards';
import { HeatmapCalendar } from './components/dashboard/HeatmapCalendar';
import { TrendsChart } from './components/dashboard/TrendsChart';
import { MonthlyBarChart } from './components/dashboard/MonthlyBarChart';
import { FailureExplorer } from './components/dashboard/FailureExplorer';
import { RecentLogs } from './components/dashboard/RecentLogs';

// Daily Components
import { DailyLogList } from './components/daily/DailyLogList';
import { DailyLogForm } from './components/daily/DailyLogForm';
import { DailyLogView } from './components/daily/DailyLogView';

// Weekly Components
import { WeeklyList } from './components/weekly/WeeklyList';
import { WeeklyReflectionForm } from './components/weekly/WeeklyReflectionForm';
import { WeeklyReflectionView } from './components/weekly/WeeklyReflectionView';

// Monthly Components
import { MonthlyList } from './components/monthly/MonthlyList';
import { MonthlyReflectionForm } from './components/monthly/MonthlyReflectionForm';
import { MonthlyReflectionView } from './components/monthly/MonthlyReflectionView';

// Search Component
import { SearchHistory } from './components/search/SearchHistory';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  // Core Data State
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>([]);
  const [monthlyReflections, setMonthlyReflections] = useState<MonthlyReflection[]>([]);

  // Active item viewing / editing state
  const [editingDailyLog, setEditingDailyLog] = useState<{ log?: DailyLog | null; date?: string } | null>(null);
  const [viewingDailyLog, setViewingDailyLog] = useState<DailyLog | null>(null);

  const [editingWeekly, setEditingWeekly] = useState<WeeklyReflection | null | undefined>(null);
  const [viewingWeekly, setViewingWeekly] = useState<WeeklyReflection | null>(null);

  const [editingMonthly, setEditingMonthly] = useState<MonthlyReflection | null | undefined>(null);
  const [viewingMonthly, setViewingMonthly] = useState<MonthlyReflection | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Reload data from storage
  const reloadData = useCallback(() => {
    const dLogs = storage.getDailyLogs();
    const wRefs = storage.getWeeklyReflections();
    const mRefs = storage.getMonthlyReflections();
    setDailyLogs(dLogs);
    setWeeklyReflections(wRefs);
    setMonthlyReflections(mRefs);
  }, []);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Overall statistics derived strictly from real saved data
  const overallStats = calculateOverallStats(dailyLogs, weeklyReflections, monthlyReflections);

  // Navigation handlers
  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    setEditingDailyLog(null);
    setViewingDailyLog(null);
    setEditingWeekly(null);
    setViewingWeekly(null);
    setEditingMonthly(null);
    setViewingMonthly(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewDailyLog = (targetDate?: string) => {
    const dateToUse = targetDate || formatDateString(new Date());
    const existing = storage.getDailyLogByDate(dateToUse);

    if (existing) {
      setViewingDailyLog(existing);
      setEditingDailyLog(null);
    } else {
      setEditingDailyLog({ log: null, date: dateToUse });
      setViewingDailyLog(null);
    }
    setActivePage('daily');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Daily Log CRUD
  const handleSaveDailyLog = (log: DailyLog) => {
    const res = storage.saveDailyLog(log);
    if (res.success) {
      showToast('success', `Daily work log for ${log.date} saved successfully.`);
      reloadData();
      setEditingDailyLog(null);
      setViewingDailyLog(log);
    } else {
      showToast('error', res.error || 'Failed to save daily log.');
    }
  };

  const handleDeleteDailyLog = (id: string) => {
    const deleted = storage.deleteDailyLog(id);
    if (deleted) {
      showToast('info', 'Daily work log deleted.');
      reloadData();
      setViewingDailyLog(null);
      setEditingDailyLog(null);
    } else {
      showToast('error', 'Failed to delete daily log.');
    }
  };

  // Weekly Reflection CRUD
  const handleSaveWeeklyReflection = (reflection: WeeklyReflection) => {
    const res = storage.saveWeeklyReflection(reflection);
    if (res.success) {
      showToast('success', 'Weekly reflection saved.');
      reloadData();
      setEditingWeekly(null);
      setViewingWeekly(reflection);
    } else {
      showToast('error', res.error || 'Failed to save weekly reflection.');
    }
  };

  const handleDeleteWeeklyReflection = (id: string) => {
    const deleted = storage.deleteWeeklyReflection(id);
    if (deleted) {
      showToast('info', 'Weekly reflection deleted.');
      reloadData();
      setViewingWeekly(null);
      setEditingWeekly(null);
    } else {
      showToast('error', 'Failed to delete weekly reflection.');
    }
  };

  // Monthly Reflection CRUD
  const handleSaveMonthlyReflection = (reflection: MonthlyReflection) => {
    const res = storage.saveMonthlyReflection(reflection);
    if (res.success) {
      showToast('success', 'Monthly reflection saved.');
      reloadData();
      setEditingMonthly(null);
      setViewingMonthly(reflection);
    } else {
      showToast('error', res.error || 'Failed to save monthly reflection.');
    }
  };

  const handleDeleteMonthlyReflection = (id: string) => {
    const deleted = storage.deleteMonthlyReflection(id);
    if (deleted) {
      showToast('info', 'Monthly reflection deleted.');
      reloadData();
      setViewingMonthly(null);
      setEditingMonthly(null);
    } else {
      showToast('error', 'Failed to delete monthly reflection.');
    }
  };

  // Open daily log by ID (used by FailureExplorer & Search)
  const handleOpenDailyLogById = (logId: string) => {
    const found = storage.getDailyLogById(logId);
    if (found) {
      setViewingDailyLog(found);
      setEditingDailyLog(null);
      setActivePage('daily');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        onNewDailyLog={() => handleStartNewDailyLog()}
        onDataChanged={reloadData}
        showToast={showToast}
      />

      <main className="main-content">
        {/* ================= DASHBOARD PAGE ================= */}
        {activePage === 'dashboard' && (
          <div>
            <div className="page-header">
              <div className="page-header-row">
                <div>
                  <h1 className="page-title">Personal Growth Dashboard</h1>
                  <p className="page-subtitle">
                    A deliberate record of your professional journey: what you worked on, what went wrong, what you learned, and how you are evolving.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleStartNewDailyLog()}
                >
                  <span>Log Today's Work</span>
                </button>
              </div>
            </div>

            {/* Overall Statistics Summary Cards */}
            <MetricCards stats={overallStats} />

            {/* Daily Logging Consistency Heatmap */}
            <HeatmapCalendar
              dailyLogs={dailyLogs}
              onSelectDate={(date) => handleStartNewDailyLog(date)}
            />

            {/* Growth Trajectory Line Chart */}
            <TrendsChart dailyLogs={dailyLogs} />

            {/* Monthly Comparative Bar Chart */}
            <MonthlyBarChart dailyLogs={dailyLogs} />

            {/* Dedicated Failure & Learning Analytics */}
            <FailureExplorer
              dailyLogs={dailyLogs}
              onOpenLog={(logId) => handleOpenDailyLogById(logId)}
            />

            {/* Recent Activity Previews */}
            <RecentLogs
              dailyLogs={dailyLogs}
              weeklyReflections={weeklyReflections}
              monthlyReflections={monthlyReflections}
              onSelectDaily={(id) => handleOpenDailyLogById(id)}
              onSelectWeekly={(id) => {
                const w = weeklyReflections.find((item) => item.id === id);
                if (w) {
                  setViewingWeekly(w);
                  setActivePage('weekly');
                }
              }}
              onSelectMonthly={(id) => {
                const m = monthlyReflections.find((item) => item.id === id);
                if (m) {
                  setViewingMonthly(m);
                  setActivePage('monthly');
                }
              }}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {/* ================= DAILY LOGS PAGE ================= */}
        {activePage === 'daily' && (
          <div>
            {editingDailyLog ? (
              <DailyLogForm
                initialLog={editingDailyLog.log}
                initialDate={editingDailyLog.date}
                onSave={handleSaveDailyLog}
                onCancel={() => setEditingDailyLog(null)}
                onSwitchToEdit={(existing) => {
                  setEditingDailyLog({ log: existing, date: existing.date });
                }}
              />
            ) : viewingDailyLog ? (
              <DailyLogView
                log={viewingDailyLog}
                onEdit={(log) => setEditingDailyLog({ log, date: log.date })}
                onDelete={handleDeleteDailyLog}
                onBack={() => setViewingDailyLog(null)}
              />
            ) : (
              <DailyLogList
                logs={dailyLogs}
                onSelectLog={(log) => setViewingDailyLog(log)}
                onNewLogForDate={(date) => handleStartNewDailyLog(date)}
              />
            )}
          </div>
        )}

        {/* ================= WEEKLY REFLECTIONS PAGE ================= */}
        {activePage === 'weekly' && (
          <div>
            {editingWeekly !== null && editingWeekly !== undefined ? (
              <WeeklyReflectionForm
                dailyLogs={dailyLogs}
                initialReflection={editingWeekly}
                onSave={handleSaveWeeklyReflection}
                onCancel={() => setEditingWeekly(null)}
              />
            ) : viewingWeekly ? (
              <WeeklyReflectionView
                reflection={viewingWeekly}
                onEdit={(ref) => setEditingWeekly(ref)}
                onDelete={handleDeleteWeeklyReflection}
                onBack={() => setViewingWeekly(null)}
              />
            ) : (
              <WeeklyList
                reflections={weeklyReflections}
                onSelectReflection={(ref) => setViewingWeekly(ref)}
                onNewReflection={() => setEditingWeekly({} as WeeklyReflection)}
              />
            )}
          </div>
        )}

        {/* ================= MONTHLY REFLECTIONS PAGE ================= */}
        {activePage === 'monthly' && (
          <div>
            {editingMonthly !== null && editingMonthly !== undefined ? (
              <MonthlyReflectionForm
                dailyLogs={dailyLogs}
                weeklyReflections={weeklyReflections}
                existingMonthlyReflections={monthlyReflections}
                initialReflection={editingMonthly}
                onSave={handleSaveMonthlyReflection}
                onCancel={() => setEditingMonthly(null)}
              />
            ) : viewingMonthly ? (
              <MonthlyReflectionView
                reflection={viewingMonthly}
                onEdit={(ref) => setEditingMonthly(ref)}
                onDelete={handleDeleteMonthlyReflection}
                onBack={() => setViewingMonthly(null)}
              />
            ) : (
              <MonthlyList
                reflections={monthlyReflections}
                onSelectReflection={(ref) => setViewingMonthly(ref)}
                onNewReflection={() => setEditingMonthly({} as MonthlyReflection)}
              />
            )}
          </div>
        )}

        {/* ================= HISTORY & SEARCH PAGE ================= */}
        {activePage === 'search' && (
          <SearchHistory
            dailyLogs={dailyLogs}
            weeklyReflections={weeklyReflections}
            monthlyReflections={monthlyReflections}
            onOpenDaily={(log) => {
              setViewingDailyLog(log);
              setActivePage('daily');
            }}
            onOpenWeekly={(reflection) => {
              setViewingWeekly(reflection);
              setActivePage('weekly');
            }}
            onOpenMonthly={(reflection) => {
              setViewingMonthly(reflection);
              setActivePage('monthly');
            }}
          />
        )}
      </main>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
