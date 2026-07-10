import { Injectable, inject } from '@angular/core';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { ApplicationEventBusService } from '../../../infrastructure/events';
import { SUPABASE_CLIENT } from '../../../infrastructure/tokens/injection.tokens';
import { APP_ROUTES } from '../../constants/app.constants';
import { AUTH_EVENT_TYPES, AUTH_ROUTE_SEGMENTS } from '../constants/auth.constants';
import { SignInCredentials } from '../models/auth.model';
import { mapAuthErrorMessage } from '../utils/auth.utils';
import { AuthContextService } from './auth-context.service';

@Injectable({ providedIn: 'root' })
export class SupabaseAuthService {
  private readonly supabase = inject(SUPABASE_CLIENT);
  private readonly authContext = inject(AuthContextService);
  private readonly eventBus = inject(ApplicationEventBusService);

  private listenerRegistered = false;

  initialize(): void {
    if (this.listenerRegistered) {
      return;
    }

    this.listenerRegistered = true;
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.handleAuthChange(event, session);
    });
  }

  async restoreSession(): Promise<void> {
    this.authContext.setLoading(true);

    try {
      const { data, error } = await this.supabase.auth.getSession();
      if (error) {
        throw error;
      }

      this.authContext.applySession(data.session);
    } catch (error) {
      this.authContext.setError(mapAuthErrorMessage(error));
      this.authContext.applySession(null);
    } finally {
      this.authContext.setLoading(false);
    }
  }

  async signInWithPassword(credentials: SignInCredentials): Promise<void> {
    this.authContext.setLoading(true);
    this.authContext.setError(null);

    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      this.authContext.applySession(data.session);
      this.eventBus.publish({
        type: AUTH_EVENT_TYPES.signedIn,
        payload: { userId: data.user?.id },
        timestamp: Date.now(),
      });
    } catch (error) {
      const message = mapAuthErrorMessage(error);
      this.authContext.setError(message);
      throw new Error(message);
    } finally {
      this.authContext.setLoading(false);
    }
  }

  async requestPasswordReset(email: string, redirectTo?: string): Promise<void> {
    this.authContext.setLoading(true);
    this.authContext.setError(null);

    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectTo ?? this.buildResetPasswordUrl(),
      });

      if (error) {
        throw error;
      }

      this.eventBus.publish({
        type: AUTH_EVENT_TYPES.passwordResetRequested,
        payload: { email },
        timestamp: Date.now(),
      });
    } catch (error) {
      const message = mapAuthErrorMessage(error);
      this.authContext.setError(message);
      throw new Error(message);
    } finally {
      this.authContext.setLoading(false);
    }
  }

  async updatePassword(password: string): Promise<void> {
    this.authContext.setLoading(true);
    this.authContext.setError(null);

    try {
      const { error } = await this.supabase.auth.updateUser({ password });
      if (error) {
        throw error;
      }
    } catch (error) {
      const message = mapAuthErrorMessage(error);
      this.authContext.setError(message);
      throw new Error(message);
    } finally {
      this.authContext.setLoading(false);
    }
  }

  async refreshSession(): Promise<void> {
    const { data, error } = await this.supabase.auth.refreshSession();
    if (error) {
      throw error;
    }

    this.authContext.applySession(data.session);
    this.eventBus.publish({
      type: AUTH_EVENT_TYPES.sessionRefreshed,
      timestamp: Date.now(),
    });
  }

  async signOut(): Promise<void> {
    this.authContext.setLoading(true);

    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        throw error;
      }

      this.authContext.clear();
      this.eventBus.publish({
        type: AUTH_EVENT_TYPES.signedOut,
        timestamp: Date.now(),
      });
    } finally {
      this.authContext.setLoading(false);
    }
  }

  private handleAuthChange(event: AuthChangeEvent, session: Session | null): void {
    this.authContext.applySession(session);

    if (event === 'SIGNED_OUT') {
      this.eventBus.publish({
        type: AUTH_EVENT_TYPES.signedOut,
        timestamp: Date.now(),
      });
    }

    if (event === 'SIGNED_IN') {
      this.eventBus.publish({
        type: AUTH_EVENT_TYPES.signedIn,
        payload: { userId: session?.user.id },
        timestamp: Date.now(),
      });
    }

    if (event === 'TOKEN_REFRESHED') {
      this.eventBus.publish({
        type: AUTH_EVENT_TYPES.sessionRefreshed,
        timestamp: Date.now(),
      });
    }
  }

  private buildResetPasswordUrl(): string {
    if (typeof window === 'undefined') {
      return '';
    }

    return `${window.location.origin}/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.resetPassword}`;
  }
}
