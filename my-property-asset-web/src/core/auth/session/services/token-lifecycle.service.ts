import { Injectable, computed, inject, signal } from '@angular/core';

import { SESSION_CONFIG } from '../config/session.config';
import { TokenRefreshResult } from '../models/session-lifecycle.model';
import { SupabaseAuthService } from '../../services/supabase-auth.service';

@Injectable({ providedIn: 'root' })
export class TokenLifecycleService {
  private readonly supabaseAuth = inject(SupabaseAuthService);

  private refreshPromise: Promise<TokenRefreshResult> | null = null;

  private readonly refreshing = signal(false);
  private readonly lastRefreshAt = signal<number | null>(null);
  private readonly lastFailureAt = signal<number | null>(null);

  readonly isRefreshing = this.refreshing.asReadonly();
  readonly lastRefreshAtSignal = this.lastRefreshAt.asReadonly();
  readonly hasRecentFailure = computed(() => {
    const failureAt = this.lastFailureAt();
    if (!failureAt) {
      return false;
    }

    return Date.now() - failureAt < 30_000;
  });

  refreshWithRetry(): Promise<TokenRefreshResult> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.executeRefreshWithRetry().finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async executeRefreshWithRetry(): Promise<TokenRefreshResult> {
    this.refreshing.set(true);
    let attempts = 0;
    let delay = SESSION_CONFIG.tokenRefreshRetryDelayMs;

    try {
      while (attempts < SESSION_CONFIG.tokenRefreshMaxRetries) {
        attempts += 1;

        try {
          await this.supabaseAuth.refreshSession();
          this.lastRefreshAt.set(Date.now());
          this.lastFailureAt.set(null);
          return { success: true, attempts };
        } catch {
          if (attempts >= SESSION_CONFIG.tokenRefreshMaxRetries) {
            break;
          }

          await this.wait(delay);
          delay *= SESSION_CONFIG.tokenRefreshRetryBackoff;
        }
      }

      this.lastFailureAt.set(Date.now());
      return { success: false, attempts };
    } finally {
      this.refreshing.set(false);
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
