export const AUTH_ROUTE_SEGMENTS = {
  login: 'login',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  accessDenied: 'access-denied',
  sessionExpired: 'session-expired',
  emailVerification: 'email-verification',
  accountLocked: 'account-locked',
  callback: 'callback',
} as const;

export const AUTH_QUERY_PARAMS = {
  returnUrl: 'returnUrl',
  email: 'email',
  error: 'error',
  errorDescription: 'error_description',
  deniedReason: 'deniedReason',
  intent: 'intent',
} as const;

export const AUTH_STORAGE_KEYS = {
  rememberedEmail: 'mpa-auth-remembered-email',
} as const;

export const AUTH_DEFAULT_REDIRECT = '/super-admin';

export const AUTH_EVENT_TYPES = {
  signedIn: 'auth.signedIn',
  signedOut: 'auth.signedOut',
  sessionRefreshed: 'auth.sessionRefreshed',
  sessionExpired: 'auth.sessionExpired',
  sessionIdleWarning: 'auth.sessionIdleWarning',
  sessionIdleExpired: 'auth.sessionIdleExpired',
  sessionRecovering: 'auth.sessionRecovering',
  sessionRecoveryComplete: 'auth.sessionRecoveryComplete',
  passwordResetRequested: 'auth.passwordResetRequested',
} as const;

export const AUTH_VALIDATION = {
  passwordMinLength: 8,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
