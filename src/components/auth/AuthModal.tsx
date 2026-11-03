import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User as UserIcon, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}) => {
  const { login, signup, fillDemoCredentials } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleUseDemo = () => {
    const demo = fillDemoCredentials();
    setEmailOrUsername(demo.emailOrUsername);
    setPassword(demo.password);
    setErrorMessage(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      if (mode === 'login') {
        const res = await login({ emailOrUsername, password });
        if (res.success) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 800);
        } else {
          setErrorMessage(res.message);
          if (res.errors) setFieldErrors(res.errors);
        }
      } else {
        const res = await signup({ username, email, password, name });
        if (res.success) {
          setSuccessMessage(res.message);
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 800);
        } else {
          setErrorMessage(res.message);
          if (res.errors) setFieldErrors(res.errors);
        }
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-header-title">
            <div className="auth-icon-circle">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="modal-title">{mode === 'login' ? 'Sign In to WorkLog' : 'Create an Account'}</h3>
              <p className="modal-description" style={{ margin: 0 }}>
                {mode === 'login'
                  ? 'Access your personal daily logs, reflections, and growth analytics'
                  : 'Start tracking your professional and academic growth today'}
              </p>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Demo filler badge */}
        {mode === 'login' && (
          <div className="demo-credentials-banner">
            <div className="demo-text">
              <Sparkles size={14} className="text-amber" />
              <span>Demo Account: <strong>demo@worklog.dev</strong> / <strong>Password123!</strong></span>
            </div>
            <button type="button" className="btn btn-outline btn-xs" onClick={handleUseDemo}>
              Auto-Fill Demo
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="auth-alert alert-error">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert alert-success">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">Full Name</label>
                <div className="input-with-icon">
                  <UserIcon size={16} className="input-icon" />
                  <input
                    id="auth-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g., Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-username">Username *</label>
                <div className="input-with-icon">
                  <UserIcon size={16} className="input-icon" />
                  <input
                    id="auth-username"
                    type="text"
                    required
                    className={`form-input ${fieldErrors.username ? 'input-error' : ''}`}
                    placeholder="e.g., alex_dev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                {fieldErrors.username && <span className="field-error-text">{fieldErrors.username}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="auth-email">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
              </div>
            </>
          )}

          {mode === 'login' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-identifier">Email or Username *</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="auth-identifier"
                  type="text"
                  required
                  className={`form-input ${fieldErrors.emailOrUsername ? 'input-error' : ''}`}
                  placeholder="demo@worklog.dev or demouser"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                />
              </div>
              {fieldErrors.emailOrUsername && (
                <span className="field-error-text">{fieldErrors.emailOrUsername}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password *</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                id="auth-password"
                type="password"
                required
                className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {fieldErrors.password && <span className="field-error-text">{fieldErrors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
            style={{ marginTop: '0.5rem' }}
          >
            {isSubmitting
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Sign In'
              : 'Create My Account'}
          </button>
        </form>

        <div className="auth-modal-footer">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setFieldErrors({});
                }}
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setFieldErrors({});
                }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
