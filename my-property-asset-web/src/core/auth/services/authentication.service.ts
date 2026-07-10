import { Injectable, inject } from '@angular/core';
import type { Session } from '@supabase/supabase-js';

import { SessionManagerService } from '../session/services/session-manager.service';
import { SupabaseAuthService } from './supabase-auth.service';
import { AuthContextService } from './auth-context.service';
import { RememberMeService } from './remember-me.service';
import { SignInCredentials } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly supabaseAuth = inject(SupabaseAuthService);
  private readonly authContext = inject(AuthContextService);
  private readonly rememberMe = inject(RememberMeService);
  private readonly sessionManager = inject(SessionManagerService);

  readonly state = this.authContext.authState;
  readonly isAuthenticated = this.authContext.isAuthenticated;
  readonly loading = this.authContext.loading;

  async initialize(): Promise<void> {
    this.supabaseAuth.initialize();
    this.sessionManager.initialize();
    await this.supabaseAuth.restoreSession();
    this.sessionManager.syncLifecycle();
  }

  async signIn(credentials: SignInCredentials): Promise<void> {
    await this.supabaseAuth.signInWithPassword(credentials);
    this.rememberMe.persist(credentials.email, Boolean(credentials.rememberMe));
    this.sessionManager.syncLifecycle();
  }

  async signOut(options?: { syncTabs?: boolean }): Promise<void> {
    await this.sessionManager.signOut(options);
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.supabaseAuth.requestPasswordReset(email);
  }

  async updatePassword(password: string): Promise<void> {
    await this.supabaseAuth.updatePassword(password);
  }

  async refreshSession(): Promise<boolean> {
    return this.sessionManager.refreshSession();
  }

  onSessionChanged(session: Session | null): void {
    this.authContext.applySession(session);
    this.sessionManager.syncLifecycle();
  }
}
