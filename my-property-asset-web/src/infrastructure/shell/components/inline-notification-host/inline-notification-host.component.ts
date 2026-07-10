import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NotificationService } from '../../../notification';
import { InlineMessageComponent } from '../../../../shared/ui';

@Component({
  selector: 'app-inline-notification-host',
  imports: [InlineMessageComponent],
  template: `
    @if (notificationService.inlineNotification(); as notification) {
      <div class="platform-inline-notification">
        <app-inline-message
          [severity]="mapSeverity(notification.level)"
          [text]="notification.message"
          [closable]="notification.dismissible ?? true"
        />
        @if (notification.dismissible ?? true) {
          <button type="button" class="platform-inline-notification__dismiss" (click)="dismiss()">
            Dismiss
          </button>
        }
      </div>
    }
  `,
  styles: `
    .platform-inline-notification {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-lg);
      border-bottom: 1px solid var(--mpa-color-border);
      background: var(--mpa-color-surface-muted);
    }

    .platform-inline-notification__dismiss {
      border: 0;
      background: transparent;
      color: var(--mpa-color-primary);
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
      cursor: pointer;
    }

    .platform-inline-notification__dismiss:focus-visible {
      outline: 2px solid var(--mpa-color-focus);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineNotificationHostComponent {
  readonly notificationService = inject(NotificationService);

  mapSeverity(level: 'success' | 'info' | 'warning' | 'error') {
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

  dismiss(): void {
    this.notificationService.dismissInline();
  }
}
