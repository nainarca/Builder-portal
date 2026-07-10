export const SESSION_CONFIG = {
  warningLeadTimeMs: 5 * 60 * 1000,
  checkIntervalMs: 30 * 1000,
  warningCheckIntervalMs: 1000,
  idleTimeoutMs: 30 * 60 * 1000,
  idleWarningLeadTimeMs: 2 * 60 * 1000,
  idleActivityThrottleMs: 1000,
  tokenRefreshMaxRetries: 3,
  tokenRefreshRetryDelayMs: 1000,
  tokenRefreshRetryBackoff: 2,
  syncChannelName: 'mpa-auth-session',
  reconnectRecoveryDelayMs: 750,
  sessionStorageKeys: {
    pendingReturnUrl: 'mpa-auth-pending-return-url',
    lastActivityAt: 'mpa-auth-last-activity-at',
  },
} as const;
