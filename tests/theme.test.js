import test from 'node:test';
import assert from 'node:assert/strict';

const THEME_STORAGE_KEY = 'worklog_theme_preference_v1';

class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] ?? null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  clear() {
    this.store = {};
  }
}

function resolveInitialTheme(storage, systemPrefersDark = false) {
  try {
    const stored = storage.getItem(THEME_STORAGE_KEY);
    if (stored === 'day' || stored === 'night') return stored;
    if (systemPrefersDark) return 'night';
  } catch {}
  return 'day';
}

function toggleTheme(current) {
  return current === 'day' ? 'night' : 'day';
}

test('Theme System - defaults to day when no preference is saved', () => {
  const storage = new MockLocalStorage();
  const theme = resolveInitialTheme(storage, false);
  assert.equal(theme, 'day');
});

test('Theme System - honors system dark mode if no preference saved', () => {
  const storage = new MockLocalStorage();
  const theme = resolveInitialTheme(storage, true);
  assert.equal(theme, 'night');
});

test('Theme System - persisted preference overrides system dark mode', () => {
  const storage = new MockLocalStorage();
  storage.setItem(THEME_STORAGE_KEY, 'day');
  const theme = resolveInitialTheme(storage, true);
  assert.equal(theme, 'day');
});

test('Theme System - toggles seamlessly between day and night', () => {
  let theme = 'day';
  theme = toggleTheme(theme);
  assert.equal(theme, 'night');
  theme = toggleTheme(theme);
  assert.equal(theme, 'day');
});

test('Theme System - invalid stored value safely defaults to day', () => {
  const storage = new MockLocalStorage();
  storage.setItem(THEME_STORAGE_KEY, 'invalid_theme');
  const theme = resolveInitialTheme(storage, false);
  assert.equal(theme, 'day');
});
