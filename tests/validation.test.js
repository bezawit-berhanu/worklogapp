import test from 'node:test';
import assert from 'node:assert/strict';

function validateEmail(email) {
  if (!email || typeof email !== 'string') return { isValid: false, error: 'Email address is required.' };
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return { isValid: false, error: 'Invalid email' };
  return { isValid: true };
}

function validateUsername(username) {
  if (!username) return { isValid: false, error: 'Username is required.' };
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 25) return { isValid: false, error: 'Length 3-25' };
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return { isValid: false, error: 'Invalid characters' };
  return { isValid: true };
}

function validatePassword(password) {
  if (!password || password.length < 6) return { isValid: false, error: 'Min length 6' };
  return { isValid: true };
}

test('validateEmail accepts valid email formats and rejects invalid ones', () => {
  assert.equal(validateEmail('test@example.com').isValid, true);
  assert.equal(validateEmail('user.growth@worklog.dev').isValid, true);
  assert.equal(validateEmail('invalid-email').isValid, false);
  assert.equal(validateEmail('').isValid, false);
});

test('validateUsername enforces 3-25 alphanumeric characters', () => {
  assert.equal(validateUsername('bezawit').isValid, true);
  assert.equal(validateUsername('dev_user-99').isValid, true);
  assert.equal(validateUsername('ab').isValid, false); // too short
  assert.equal(validateUsername('user with spaces').isValid, false); // invalid chars
});

test('validatePassword requires at least 6 characters', () => {
  assert.equal(validatePassword('Pass123!').isValid, true);
  assert.equal(validatePassword('12345').isValid, false);
});
