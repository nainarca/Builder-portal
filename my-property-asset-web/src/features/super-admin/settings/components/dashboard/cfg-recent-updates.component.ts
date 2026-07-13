import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { getCategoryById } from '../../config/settings.config';
import { SettingsNavigationStateService } from '../../services/settings-navigation-state.service';

interface RecentUpdateView {
  readonly id: string;
  readonly title: string;
  readonly categoryLabel: string;
  readonly changedBy: string;
  readonly relativeDate: string;
}

@Component({
  selector: 'app-cfg-recent-updates',
  template: `
    <section class="cfg-recent-updates" aria-label="Recent settings updates">
      <header class="cfg-recent-updates__header">
        <h3 class="cfg-recent-updates__heading">Recent updates</h3>
      </header>
      <ul class="cfg-recent-updates__list">
        @for (update of updates(); track update.id) {
          <li class="cfg-recent-updates__item">
            <span class="cfg-recent-updates__dot" aria-hidden="true"></span>
            <div class="cfg-recent-updates__body">
              <span class="cfg-recent-updates__title">{{ update.title }}</span>
              <span class="cfg-recent-updates__meta">
                <span class="cfg-recent-updates__tag">{{ update.categoryLabel }}</span>
                {{ update.changedBy }} · {{ update.relativeDate }}
              </span>
            </div>
          </li>
        } @empty {
          <li class="cfg-recent-updates__empty">No recent updates recorded.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .cfg-recent-updates {
      padding: 1.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }
    .cfg-recent-updates__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }
    .cfg-recent-updates__heading {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }
    .cfg-recent-updates__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .cfg-recent-updates__item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--mpa-color-border);
    }
    .cfg-recent-updates__item:last-child { border-bottom: none; }
    .cfg-recent-updates__dot {
      width: 0.55rem;
      height: 0.55rem;
      margin-top: 0.4rem;
      border-radius: 50%;
      background: var(--mpa-color-primary);
      flex: none;
    }
    .cfg-recent-updates__body {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      min-width: 0;
    }
    .cfg-recent-updates__title {
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-recent-updates__meta {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      flex-wrap: wrap;
    }
    .cfg-recent-updates__tag {
      padding: 0.1rem 0.5rem;
      border-radius: 999px;
      border: 1px solid var(--mpa-color-border);
      color: var(--mpa-color-primary);
      font-weight: 600;
    }
    .cfg-recent-updates__empty {
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgRecentUpdatesComponent {
  private readonly navState = inject(SettingsNavigationStateService);

  readonly limit = input<number>(5);

  readonly updates = computed<readonly RecentUpdateView[]>(() =>
    this.navState.recentChanges.slice(0, this.limit()).map((change) => ({
      id: change.id,
      title: change.title,
      categoryLabel: getCategoryById(change.category)?.label ?? change.category,
      changedBy: change.changedBy,
      relativeDate: this.toRelativeDate(change.changedAt),
    })),
  );

  private toRelativeDate(iso: string): string {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return '';
    const diffMs = Date.now() - then;
    const seconds = Math.round(diffMs / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    const weeks = Math.round(days / 7);
    if (days < 30) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    const months = Math.round(days / 30);
    if (days < 365) return `${months} month${months === 1 ? '' : 's'} ago`;
    const years = Math.round(days / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}
