export type SessionLifecycleStatus =
  | 'inactive'
  | 'active'
  | 'refreshing'
  | 'expiring'
  | 'recovering'
  | 'expired';

export type SessionExpiryReason = 'token' | 'idle';

export type SessionSyncMessageType =
  | 'LOGOUT'
  | 'SESSION_REFRESHED'
  | 'SESSION_EXPIRED'
  | 'ACTIVITY';

export interface SessionSyncMessage<TPayload = unknown> {
  type: SessionSyncMessageType;
  tabId: string;
  timestamp: number;
  payload?: TPayload;
}

export interface SessionLifecycleState {
  status: SessionLifecycleStatus;
  expiryReason: SessionExpiryReason | null;
  warningVisible: boolean;
  remainingMs: number;
  isRefreshing: boolean;
  isRecovering: boolean;
  isOnline: boolean;
  message: string;
}

export interface TokenRefreshResult {
  success: boolean;
  attempts: number;
}
