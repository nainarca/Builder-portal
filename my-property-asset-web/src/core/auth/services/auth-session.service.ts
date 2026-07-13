import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { APP_ROUTES } from '../../constants/app.constants';
import { SessionMonitorService } from '../../../infrastructure/session';
import { AUTH_CONFIG } from '../config/auth.config';
import {
  AUTH_DEFAULT_REDIRECT,
  AUTH_QUERY_PARAMS,
  AUTH_ROUTE_SEGMENTS,
} from '../constants/auth.constants';
import { AuthContextService } from './auth-context.service';
import { SupabaseAuthService } from './supabase-auth.service';
import { getSessionRemainingMs } from '../utils/auth.utils';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly authContext = inject(AuthContextService);
  private readonly supabaseAuth = inject(SupabaseAuthService);
  private readonly sessionMonitor = inject(SessionMonitorService);

  syncSessionMonitor(): void {
    const session = this.authContext.session();
    const remainingMs = getSessionRemainingMs(session);

    if (remainingMs > 0) {
      this.sessionMonitor.startSession(remainingMs);
      this.sessionMonitor.configure({
        warningLeadTimeMs: AUTH_CONFIG.sessionWarningLeadTimeMs,
        checkIntervalMs: AUTH_CONFIG.sessionCheckIntervalMs,
      });
      return;
    }

    this.sessionMonitor.endSession();
  }

  async refreshSession(): Promise<void> {
    await this.supabaseAuth.refreshSession();
    this.syncSessionMonitor();
  }

  async endSession(): Promise<void> {
    await this.supabaseAuth.signOut();
    this.sessionMonitor.endSession();
  }
}

@Injectable({ providedIn: 'root' })
export class AuthRedirectService {
  private readonly router = inject(Router);

  getReturnUrl(): string {
    const url = this.router.parseUrl(this.router.url);
    const returnUrl = url.queryParams[AUTH_QUERY_PARAMS.returnUrl];
    return typeof returnUrl === 'string' ? returnUrl : AUTH_DEFAULT_REDIRECT;
  }

  buildLoginUrl(returnUrl?: string, extraParams?: Record<string, string>): string {
    const target = returnUrl ?? this.router.url;
    const params = new URLSearchParams({
      [AUTH_QUERY_PARAMS.returnUrl]: target,
      ...extraParams,
    });

    return `/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.login}?${params.toString()}`;
  }

  getSanitizedReturnUrl(returnUrl?: string | null): string {
    return this.sanitizeReturnUrl(returnUrl ?? undefined);
  }

  async navigateAfterLogin(returnUrl?: string): Promise<void> {
    const sanitized = this.sanitizeReturnUrl(returnUrl);
    await this.router.navigateByUrl(sanitized);
  }

  async navigateToLogin(returnUrl?: string): Promise<void> {
    await this.router.navigateByUrl(this.buildLoginUrl(returnUrl));
  }

  async navigateToSessionExpired(returnUrl?: string, reason: 'token' | 'idle' = 'token'): Promise<void> {
    const queryParams: Record<string, string> = {
      reason,
    };

    if (returnUrl) {
      queryParams[AUTH_QUERY_PARAMS.returnUrl] = returnUrl;
    }

    await this.router.navigate(
      ['/', APP_ROUTES.authentication, AUTH_ROUTE_SEGMENTS.sessionExpired],
      { queryParams },
    );
  }

  async navigateToAccessDenied(reason?: string): Promise<void> {
    const queryParams = reason ? { [AUTH_QUERY_PARAMS.deniedReason]: reason } : undefined;
    await this.router.navigate(
      ['/', APP_ROUTES.authentication, AUTH_ROUTE_SEGMENTS.accessDenied],
      { queryParams },
    );
  }

  buildAccessDeniedUrl(reason?: string): string {
    const base = `/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.accessDenied}`;
    return reason ? `${base}?${AUTH_QUERY_PARAMS.deniedReason}=${encodeURIComponent(reason)}` : base;
  }

  private sanitizeReturnUrl(returnUrl?: string): string {
    if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return AUTH_DEFAULT_REDIRECT;
    }

    if (returnUrl.startsWith(`/${APP_ROUTES.authentication}`)) {
      return AUTH_DEFAULT_REDIRECT;
    }

    return returnUrl;
  }
}
