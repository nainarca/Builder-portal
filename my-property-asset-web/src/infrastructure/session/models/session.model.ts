export interface SessionMonitorConfig {
  warningLeadTimeMs: number;
  checkIntervalMs: number;
  warningCheckIntervalMs?: number;
}

export interface SessionExpiryState {
  warningVisible: boolean;
  expired: boolean;
  remainingMs: number;
  message: string;
  reason: 'token' | 'idle';
}
