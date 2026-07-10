import { Injectable, computed, inject } from '@angular/core';

import { OnlineStatusMonitorService } from '@infrastructure/network';
import { SessionMonitorService } from '@infrastructure/session';
import { AuthContextService } from '../../services/auth-context.service';
import {
  SessionExpiryReason,
  SessionLifecycleState,
  SessionLifecycleStatus,
} from '../models/session-lifecycle.model';
import { IdleSessionService } from './idle-session.service';
import { SessionRecoveryService } from './session-recovery.service';
import { TokenLifecycleService } from './token-lifecycle.service';

@Injectable({ providedIn: 'root' })
export class SessionStateService {
  private readonly authContext = inject(AuthContextService);
  private readonly sessionMonitor = inject(SessionMonitorService);
  private readonly idleSession = inject(IdleSessionService);
  private readonly tokenLifecycle = inject(TokenLifecycleService);
  private readonly recovery = inject(SessionRecoveryService);
  private readonly onlineStatus = inject(OnlineStatusMonitorService);

  readonly lifecycleState = computed<SessionLifecycleState>(() => {
    const tokenState = this.sessionMonitor.sessionState();
    const idleState = this.idleSession.idleState();
    const isAuthenticated = this.authContext.isAuthenticated();
    const isRefreshing = this.tokenLifecycle.isRefreshing();
    const isRecovering = this.recovery.isRecovering();

    let status: SessionLifecycleStatus = 'inactive';
    let expiryReason: SessionExpiryReason | null = null;
    let warningVisible = false;
    let remainingMs = 0;
    let message = 'Your session is active.';

    if (!isAuthenticated) {
      return {
        status: 'inactive',
        expiryReason: null,
        warningVisible: false,
        remainingMs: 0,
        isRefreshing,
        isRecovering,
        isOnline: this.onlineStatus.isOnline(),
        message: 'Sign in to start a secure session.',
      };
    }

    if (isRecovering) {
      status = 'recovering';
      message = 'Reconnecting your secure session…';
    } else if (isRefreshing) {
      status = 'refreshing';
      message = 'Refreshing your secure session…';
    } else if (tokenState.expired) {
      status = 'expired';
      expiryReason = 'token';
      message = tokenState.message;
    } else if (idleState.warningVisible) {
      status = 'expiring';
      expiryReason = 'idle';
      warningVisible = true;
      remainingMs = idleState.remainingMs;
      message = idleState.message;
    } else if (tokenState.warningVisible) {
      status = 'expiring';
      expiryReason = 'token';
      warningVisible = true;
      remainingMs = tokenState.remainingMs;
      message = tokenState.message;
    } else {
      status = 'active';
    }

    return {
      status,
      expiryReason,
      warningVisible,
      remainingMs,
      isRefreshing,
      isRecovering,
      isOnline: this.onlineStatus.isOnline(),
      message,
    };
  });

  readonly showExpiringDialog = computed(() => this.lifecycleState().warningVisible);
  readonly showRefreshIndicator = computed(() => {
    const state = this.lifecycleState();
    return state.isRefreshing || state.isRecovering;
  });
}
