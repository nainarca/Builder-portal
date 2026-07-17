import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { EnterpriseNotificationItemData } from './models/enterprise-workspace.models';

/** Single notification row — read/unread presentation. */
@Component({
  selector: 'app-enterprise-notification-item',
  template: `
    <article
      class="enterprise-notification-item"
      [class.enterprise-notification-item--unread]="unread()"
      [attr.aria-label]="ariaLabel()"
    >
      <button
        type="button"
        class="enterprise-notification-item__hit"
        (click)="select.emit()"
      >
        <span class="enterprise-notification-item__indicator" aria-hidden="true"></span>
        <span class="enterprise-notification-item__body">
          <span class="enterprise-notification-item__title">{{ title() }}</span>
          @if (description()) {
            <span class="enterprise-notification-item__desc">{{ description() }}</span>
          }
          @if (timestamp()) {
            <time class="enterprise-notification-item__time">{{ timestamp() }}</time>
          }
        </span>
        @if (icon()) {
          <i class="enterprise-notification-item__icon" [class]="icon()" aria-hidden="true"></i>
        }
      </button>
      <div class="enterprise-notification-item__actions">
        <ng-content select="[notificationActions]" />
      </div>
    </article>
  `,
  styles: `
    .enterprise-notification-item {
      display: flex;
      flex-direction: column;
      border-bottom: 1px solid var(--mpa-color-border);
    }
    .enterprise-notification-item:last-child {
      border-bottom: 0;
    }
    .enterprise-notification-item__hit {
      display: flex;
      align-items: flex-start;
      gap: var(--mpa-spacing-sm);
      width: 100%;
      margin: 0;
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      border: 0;
      background: transparent;
      text-align: left;
      cursor: pointer;
      font: inherit;
      color: inherit;
    }
    .enterprise-notification-item__hit:hover {
      background: var(--mpa-color-surface-muted);
    }
    .enterprise-notification-item__hit:focus-visible {
      outline: 2px solid var(--mpa-color-primary);
      outline-offset: -2px;
    }
    .enterprise-notification-item__indicator {
      width: 0.5rem;
      height: 0.5rem;
      margin-top: 0.45rem;
      border-radius: 999px;
      background: transparent;
      flex-shrink: 0;
    }
    .enterprise-notification-item--unread .enterprise-notification-item__indicator {
      background: var(--mpa-color-primary);
    }
    .enterprise-notification-item--unread .enterprise-notification-item__title {
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-notification-item__body {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
      flex: 1;
    }
    .enterprise-notification-item__title {
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text);
    }
    .enterprise-notification-item__desc {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-notification-item__time {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-notification-item__icon {
      color: var(--mpa-color-text-muted);
      margin-top: 0.2rem;
    }
    .enterprise-notification-item__actions:empty {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseNotificationItemComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly timestamp = input<string | undefined>(undefined);
  readonly unread = input(false);
  readonly icon = input<string | undefined>(undefined);
  readonly select = output<void>();

  readonly ariaLabel = input('Notification');

  static fromData(data: EnterpriseNotificationItemData): EnterpriseNotificationItemData {
    return data;
  }
}
