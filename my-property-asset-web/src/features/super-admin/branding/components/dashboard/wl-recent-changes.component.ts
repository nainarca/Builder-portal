import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { BrandAdminStoreService } from '../../services/brand-admin-store.service';

@Component({
  selector: 'app-wl-recent-changes',
  imports: [DatePipe],
  template: `
    <section class="wl-recent-changes" aria-label="Recent brand changes">
      <h3 class="wl-recent-changes__heading">Recent changes</h3>
      <ul class="wl-recent-changes__list">
        @for (change of changes(); track change.id) {
          <li class="wl-recent-changes__item">
            <span class="wl-recent-changes__dot" aria-hidden="true"></span>
            <div class="wl-recent-changes__body">
              <span class="wl-recent-changes__title">{{ change.title }}</span>
              <span class="wl-recent-changes__desc">{{ change.description }}</span>
              <span class="wl-recent-changes__meta">
                {{ change.actor }} · {{ change.timestamp | date: 'MMM d, y, h:mm a' }}
              </span>
            </div>
          </li>
        } @empty {
          <li class="wl-recent-changes__empty">No recent changes recorded.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .wl-recent-changes {
      padding: 1.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-recent-changes__heading {
      margin: 0 0 1rem;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }
    .wl-recent-changes__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .wl-recent-changes__item {
      display: flex;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--mpa-color-border);
    }
    .wl-recent-changes__item:last-child { border-bottom: none; }
    .wl-recent-changes__dot {
      width: 0.6rem;
      height: 0.6rem;
      margin-top: 0.35rem;
      border-radius: 50%;
      background: var(--mpa-color-primary);
      flex: none;
    }
    .wl-recent-changes__body { display: flex; flex-direction: column; gap: 0.15rem; }
    .wl-recent-changes__title { font-weight: 600; color: var(--mpa-color-text); }
    .wl-recent-changes__desc { font-size: var(--mpa-font-size-sm, 0.875rem); color: var(--mpa-color-text-muted); }
    .wl-recent-changes__meta { font-size: var(--mpa-font-size-xs, 0.75rem); color: var(--mpa-color-text-muted); }
    .wl-recent-changes__empty { color: var(--mpa-color-text-muted); font-size: var(--mpa-font-size-sm, 0.875rem); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlRecentChangesComponent {
  private readonly store = inject(BrandAdminStoreService);

  readonly limit = input<number>(5);
  readonly changes = computed(() => this.store.getRecentChanges(this.limit()));
}
