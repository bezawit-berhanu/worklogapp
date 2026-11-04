import test from 'node:test';
import assert from 'node:assert/strict';

const DEMO_USER = {
  id: 'usr_demo_001',
  username: 'demouser',
  email: 'demo@worklog.dev',
  passwordHash: 'Password123!',
  name: 'Demo Engineer',
  role: 'developer',
};

function resolveAppRoute(isAuthenticated, isLoading) {
  if (isLoading) return 'loading';
  if (!isAuthenticated) return 'auth_page';
  return 'dashboard';
}

function simulateAuthSubmission({ mode, emailOrUsername, password, registeredUsers }) {
  if (mode === 'signin') {
    const user = registeredUsers.find(
      (u) =>
        (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
          u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
        u.passwordHash === password
    );

    if (user) {
      return {
        status: 200,
        success: true,
        message: 'Signed in successfully.',
        token: `mock_jwt_${Date.now()}`,
        user: { id: user.id, username: user.username, email: user.email },
      };
    }
    return {
      status: 401,
      success: false,
      message: 'Invalid email or password.',
    };
  }

  return { status: 400, success: false, message: 'Invalid mode.' };
}

test('Auth Gating - routes to auth_page when user is unauthenticated', () => {
  const route = resolveAppRoute(false, false);
  assert.equal(route, 'auth_page');
});

test('Auth Gating - routes to dashboard when user is authenticated', () => {
  const route = resolveAppRoute(true, false);
  assert.equal(route, 'dashboard');
});

test('Auth Gating - holds on loading screen while session is being verified', () => {
  const route = resolveAppRoute(false, true);
  assert.equal(route, 'loading');
});

test('Auth Submission - hardcoded demo credentials log in successfully', () => {
  const res = simulateAuthSubmission({
    mode: 'signin',
    emailOrUsername: 'demo@worklog.dev',
    password: 'Password123!',
    registeredUsers: [DEMO_USER],
  });

  assert.equal(res.status, 200);
  assert.equal(res.success, true);
  assert.ok(res.token);
  assert.equal(res.user.email, 'demo@worklog.dev');
});

test('Auth Submission - username lookup also succeeds with hardcoded credentials', () => {
  const res = simulateAuthSubmission({
    mode: 'signin',
    emailOrUsername: 'demouser',
    password: 'Password123!',
    registeredUsers: [DEMO_USER],
  });

  assert.equal(res.status, 200);
  assert.equal(res.success, true);
  assert.equal(res.user.username, 'demouser');
});

test('Auth Submission - invalid password returns 401 and keeps user on auth page', () => {
  const res = simulateAuthSubmission({
    mode: 'signin',
    emailOrUsername: 'demo@worklog.dev',
    password: 'WrongPassword999',
    registeredUsers: [DEMO_USER],
  });

  assert.equal(res.status, 401);
  assert.equal(res.success, false);
  assert.match(res.message, /Invalid email or password/);
});
