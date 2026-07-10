import { Injectable, computed, inject, signal } from '@angular/core';

import { AuthorizationState, PermissionSet } from '../models/permission.model';
import { PermissionCacheService } from './permission-resolver.service';

@Injectable({ providedIn: 'root' })
export class AuthorizationContextService {
  private readonly permissionCache = inject(PermissionCacheService);

  private readonly state = signal<AuthorizationState>({
    initialized: false,
    loading: false,
    role: null,
    permissions: {},
    lastResolvedAt: null,
    error: null,
  });

  readonly authorizationState = this.state.asReadonly();
  readonly permissions = computed(() => this.state().permissions);
  readonly role = computed(() => this.state().role);
  readonly isInitialized = computed(() => this.state().initialized);
  readonly loading = computed(() => this.state().loading);

  applyResolvedState(input: {
    role: AuthorizationState['role'];
    permissions: PermissionSet;
    error?: string | null;
  }): void {
    this.state.set({
      initialized: true,
      loading: false,
      role: input.role,
      permissions: input.permissions,
      lastResolvedAt: Date.now(),
      error: input.error ?? null,
    });
  }

  setLoading(loading: boolean): void {
    this.state.update((current) => ({ ...current, loading }));
  }

  clear(): void {
    this.permissionCache.invalidate();
    this.state.set({
      initialized: false,
      loading: false,
      role: null,
      permissions: {},
      lastResolvedAt: null,
      error: null,
    });
  }
}
