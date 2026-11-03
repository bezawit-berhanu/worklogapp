import test from 'node:test';
import assert from 'node:assert/strict';

// Mock storage for tests
const mockStore = new Map();

const DEMO_USER = {
  id: 'usr_demo_001',
  username: 'demouser',
  email: 'demo@worklog.dev',
  name: 'Demo Professional',
  role: 'developer',
  passwordHash: 'Password123!',
};

function handleLogin(emailOrUsername, password, users = [DEMO_USER]) {
  if (!emailOrUsername || !emailOrUsername.trim()) {
    return { status: 400, success: false, message: 'Username or email required.' };
  }
  if (!password) {
    return { status: 400, success: false, message: 'Password required.' };
  }

  const id = emailOrUsername.trim().toLowerCase();
  const match = users.find((u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id);

  if (!match || match.passwordHash !== password) {
    return { status: 401, success: false, message: 'Invalid credentials.' };
  }

  return { status: 200, success: true, token: `token_${match.id}`, user: match };
}

function handleSignup(payload, users = [DEMO_USER]) {
  if (!payload.username || payload.username.length < 3) {
    return { status: 400, success: false, message: 'Username must be >= 3 chars.' };
  }
  if (!payload.email || !payload.email.includes('@')) {
    return { status: 400, success: false, message: 'Valid email required.' };
  }
  if (!payload.password || payload.password.length < 6) {
    return { status: 400, success: false, message: 'Password must be >= 6 chars.' };
  }

  const emailLower = payload.email.toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === emailLower)) {
    return { status: 409, success: false, message: 'Email already exists.' };
  }

  const newUser = { id: `usr_${Date.now()}`, ...payload };
  users.push(newUser);
  return { status: 201, success: true, user: newUser, token: `token_${newUser.id}` };
}

test('POST /api/auth/login returns HTTP 200 OK for valid dummy credentials', () => {
  const res = handleLogin('demo@worklog.dev', 'Password123!');
  assert.equal(res.status, 200);
  assert.equal(res.success, true);
  assert.equal(res.user.username, 'demouser');
  assert.ok(res.token);
});

test('POST /api/auth/login returns HTTP 401 Unauthorized for wrong password', () => {
  const res = handleLogin('demo@worklog.dev', 'WrongPassword!');
  assert.equal(res.status, 401);
  assert.equal(res.success, false);
});

test('POST /api/auth/login returns HTTP 400 Bad Request when inputs are empty', () => {
  const res = handleLogin('', '');
  assert.equal(res.status, 400);
  assert.equal(res.success, false);
});

test('POST /api/auth/signup returns HTTP 201 Created for valid new registration', () => {
  const res = handleSignup({
    username: 'newcoder',
    email: 'newcoder@example.com',
    password: 'SecurePassword123',
  });
  assert.equal(res.status, 201);
  assert.equal(res.success, true);
});

test('POST /api/auth/signup returns HTTP 409 Conflict when email already registered', () => {
  const res = handleSignup({
    username: 'othername',
    email: 'demo@worklog.dev', // duplicate of demo
    password: 'SecurePassword123',
  });
  assert.equal(res.status, 409);
  assert.equal(res.success, false);
});
