import { Injectable, computed, signal } from '@angular/core';
import type { Session } from '@supabase/supabase-js';

import { AuthState, AuthStatus } from '../models/auth.model';
import { mapSupabaseSession, mapSupabaseUser } from '../utils/auth.utils';

@Injectable({ providedIn: 'root' })
export class AuthContextService {
  private readonly state = signal<AuthState>({
    status: 'unknown',
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  readonly authState = this.state.asReadonly();
  readonly status = computed(() => this.state().status);
  readonly user = computed(() => this.state().user);
  readonly session = computed(() => this.state().session);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly isAuthenticated = computed(() => this.state().status === 'authenticated');
  readonly isInitialized = computed(() => this.state().status !== 'unknown');

  applySession(session: Session | null): void {
    const user = mapSupabaseUser(session?.user ?? null);
    const mappedSession = mapSupabaseSession(session);
    const status: AuthStatus = user && mappedSession ? 'authenticated' : 'unauthenticated';

    this.state.update((current) => ({
      ...current,
      status,
      user,
      session: mappedSession,
      error: null,
    }));
  }

  setLoading(loading: boolean): void {
    this.state.update((current) => ({ ...current, loading }));
  }

  setError(error: string | null): void {
    this.state.update((current) => ({ ...current, error }));
  }

  clear(): void {
    this.state.set({
      status: 'unauthenticated',
      user: null,
      session: null,
      loading: false,
      error: null,
    });
  }
}
