/**
 * Form and Input Validation Utilities
 * Enforces sanitization and standard validation rules.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const trimmed = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., user@domain.com).' };
  }
  return { isValid: true };
}

export function validateUsername(username: string): ValidationResult {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username is required.' };
  }
  const trimmed = username.trim();
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long.' };
  }
  if (trimmed.length > 25) {
    return { isValid: false, error: 'Username cannot exceed 25 characters.' };
  }
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmed)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores.' };
  }
  return { isValid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  if (password.length > 72) {
    return { isValid: false, error: 'Password cannot exceed 72 characters.' };
  }
  return { isValid: true };
}
