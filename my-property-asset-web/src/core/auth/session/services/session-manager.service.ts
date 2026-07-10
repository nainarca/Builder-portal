import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationEventBusService } from '@infrastructure/events';
import { SessionMonitorService } from '@infrastructure/session';
import { APP_ROUTES } from '@core/constants/app.constants';
import { AUTH_EVENT_TYPES } from '../../constants/auth.constants';
import { AuthContextService } from '../../services/auth-context.service';
import { AuthRedirectService } from '../../services/auth-session.service';
import { SupabaseAuthService } from '../../services/supabase-auth.service';
import { SESSION_CONFIG } from '../config/session.config';
import { SessionExpiryReason, SessionSyncMessage } from '../models/session-lifecycle.model';
import { IdleSessionService } from './idle-session.service';
import { SessionRecoveryService } from './session-recovery.service';
import { SessionSyncService } from './session-sync.service';
import { TokenLifecycleService } from './token-lifecycle.service';
import { getSessionRemainingMs } from '../../utils/auth.utils';

@Injectable({ providedIn: 'root' })
export class SessionManagerService {
  private readonly authContext = inject(AuthContextService);
  private readonly supabaseAuth = inject(SupabaseAuthService);
  private readonly sessionMonitor = inject(SessionMonitorService);
  private readonly idleSession = inject(IdleSessionService);
  private readonly tokenLifecycle = inject(TokenLifecycleService);
  private readonly sessionSync = inject(SessionSyncService);
  private readonly recovery = inject(SessionRecoveryService);
  private readonly authRedirect = inject(AuthRedirectService);
  private readonly eventBus = inject(ApplicationEventBusService);
  private readonly router = inject(Router);

  private initialized = false;
  private expiryHandled = false;
  private signingOut = false;

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.recovery.initialize();
    this.sessionSync.initialize((message) => this.handleSyncMessage(message));
    this.bindAuthEvents();
    this.syncLifecycle();
  }

  syncLifecycle(): void {
    if (!this.authContext.isAuthenticated()) {
      this.cleanup();
      return;
    }

    const session = this.authContext.session();
    const remainingMs = getSessionRemainingMs(session);

    if (remainingMs > 0) {
      this.sessionMonitor.configure({
        warningLeadTimeMs: SESSION_CONFIG.warningLeadTimeMs,
        checkIntervalMs: SESSION_CONFIG.checkIntervalMs,
        warningCheckIntervalMs: SESSION_CONFIG.warningCheckIntervalMs,
      });
      this.sessionMonitor.refreshSession(remainingMs);
    } else {
      this.sessionMonitor.endSession();
    }

    this.idleSession.start(() => this.handleSessionExpired('idle'));
    this.monitorTokenExpiry();
  }

  async refreshSession(): Promise<boolean> {
    const result = await this.tokenLifecycle.refreshWithRetry();
    if (!result.success) {
      await this.handleRefreshFailure();
      return false;
    }

    this.syncLifecycle();
    this.sessionSync.broadcast('SESSION_REFRESHED');
    return true;
  }

  async handleSessionExpired(reason: SessionExpiryReason): Promise<void> {
    if (this.expiryHandled || this.signingOut) {
      return;
    }

    this.expiryHandled = true;
    this.recovery.persistInterruptedRoute();

    const returnUrl = this.router.url.startsWith(`/${APP_ROUTES.authentication}`)
      ? undefined
      : this.router.url;

    this.eventBus.publish({
      type:
        reason === 'idle'
          ? AUTH_EVENT_TYPES.sessionIdleExpired
          : AUTH_EVENT_TYPES.sessionExpired,
      payload: { reason },
      timestamp: Date.now(),
    });

    this.sessionSync.broadcast('SESSION_EXPIRED', { reason });
    this.cleanup();
    await this.supabaseAuth.signOut();
    await this.authRedirect.navigateToSessionExpired(returnUrl, reason);
  }

  async signOut(options?: { syncTabs?: boolean }): Promise<void> {
    if (this.signingOut) {
      return;
    }

    this.signingOut = true;

    try {
      this.cleanup();
      await this.supabaseAuth.signOut();

      if (options?.syncTabs !== false) {
        this.sessionSync.broadcast('LOGOUT');
      }

      await this.authRedirect.navigateToLogin();
    } finally {
      this.signingOut = false;
      this.expiryHandled = false;
    }
  }

  cleanup(): void {
    this.idleSession.stop();
    this.sessionMonitor.endSession();
  }

  dismissWarning(): void {
    const idleWarning = this.idleSession.idleState().warningVisible;
    if (idleWarning) {
      this.idleSession.dismissWarning();
      return;
    }

    this.sessionMonitor.dismissWarning();
  }

  private bindAuthEvents(): void {
    this.eventBus.on(AUTH_EVENT_TYPES.signedIn, () => {
      this.expiryHandled = false;
      this.syncLifecycle();
    });

    this.eventBus.on(AUTH_EVENT_TYPES.signedOut, () => {
      this.cleanup();
      this.expiryHandled = false;
    });

    this.eventBus.on(AUTH_EVENT_TYPES.sessionRefreshed, () => {
      this.syncLifecycle();
    });

    this.eventBus.on(AUTH_EVENT_TYPES.sessionExpired, async () => {
      if (!this.expiryHandled) {
        await this.handleSessionExpired('token');
      }
    });

    this.eventBus.on(AUTH_EVENT_TYPES.sessionIdleExpired, async () => {
      if (!this.expiryHandled) {
        await this.handleSessionExpired('idle');
      }
    });
  }

  private monitorTokenExpiry(): void {
    const check = () => {
      const state = this.sessionMonitor.sessionState();
      if (state.expired && !this.expiryHandled) {
        void this.handleSessionExpired('token');
      }
    };

    check();
    setInterval(check, SESSION_CONFIG.warningCheckIntervalMs);
  }

  private async handleRefreshFailure(): Promise<void> {
    await this.handleSessionExpired('token');
  }

  private handleSyncMessage(message: SessionSyncMessage): void {
    switch (message.type) {
      case 'LOGOUT':
        void this.signOut({ syncTabs: false });
        break;
      case 'SESSION_REFRESHED':
        void this.supabaseAuth.restoreSession().then(() => this.syncLifecycle());
        break;
      case 'SESSION_EXPIRED':
        if (!this.expiryHandled) {
          const reason =
            message.payload && typeof message.payload === 'object' && 'reason' in message.payload
              ? (message.payload.reason as SessionExpiryReason)
              : 'token';
          void this.handleSessionExpired(reason);
        }
        break;
      default:
        break;
    }
  }
}
