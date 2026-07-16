export const AUTH_ROUTE_SEGMENTS = {
  login: 'login',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  accessDenied: 'access-denied',
  portalUnavailable: 'portal-unavailable',
  builderInvitation: 'builder-invitation',
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

/** Fallback only when role-aware routing cannot run (e.g. sanitize without context). */
export const AUTH_DEFAULT_REDIRECT = '/super-admin';

/** Friendly page for authenticated users without Web portal grant (e.g. Schema V2 owner). */
export const AUTH_PORTAL_UNAVAILABLE_REDIRECT = '/auth/portal-unavailable';

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

export const AUTH_PORTAL_UNAVAILABLE_MESSAGE =
  'This portal is available only for Builder organizations and Platform Administrators.';
