import type { User, AuthCredentials, SignupPayload, AuthResponse } from '../../types/auth';
import { validateEmail, validateUsername, validatePassword } from '../../utils/validation';

const USERS_STORAGE_KEY = 'worklog_auth_users_v1';
const SESSION_STORAGE_KEY = 'worklog_auth_session_token_v1';

// Default dummy account for immediate testing
export const DEMO_USER: User & { passwordHash: string } = {
  id: 'usr_demo_001',
  username: 'demouser',
  email: 'demo@worklog.dev',
  name: 'Demo Professional',
  role: 'developer',
  createdAt: '2026-10-01T08:00:00.000Z',
  passwordHash: 'Password123!',
};

class AuthService {
  private getUsers(): Array<User & { passwordHash: string }> {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      if (!data) {
        // Initialize with default dummy account
        const initial = [DEMO_USER];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return [DEMO_USER];
    }
  }

  private saveUsers(users: Array<User & { passwordHash: string }>): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users database:', e);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticates user credentials with standard HTTP Status Codes.
   * Returns 200 OK on success, 400 Bad Request on validation failure, 401 Unauthorized on invalid credentials.
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    const { emailOrUsername, password } = credentials;

    // HTTP 400: Input validation
    if (!emailOrUsername || !emailOrUsername.trim()) {
      return {
        status: 400,
        success: false,
        message: 'Username or email address is required.',
        errors: { emailOrUsername: 'This field cannot be empty.' },
      };
    }

    if (!password) {
      return {
        status: 400,
        success: false,
        message: 'Password is required.',
        errors: { password: 'Password cannot be empty.' },
      };
    }

    const identifier = emailOrUsername.trim().toLowerCase();
    const users = this.getUsers();

    const userMatch = users.find(
      (u) => u.email.toLowerCase() === identifier || u.username.toLowerCase() === identifier
    );

    // HTTP 401: Unauthorized
    if (!userMatch || userMatch.passwordHash !== password) {
      return {
        status: 401,
        success: false,
        message: 'Invalid credentials. Please verify your email/username and password.',
      };
    }

    // Generate session token
    const token = `jwt_mock_${userMatch.id}_${Date.now()}`;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, token);
    } catch {}

    const { passwordHash: _, ...safeUser } = userMatch;

    // HTTP 200: OK
    return {
      status: 200,
      success: true,
      message: 'Login successful. Welcome back!',
      token,
      user: safeUser,
    };
  }

  /**
   * POST /api/auth/signup
   * Registers a new user with input sanitization.
   * Returns 201 Created on success, 400 Bad Request on invalid inputs, 409 Conflict on existing account.
   */
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const errors: Record<string, string> = {};

    const usernameCheck = validateUsername(payload.username);
    if (!usernameCheck.isValid) errors.username = usernameCheck.error!;

    const emailCheck = validateEmail(payload.email);
    if (!emailCheck.isValid) errors.email = emailCheck.error!;

    const passwordCheck = validatePassword(payload.password);
    if (!passwordCheck.isValid) errors.password = passwordCheck.error!;

    // HTTP 400: Bad Request
    if (Object.keys(errors).length > 0) {
      return {
        status: 400,
        success: false,
        message: 'Please resolve the form validation errors.',
        errors,
      };
    }

    const users = this.getUsers();
    const emailLower = payload.email.trim().toLowerCase();
    const usernameLower = payload.username.trim().toLowerCase();

    // HTTP 409: Conflict (Duplicate email or username)
    const existingEmail = users.find((u) => u.email.toLowerCase() === emailLower);
    if (existingEmail) {
      return {
        status: 409,
        success: false,
        message: 'An account with this email address already exists.',
        errors: { email: 'Email address already in use.' },
      };
    }

    const existingUsername = users.find((u) => u.username.toLowerCase() === usernameLower);
    if (existingUsername) {
      return {
        status: 409,
        success: false,
        message: 'This username is already taken. Please choose another.',
        errors: { username: 'Username already taken.' },
      };
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: payload.username.trim(),
      email: payload.email.trim(),
      name: payload.name?.trim() || payload.username.trim(),
      role: payload.role || 'developer',
      createdAt: new Date().toISOString(),
      passwordHash: payload.password,
    };

    users.push(newUser);
    this.saveUsers(users);

    const token = `jwt_mock_${newUser.id}_${Date.now()}`;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, token);
    } catch {}

    const { passwordHash: _, ...safeUser } = newUser;

    // HTTP 201: Created
    return {
      status: 201,
      success: true,
      message: 'Account created successfully. Welcome to WorkLog!',
      token,
      user: safeUser,
    };
  }

  /**
   * GET /api/auth/me
   * Fetches profile for active session token.
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!token) {
        return { status: 401, success: false, message: 'No active session.' };
      }

      const users = this.getUsers();
      // Extract user id from token
      const parts = token.split('_');
      const userId = parts.slice(2, -1).join('_');

      const found = users.find((u) => u.id === userId);
      if (!found) {
        return { status: 401, success: false, message: 'Invalid or expired session token.' };
      }

      const { passwordHash: _, ...safeUser } = found;
      return { status: 200, success: true, message: 'Authenticated', token, user: safeUser };
    } catch {
      return { status: 500, success: false, message: 'Server error retrieving session.' };
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(): Promise<AuthResponse> {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return { status: 200, success: true, message: 'Logged out successfully.' };
    } catch {
      return { status: 500, success: false, message: 'Failed to clear session.' };
    }
  }
}

export const authService = new AuthService();
