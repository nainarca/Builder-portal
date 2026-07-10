import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';

import { APP_ROUTES } from '@core/constants/app.constants';
import { OnlineStatusMonitorService } from '@infrastructure/network';
import { ApplicationEventBusService } from '@infrastructure/events';
import { AUTH_EVENT_TYPES, AUTH_QUERY_PARAMS } from '../../constants/auth.constants';
import { AuthContextService } from '../../services/auth-context.service';
import { SupabaseAuthService } from '../../services/supabase-auth.service';
import { SESSION_CONFIG } from '../config/session.config';
import { TokenLifecycleService } from './token-lifecycle.service';

@Injectable({ providedIn: 'root' })
export class SessionRecoveryService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly onlineStatus = inject(OnlineStatusMonitorService);
  private readonly authContext = inject(AuthContextService);
  private readonly supabaseAuth = inject(SupabaseAuthService);
  private readonly tokenLifecycle = inject(TokenLifecycleService);
  private readonly eventBus = inject(ApplicationEventBusService);

  private readonly recovering = signal(false);
  private wasOffline = false;

  readonly isRecovering = this.recovering.asReadonly();

  initialize(): void {
    if (typeof window === 'undefined') {
      return;
    }

    fromEvent(window, 'offline')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.wasOffline = true;
      });

    fromEvent(window, 'online')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.recoverAfterReconnect();
      });
  }

  persistInterruptedRoute(): void {
    const url = this.router.url;
    if (url.startsWith(`/${APP_ROUTES.authentication}`)) {
      return;
    }

    sessionStorage.setItem(SESSION_CONFIG.sessionStorageKeys.pendingReturnUrl, url);
  }

  consumeInterruptedRoute(): string | null {
    const value = sessionStorage.getItem(SESSION_CONFIG.sessionStorageKeys.pendingReturnUrl);
    if (!value) {
      return null;
    }

    sessionStorage.removeItem(SESSION_CONFIG.sessionStorageKeys.pendingReturnUrl);
    return value;
  }

  private async recoverAfterReconnect(): Promise<void> {
    if (!this.wasOffline || !this.onlineStatus.isOnline()) {
      return;
    }

    this.wasOffline = false;

    if (!this.authContext.isAuthenticated()) {
      await this.supabaseAuth.restoreSession();
      return;
    }

    this.recovering.set(true);
    this.eventBus.publish({
      type: AUTH_EVENT_TYPES.sessionRecovering,
      timestamp: Date.now(),
    });

    await this.wait(SESSION_CONFIG.reconnectRecoveryDelayMs);

    const result = await this.tokenLifecycle.refreshWithRetry();
    if (result.success) {
      this.eventBus.publish({
        type: AUTH_EVENT_TYPES.sessionRecoveryComplete,
        timestamp: Date.now(),
      });
    }

    this.recovering.set(false);
  }

  buildSessionExpiredUrl(returnUrl?: string): string {
    const base = `/${APP_ROUTES.authentication}/session-expired`;
    if (!returnUrl) {
      return base;
    }

    return `${base}?${AUTH_QUERY_PARAMS.returnUrl}=${encodeURIComponent(returnUrl)}`;
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
