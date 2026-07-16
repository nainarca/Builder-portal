import { Injectable, inject, signal } from '@angular/core';

import { AuthContextService } from '@core/auth';
import { SUPABASE_CLIENT } from '@infrastructure/tokens/injection.tokens';

export type PlatformOperatorStatus = 'unknown' | 'super_admin' | 'none';

const PLATFORM_OPERATOR_QUERY_TIMEOUT_MS = 8_000;

/**
 * Resolves Schema V2 / P6B `platform_operators` for the signed-in user.
 * Platform operators are not organization members — JWT metadata alone is insufficient.
 */
@Injectable({ providedIn: 'root' })
export class PlatformOperatorService {
  private readonly supabase = inject(SUPABASE_CLIENT);
  private readonly authContext = inject(AuthContextService);

  private readonly status = signal<PlatformOperatorStatus>('unknown');
  private cachedUserId: string | null = null;
  private inflight: Promise<void> | null = null;

  readonly operatorStatus = this.status.asReadonly();

  isSuperAdmin(): boolean {
    return this.status() === 'super_admin';
  }

  clear(): void {
    this.status.set('unknown');
    this.cachedUserId = null;
    this.inflight = null;
  }

  /**
   * Loads active platform_operators row for the current user (cached per user id).
   * Always settles — timeout / errors map to `none` so login cannot hang (AUTH-02).
   */
  async refresh(): Promise<void> {
    const user = this.authContext.user();
    if (!user?.id) {
      this.clear();
      return;
    }

    if (this.cachedUserId === user.id && this.status() !== 'unknown') {
      return;
    }

    if (this.inflight) {
      await this.inflight;
      return;
    }

    this.inflight = this.loadForUser(user.id);
    try {
      await this.inflight;
    } finally {
      this.inflight = null;
    }
  }

  private async loadForUser(userId: string): Promise<void> {
    try {
      const query = this.supabase
        .from('platform_operators')
        .select('operator_role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();

      const { data, error } = await this.withTimeout(query, PLATFORM_OPERATOR_QUERY_TIMEOUT_MS);

      if (error || !data) {
        this.cachedUserId = userId;
        this.status.set('none');
        return;
      }

      const role = String(data['operator_role'] ?? '')
        .trim()
        .toLowerCase()
        .replace(/-/g, '_');

      this.cachedUserId = userId;
      this.status.set(role === 'super_admin' ? 'super_admin' : 'none');
    } catch {
      this.cachedUserId = userId;
      this.status.set('none');
    }
  }

  private async withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        Promise.resolve(promise),
        new Promise<T>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error(`platform_operators query timed out after ${timeoutMs}ms`)),
            timeoutMs,
          );
        }),
      ]);
    } finally {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    }
  }
}
