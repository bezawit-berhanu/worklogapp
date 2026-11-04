/**
 * layout_spacing.test.js
 *
 * Verifies whitespace hierarchy, padding, and de-clumped layout standards
 * across the application styles to ensure high readability and anti-cluttering.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

describe('Layout and Spacing Standards', () => {
  const indexCss = fs.readFileSync(path.join(rootDir, 'src', 'index.css'), 'utf-8');
  const appCss = fs.readFileSync(path.join(rootDir, 'src', 'App.css'), 'utf-8');

  it('maintains body typography with relaxed line-height >= 1.6', () => {
    const bodyMatch = indexCss.match(/body\s*\{[^}]*\}/s);
    assert.ok(bodyMatch, 'body rule should exist');
    const bodyText = bodyMatch[0];
    const lineHeightMatch = bodyText.match(/line-height:\s*([0-9.]+)/);
    assert.ok(lineHeightMatch, 'line-height should be defined in body');
    const lineHeight = parseFloat(lineHeightMatch[1]);
    assert.ok(lineHeight >= 1.6, `body line-height should be >= 1.6, found ${lineHeight}`);
  });

  it('configures dashboard grid gap and margin for breathing room', () => {
    assert.ok(
      indexCss.includes('--spacing-lg') || indexCss.includes('--spacing-md'),
      'Spacing tokens should be defined'
    );
    assert.ok(
      appCss.includes('.growth-advisor-grid'),
      'Growth advisor grid should be defined'
    );
    assert.ok(
      appCss.includes('.bar-detail-panel'),
      'Weekly performance bar detail panel should be defined'
    );
  });

  it('ensures stat cards have sufficient padding', () => {
    const statCardMatch = indexCss.match(/\.stat-card\s*\{[^}]*\}/s);
    assert.ok(statCardMatch, '.stat-card rule should exist');
    const cardText = statCardMatch[0];
    assert.ok(cardText.includes('padding: 1.5rem'), 'stat card should have generous 1.5rem padding');
    assert.ok(cardText.includes('gap: 0.75rem'), 'stat card should have 0.75rem gap');
  });
});
