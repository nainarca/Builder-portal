import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge, throttleTime } from 'rxjs';

import { SESSION_CONFIG } from '../config/session.config';
import { SessionExpiryReason } from '../models/session-lifecycle.model';

export interface IdleSessionState {
  warningVisible: boolean;
  remainingMs: number;
  reason: SessionExpiryReason;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class IdleSessionService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<IdleSessionState>({
    warningVisible: false,
    remainingMs: 0,
    reason: 'idle',
    message: 'You have been inactive. Move your mouse or press a key to stay signed in.',
  });

  private tracking = false;
  private idleExpiresAt: number | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private onIdleExpired: (() => void) | null = null;

  readonly idleState = this.state.asReadonly();

  start(onIdleExpired: () => void): void {
    if (typeof window === 'undefined' || this.tracking) {
      return;
    }

    this.tracking = true;
    this.onIdleExpired = onIdleExpired;
    this.resetIdleTimer();
    this.bindActivityListeners();
    this.scheduleChecks();
  }

  stop(): void {
    this.tracking = false;
    this.onIdleExpired = null;
    this.idleExpiresAt = null;
    this.clearTimer();
    this.state.update((current) => ({
      ...current,
      warningVisible: false,
      remainingMs: 0,
    }));
  }

  recordActivity(): void {
    if (!this.tracking) {
      return;
    }

    this.resetIdleTimer();
    this.state.update((current) => ({
      ...current,
      warningVisible: false,
    }));
  }

  dismissWarning(): void {
    this.recordActivity();
  }

  private bindActivityListeners(): void {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const;
    const streams = events.map((eventName) => fromEvent(window, eventName));

    merge(...streams)
      .pipe(
        throttleTime(SESSION_CONFIG.idleActivityThrottleMs),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.recordActivity());
  }

  private resetIdleTimer(): void {
    this.idleExpiresAt = Date.now() + SESSION_CONFIG.idleTimeoutMs;
    this.evaluate();
  }

  private scheduleChecks(): void {
    this.clearTimer();
    this.timerId = setInterval(() => this.evaluate(), SESSION_CONFIG.warningCheckIntervalMs);
  }

  private evaluate(): void {
    if (!this.tracking || this.idleExpiresAt === null) {
      return;
    }

    const remainingMs = Math.max(0, this.idleExpiresAt - Date.now());
    const warningVisible = remainingMs > 0 && remainingMs <= SESSION_CONFIG.idleWarningLeadTimeMs;

    if (remainingMs === 0) {
      this.stop();
      this.onIdleExpired?.();
      return;
    }

    this.state.set({
      warningVisible,
      remainingMs,
      reason: 'idle',
      message: warningVisible
        ? 'Your session will end soon due to inactivity. Continue working to stay signed in.'
        : 'You have been inactive. Move your mouse or press a key to stay signed in.',
    });
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
