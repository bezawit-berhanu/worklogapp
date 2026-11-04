/**
 * responsive.test.js
 *
 * Verifies responsive breakpoint rules, mobile navigation, flexible grid layouts,
 * and touch-target sizing across CSS files.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Responsive Design and Breakpoint Layouts', () => {
  const indexCss = fs.readFileSync(path.join(rootDir, 'src', 'index.css'), 'utf-8');
  const appCss = fs.readFileSync(path.join(rootDir, 'src', 'App.css'), 'utf-8');

  it('defines 768px and 480px responsive breakpoints in index.css', () => {
    assert.ok(indexCss.includes('@media (max-width: 768px)'), 'Should contain 768px media query');
    assert.ok(indexCss.includes('@media (max-width: 480px)'), 'Should contain 480px media query');
  });

  it('stacks navbar elements on mobile viewports', () => {
    const mobileBlock = indexCss.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\}\s*@media/);
    assert.ok(mobileBlock, 'Mobile block should exist');
    const content = mobileBlock[1];
    assert.ok(content.includes('.navbar-inner'), 'navbar-inner should be styled in mobile block');
    assert.ok(content.includes('flex-direction: column'), 'navbar-inner should use column direction');
  });

  it('adapts stats grid columns on tablet and mobile viewports', () => {
    assert.ok(indexCss.includes('.stats-grid'), 'stats-grid should be defined');
    const matches768 = indexCss.match(/@media \(max-width: 768px\)[\s\S]*?\.stats-grid\s*\{([^}]*)\}/);
    assert.ok(matches768, 'stats-grid should have 768px rules');
    assert.ok(matches768[1].includes('grid-template-columns: repeat(2, 1fr)'), 'Should switch to 2 columns on tablet');

    const matches480 = indexCss.match(/@media \(max-width: 480px\)[\s\S]*?\.stats-grid\s*\{([^}]*)\}/);
    assert.ok(matches480, 'stats-grid should have 480px rules');
    assert.ok(matches480[1].includes('grid-template-columns: 1fr'), 'Should switch to 1 column on mobile');
  });

  it('enables horizontal scroll container for weekly bar graph on mobile in App.css', () => {
    assert.ok(appCss.includes('@media (max-width: 768px)'), 'App.css should have 768px media query');
    assert.ok(appCss.includes('overflow-x: auto'), 'bars-chart-container should be horizontally scrollable');
    assert.ok(appCss.includes('.growth-advisor-grid'), 'growth-advisor-grid should adapt to 1 column on mobile');
  });

  it('provides accessible touch-target heights for mobile buttons', () => {
    assert.ok(indexCss.includes('min-height: 44px'), 'Buttons should specify 44px minimum height for mobile');
  });
});
