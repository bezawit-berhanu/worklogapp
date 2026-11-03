import test from 'node:test';
import assert from 'node:assert/strict';

function createAuthState() {
  let state = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  const login = (user, token) => {
    state = { user, token, isAuthenticated: true };
    return state;
  };

  const logout = () => {
    state = { user: null, token: null, isAuthenticated: false };
    return state;
  };

  const getDemo = () => ({
    emailOrUsername: 'demo@worklog.dev',
    password: 'Password123!',
  });

  return { getState: () => state, login, logout, getDemo };
}

test('createAuthState transitions to authenticated on login', () => {
  const auth = createAuthState();
  assert.equal(auth.getState().isAuthenticated, false);

  auth.login({ id: '1', username: 'demouser' }, 'mock_token_123');
  assert.equal(auth.getState().isAuthenticated, true);
  assert.equal(auth.getState().user.username, 'demouser');
  assert.equal(auth.getState().token, 'mock_token_123');
});

test('createAuthState clears credentials on logout', () => {
  const auth = createAuthState();
  auth.login({ id: '1', username: 'demouser' }, 'mock_token_123');
  assert.equal(auth.getState().isAuthenticated, true);

  auth.logout();
  assert.equal(auth.getState().isAuthenticated, false);
  assert.equal(auth.getState().user, null);
  assert.equal(auth.getState().token, null);
});

test('createAuthState provides valid dummy credentials', () => {
  const auth = createAuthState();
  const demo = auth.getDemo();
  assert.equal(demo.emailOrUsername, 'demo@worklog.dev');
  assert.equal(demo.password, 'Password123!');
});
