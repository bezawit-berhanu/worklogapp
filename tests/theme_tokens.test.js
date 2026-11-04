import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function extractCssBlock(css, selector) {
  const normalized = css.replace(/\r\n/g, '\n');
  const index = normalized.indexOf(selector);
  if (index === -1) return '';
  const openBrace = normalized.indexOf('{', index);
  if (openBrace === -1) return '';
  let depth = 1;
  let cursor = openBrace + 1;
  while (cursor < normalized.length && depth > 0) {
    if (normalized[cursor] === '{') depth++;
    else if (normalized[cursor] === '}') depth--;
    cursor++;
  }
  return normalized.slice(openBrace + 1, cursor - 1);
}

function parseVariables(block) {
  const vars = {};
  const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = regex.exec(block)) !== null) {
    vars[match[1]] = match[2].trim();
  }
  return vars;
}

test('Theme Tokens - index.css defines complete matching variables for day and night', () => {
  const cssPath = path.resolve('src/index.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  const rootBlock = extractCssBlock(css, ':root {');
  const nightBlock = extractCssBlock(css, ':root[data-theme="night"]');

  assert.ok(rootBlock.length > 0, ':root block exists');
  assert.ok(nightBlock.length > 0, ':root[data-theme="night"] block exists');

  const dayVars = parseVariables(rootBlock);
  const nightVars = parseVariables(nightBlock);

  const requiredTokens = [
    '--bg-primary',
    '--bg-surface',
    '--bg-surface-elevated',
    '--bg-subtle',
    '--border-light',
    '--border-medium',
    '--border-focus',
    '--text-main',
    '--text-secondary',
    '--text-tertiary',
    '--navbar-bg',
    '--cat-work-color',
    '--cat-achieve-color',
    '--cat-failure-color',
    '--cat-lesson-color',
    '--cat-highlight-color',
  ];

  for (const token of requiredTokens) {
    assert.ok(dayVars[token], `Day token ${token} must be defined`);
    assert.ok(nightVars[token], `Night token ${token} must be defined`);
    assert.notEqual(dayVars[token], nightVars[token], `${token} must have distinct values between day and night`);
  }
});

test('Theme Tokens - night mode background and navbar are deep dark tones', () => {
  const cssPath = path.resolve('src/index.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const nightBlock = extractCssBlock(css, ':root[data-theme="night"]');
  const nightVars = parseVariables(nightBlock);

  assert.match(nightVars['--bg-primary'], /^#0[bB0-9]/, 'Night bg-primary is deep dark');
  assert.match(nightVars['--bg-surface'], /^#1[1-9a-fA-F0-9]/, 'Night bg-surface is elevated dark slate');
  assert.ok(nightVars['--navbar-bg'].includes('rgba'), 'Night navbar uses translucent dark glass effect');
});

test('Theme Tokens - category accents in night mode provide translucent backgrounds', () => {
  const cssPath = path.resolve('src/index.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const nightBlock = extractCssBlock(css, ':root[data-theme="night"]');
  const nightVars = parseVariables(nightBlock);

  const catAccents = ['--cat-work-bg', '--cat-achieve-bg', '--cat-failure-bg', '--cat-lesson-bg', '--cat-highlight-bg'];
  for (const cat of catAccents) {
    assert.ok(
      nightVars[cat].includes('rgba'),
      `Night category token ${cat} should use rgba translucency for high-contrast dark theme`
    );
  }
});
