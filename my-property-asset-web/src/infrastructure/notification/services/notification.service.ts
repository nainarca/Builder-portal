import { Injectable, inject, signal } from '@angular/core';

import { UiToastService } from '../../../shared/ui';
import { ActionNotification, InlineNotificationState, NotificationLevel } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class ToastManagerService {
  private readonly toastService = inject(UiToastService);

  show(level: NotificationLevel, summary: string, detail?: string, life?: number): void {
    this.toastService.show({
      summary,
      detail,
      severity: this.mapLevel(level),
      life,
    });
  }

  clear(): void {
    this.toastService.clear();
  }

  private mapLevel(level: NotificationLevel) {
    switch (level) {
      case 'success':
        return 'success' as const;
      case 'warning':
        return 'warn' as const;
      case 'error':
        return 'error' as const;
      default:
        return 'info' as const;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastManager = inject(ToastManagerService);
  private readonly inlineState = signal<InlineNotificationState | null>(null);

  readonly inlineNotification = this.inlineState.asReadonly();

  success(summary: string, detail?: string): void {
    this.toastManager.show('success', summary, detail);
  }

  info(summary: string, detail?: string): void {
    this.toastManager.show('info', summary, detail);
  }

  warning(summary: string, detail?: string): void {
    this.toastManager.show('warning', summary, detail);
  }

  error(summary: string, detail?: string): void {
    this.toastManager.show('error', summary, detail, 6000);
  }

  action(notification: ActionNotification, onAction?: () => void): void {
    this.toastManager.show(
      notification.level ?? 'info',
      notification.summary,
      notification.detail
        ? `${notification.detail} — ${notification.actionLabel}`
        : notification.actionLabel,
      6000,
    );

    if (onAction) {
      onAction();
    }
  }

  showInline(notification: InlineNotificationState): void {
    this.inlineState.set(notification);
  }

  dismissInline(): void {
    this.inlineState.set(null);
  }

  connectionRecovered(): void {
    this.success('Back online', 'Your connection has been restored.');
  }
}
