import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { SessionManagerService, SessionStateService, SESSION_CONFIG } from '@core/auth/session';
import { ButtonComponent, ModalShellComponent } from '@shared/ui';

@Component({
  selector: 'app-session-expiry-host',
  imports: [ButtonComponent, ModalShellComponent],
  templateUrl: './session-expiry-host.component.html',
  styleUrl: './session-expiry-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiryHostComponent {
  private readonly sessionState = inject(SessionStateService);
  private readonly sessionManager = inject(SessionManagerService);

  readonly refreshing = signal(false);

  readonly dialogState = computed(() => this.sessionState.lifecycleState());

  readonly dialogTitle = computed(() =>
    this.dialogState().expiryReason === 'idle'
      ? 'Still with us?'
      : 'Session expiring soon',
  );

  readonly formattedRemaining = computed(() => {
    const remainingMs = this.dialogState().remainingMs;
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  readonly progressPercent = computed(() => {
    const state = this.dialogState();
    const leadTimeMs =
      state.expiryReason === 'idle'
        ? SESSION_CONFIG.idleWarningLeadTimeMs
        : SESSION_CONFIG.warningLeadTimeMs;
    return Math.max(0, Math.min(100, (state.remainingMs / leadTimeMs) * 100));
  });

  async continueSession(): Promise<void> {
    this.refreshing.set(true);

    try {
      if (this.dialogState().expiryReason === 'idle') {
        this.sessionManager.dismissWarning();
        return;
      }

      const refreshed = await this.sessionManager.refreshSession();
      if (!refreshed) {
        await this.sessionManager.handleSessionExpired('token');
      }
    } finally {
      this.refreshing.set(false);
    }
  }

  dismiss(): void {
    this.sessionManager.dismissWarning();
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.dismiss();
    }
  }
}
