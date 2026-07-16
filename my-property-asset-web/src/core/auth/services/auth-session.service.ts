import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { APP_ROUTES } from '../../constants/app.constants';
import { SessionMonitorService } from '../../../infrastructure/session';
import { AuthorizationService } from '../../rbac/services/authorization.service';
import { RoleService } from '../../rbac/services/role.service';
import { PORTAL_PERMISSION_KEYS } from '../../rbac/constants/rbac.constants';
import { AUTH_CONFIG } from '../config/auth.config';
import {
  AUTH_DEFAULT_REDIRECT,
  AUTH_PORTAL_UNAVAILABLE_REDIRECT,
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
  private readonly authorization = inject(AuthorizationService);
  private readonly roleService = inject(RoleService);

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

  getSanitizedReturnUrl(returnUrl?: string | null, portals?: readonly string[]): string {
    return (
      this.sanitizeReturnUrl(returnUrl ?? undefined, portals) ??
      this.resolveHomeForPortals(portals ?? [])
    );
  }

  /** Resolves the post-auth landing URL without navigating. */
  resolvePostLoginUrl(returnUrl?: string | null, portals?: readonly string[]): string {
    const resolvedPortals = portals ?? this.roleService.resolveUserContext().portals;
    return (
      this.sanitizeReturnUrl(returnUrl ?? undefined, resolvedPortals) ??
      this.resolveHomeForPortals(resolvedPortals)
    );
  }

  buildPortalUnavailableUrl(): string {
    return `/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.portalUnavailable}`;
  }

  /**
   * Post-login routing (P2 / P7):
   * Super Admin → /super-admin
   * Builder → /builder-portal
   * Owner / other → friendly portal-unavailable
   */
  async navigateAfterLogin(returnUrl?: string): Promise<void> {
    await this.authorization.resolveAuthorization();

    const portals = this.roleService.resolveUserContext().portals;
    const sanitized = this.sanitizeReturnUrl(returnUrl, portals);

    if (sanitized) {
      await this.router.navigateByUrl(sanitized);
      return;
    }

    await this.router.navigateByUrl(this.resolveHomeForPortals(portals));
  }

  resolveHomeForPortals(portals: readonly string[]): string {
    if (portals.includes(PORTAL_PERMISSION_KEYS.superAdmin)) {
      return `/${APP_ROUTES.superAdmin}`;
    }

    if (portals.includes(PORTAL_PERMISSION_KEYS.builderPortal)) {
      return `/${APP_ROUTES.builderPortal}`;
    }

    return AUTH_PORTAL_UNAVAILABLE_REDIRECT;
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

  private sanitizeReturnUrl(
    returnUrl?: string,
    portals?: readonly string[],
  ): string | null {
    if (!returnUrl || !returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      return null;
    }

    if (returnUrl.startsWith(`/${APP_ROUTES.authentication}`)) {
      return null;
    }

    if (portals) {
      if (
        returnUrl.startsWith(`/${APP_ROUTES.superAdmin}`) &&
        !portals.includes(PORTAL_PERMISSION_KEYS.superAdmin)
      ) {
        return null;
      }

      if (
        returnUrl.startsWith(`/${APP_ROUTES.builderPortal}`) &&
        !portals.includes(PORTAL_PERMISSION_KEYS.builderPortal)
      ) {
        return null;
      }
    }

    return returnUrl;
  }
}
