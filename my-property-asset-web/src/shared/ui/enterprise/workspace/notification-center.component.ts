import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { EmptyStateComponent } from '../../composites/feedback/empty-state.component';
import { EnterpriseNotificationItemComponent } from './notification-item.component';
import type { EnterpriseNotificationItemData } from './models/enterprise-workspace.models';

/** Notification center drawer body — grouping, empty/loading, item list. */
@Component({
  selector: 'app-enterprise-notification-center',
  imports: [EmptyStateComponent, EnterpriseNotificationItemComponent],
  template: `
    <div
      class="enterprise-notification-center"
      role="region"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-busy]="loading() ? 'true' : null"
    >
      <header class="enterprise-notification-center__header">
        <h2 class="enterprise-notification-center__title">{{ title() }}</h2>
        @if (unreadCount() > 0) {
          <span class="enterprise-notification-center__badge" aria-live="polite">
            {{ unreadCount() }} unread
          </span>
        }
        <div class="enterprise-notification-center__header-actions">
          <ng-content select="[centerActions]" />
        </div>
      </header>

      @if (loading()) {
        <div class="enterprise-notification-center__loading" role="status">
          <span class="enterprise-notification-center__spinner" aria-hidden="true"></span>
          <span>{{ loadingLabel() }}</span>
        </div>
      } @else if (items().length === 0) {
        <div class="enterprise-notification-center__empty">
          <app-empty-state
            [title]="emptyTitle()"
            [description]="emptyDescription()"
            icon="bell"
            actionLabel=""
          />
        </div>
      } @else {
        @for (group of grouped(); track group.name) {
          @if (group.name) {
            <p class="enterprise-notification-center__group">{{ group.name }}</p>
          }
          <div class="enterprise-notification-center__list" role="list">
            @for (item of group.items; track item.id) {
              <div role="listitem">
                <app-enterprise-notification-item
                  [title]="item.title"
                  [description]="item.description"
                  [timestamp]="item.timestamp"
                  [unread]="item.unread ?? false"
                  [icon]="item.icon"
                  (select)="itemSelect.emit(item)"
                />
              </div>
            }
          </div>
        }
      }

      <footer class="enterprise-notification-center__footer">
        <ng-content select="[centerFooter]" />
      </footer>
    </div>
  `,
  styles: `
    .enterprise-notification-center {
      display: flex;
      flex-direction: column;
      min-height: 12rem;
      max-height: min(28rem, 70vh);
      width: min(22rem, 100vw);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text);
    }
    .enterprise-notification-center__header {
      display: flex;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      flex-wrap: wrap;
      padding: var(--mpa-spacing-md);
      border-bottom: 1px solid var(--mpa-color-border);
    }
    .enterprise-notification-center__title {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
      flex: 1;
    }
    .enterprise-notification-center__badge {
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--mpa-color-primary);
      background: var(--mpa-color-primary-subtle, var(--mpa-color-surface-muted));
      padding: 0.15rem 0.5rem;
      border-radius: var(--mpa-radius-sm);
    }
    .enterprise-notification-center__header-actions:empty {
      display: none;
    }
    .enterprise-notification-center__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--mpa-spacing-sm);
      padding: var(--mpa-spacing-xl);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-notification-center__spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid var(--mpa-color-border);
      border-top-color: var(--mpa-color-primary);
      border-radius: 999px;
      animation: enterprise-notification-spin 0.7s linear infinite;
    }
    @keyframes enterprise-notification-spin {
      to {
        transform: rotate(360deg);
      }
    }
    .enterprise-notification-center__group {
      margin: 0;
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md) 0.25rem;
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--mpa-color-text-muted);
    }
    .enterprise-notification-center__list {
      overflow: auto;
      flex: 1;
    }
    .enterprise-notification-center__empty {
      padding: var(--mpa-spacing-sm);
    }
    .enterprise-notification-center__footer:empty {
      display: none;
    }
    .enterprise-notification-center__footer:not(:empty) {
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseNotificationCenterComponent {
  readonly items = input<readonly EnterpriseNotificationItemData[]>([]);
  readonly loading = input(false);
  readonly title = input('Notifications');
  readonly ariaLabel = input('Notification center');
  readonly loadingLabel = input('Loading notifications…');
  readonly emptyTitle = input('No notifications');
  readonly emptyDescription = input('You are all caught up. New alerts will appear here.');
  readonly itemSelect = output<EnterpriseNotificationItemData>();

  readonly unreadCount = computed(
    () => this.items().filter((i) => i.unread).length,
  );

  readonly grouped = computed(() => {
    const map = new Map<string, EnterpriseNotificationItemData[]>();
    for (const item of this.items()) {
      const key = item.group ?? '';
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return [...map.entries()].map(([name, groupItems]) => ({
      name,
      items: groupItems,
    }));
  });
}
