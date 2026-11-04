import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { BookOpen, LogIn, UserPlus, KeyRound, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';
import { DEMO_USER } from '../services/api/authService';

export const AuthPage: React.FC = () => {
  const { login, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Hardcoded default credentials ready to sign in immediately
  const [emailOrUsername, setEmailOrUsername] = useState(DEMO_USER.email);
  const [password, setPassword] = useState(DEMO_USER.passwordHash);

  // Signup fields
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const res = await login({ emailOrUsername, password });
      if (!res.success) {
        setError(res.error || 'Invalid credentials. Please verify your email/username and password.');
      }
    } catch {
      setError('An unexpected error occurred during sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const res = await signup({
        name,
        email: signupEmail,
        username: signupUsername,
        password: signupPassword,
      });

      if (!res.success) {
        setError(res.error || 'Failed to register account.');
      } else {
        setSuccessMessage('Account created successfully! Loading your dashboard...');
      }
    } catch {
      setError('An unexpected error occurred during registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseDemoAccount = () => {
    setEmailOrUsername(DEMO_USER.email);
    setPassword(DEMO_USER.passwordHash);
    setError(null);
  };

  const handleInstantDemoLogin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await login({
        emailOrUsername: DEMO_USER.email,
        password: DEMO_USER.passwordHash,
      });
      if (!res.success) {
        setError(res.error || 'Failed to sign in with demo credentials.');
      }
    } catch {
      setError('An error occurred during instant demo sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <header className="auth-page-header">
        <div className="auth-page-header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="brand-title">WorkLog</span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="auth-page-main">
        <div className="auth-card">
          <div className="auth-card-top">
            <h1 className="auth-card-title">
              {mode === 'signin' ? 'Sign In to WorkLog' : 'Create an Account'}
            </h1>
            <p className="auth-card-sub">
              {mode === 'signin'
                ? 'Document daily work, reflect on weekly progress, and track growth.'
                : 'Start tracking your professional and academic journey.'}
            </p>
          </div>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              role="tab"
              aria-selected={mode === 'signin'}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              role="tab"
              aria-selected={mode === 'signup'}
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </button>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert auth-alert-success" role="alert">
              <CheckCircle size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">
                  Email or Username
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="auth-email"
                    type="text"
                    className="form-input auth-input"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="demo@worklog.dev"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-password">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <KeyRound size={16} className="auth-input-icon" />
                  <input
                    id="auth-password"
                    type="password"
                    className="form-input auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="demo-credentials-banner" style={{ margin: '1.25rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Hardcoded Demo Access:</div>
                    <div className="demo-text" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                      <strong>{DEMO_USER.email}</strong> &bull; <code>Password123!</code>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleUseDemoAccount}
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleInstantDemoLogin}
                      disabled={submitting}
                    >
                      1-Click Login
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={submitting || isLoading}
              >
                <LogIn size={16} />
                <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              </button>

              <div className="auth-switch-prompt">
                <span>New to WorkLog?</span>{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                >
                  Create an account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="signup-name"
                    type="text"
                    className="form-input auth-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">
                  Email Address
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="signup-email"
                    type="email"
                    className="form-input auth-input"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-username">
                  Username
                </label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-input-icon" />
                  <input
                    id="signup-username"
                    type="text"
                    className="form-input auth-input"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    placeholder="username"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <KeyRound size={16} className="auth-input-icon" />
                  <input
                    id="signup-password"
                    type="password"
                    className="form-input auth-input"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={submitting || isLoading}
              >
                <UserPlus size={16} />
                <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
              </button>

              <div className="auth-switch-prompt">
                <span>Already registered?</span>{' '}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="auth-page-footer">
        <p>&copy; {new Date().getFullYear()} WorkLog &bull; Professional Growth Tracker</p>
      </footer>
    </div>
  );
};
