import { Injectable, signal } from '@angular/core';

import { SessionExpiryState, SessionMonitorConfig } from '../models/session.model';

const DEFAULT_CONFIG: SessionMonitorConfig = {
  warningLeadTimeMs: 5 * 60 * 1000,
  checkIntervalMs: 30 * 1000,
  warningCheckIntervalMs: 1000,
};

@Injectable({ providedIn: 'root' })
export class SessionMonitorService {
  private readonly config = signal<SessionMonitorConfig>(DEFAULT_CONFIG);
  private readonly expiryState = signal<SessionExpiryState>({
    warningVisible: false,
    expired: false,
    remainingMs: 0,
    message: 'Your secure session will expire soon. Stay signed in to keep working without interruption.',
    reason: 'token',
  });

  private expiresAt: number | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly sessionState = this.expiryState.asReadonly();

  configure(config: Partial<SessionMonitorConfig>): void {
    this.config.update((current) => ({ ...current, ...config }));
  }

  startSession(durationMs: number): void {
    this.expiresAt = Date.now() + durationMs;
    this.scheduleChecks();
  }

  refreshSession(durationMs: number): void {
    this.expiryState.update((state) => ({
      ...state,
      warningVisible: false,
      expired: false,
      reason: 'token',
    }));
    this.startSession(durationMs);
  }

  endSession(): void {
    this.expiresAt = null;
    this.clearTimer();
    this.expiryState.update((state) => ({
      ...state,
      warningVisible: false,
      expired: false,
      remainingMs: 0,
      reason: 'token',
    }));
  }

  dismissWarning(): void {
    this.expiryState.update((state) => ({ ...state, warningVisible: false }));
  }

  markExpired(
    message = 'Your secure session has ended. Sign in again to continue where you left off.',
  ): void {
    this.expiryState.update((state) => ({
      ...state,
      warningVisible: false,
      expired: true,
      remainingMs: 0,
      message,
      reason: 'token',
    }));
  }

  private scheduleChecks(): void {
    this.clearTimer();
    this.evaluate();
    this.timerId = setInterval(() => this.evaluate(), this.resolveInterval());
  }

  private evaluate(): void {
    if (this.expiresAt === null) {
      return;
    }

    const remainingMs = Math.max(0, this.expiresAt - Date.now());
    const warningLeadTimeMs = this.config().warningLeadTimeMs;
    const warningVisible = remainingMs > 0 && remainingMs <= warningLeadTimeMs;

    if (remainingMs === 0) {
      this.markExpired();
      this.clearTimer();
      return;
    }

    if (warningVisible && this.resolveInterval() !== this.config().warningCheckIntervalMs) {
      this.scheduleChecks();
    }

    this.expiryState.update((state) => ({
      ...state,
      remainingMs,
      warningVisible,
      expired: false,
      reason: 'token',
    }));
  }

  private resolveInterval(): number {
    const config = this.config();
    const state = this.expiryState();
    if (state.warningVisible || state.expired) {
      return config.warningCheckIntervalMs ?? 1000;
    }

    return config.checkIntervalMs;
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
