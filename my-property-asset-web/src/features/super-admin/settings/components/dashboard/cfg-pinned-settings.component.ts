import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { getCategoryById } from '../../config/settings.config';
import { SettingsCategoryId } from '../../models/settings-admin.model';
import { SettingsNavigationStateService } from '../../services/settings-navigation-state.service';

@Component({
  selector: 'app-cfg-pinned-settings',
  imports: [RouterLink],
  template: `
    <section class="cfg-pinned" aria-label="Pinned settings">
      <header class="cfg-pinned__header">
        <h3 class="cfg-pinned__heading">Pinned settings</h3>
        <span class="cfg-pinned__count">{{ items().length }}</span>
      </header>
      <ul class="cfg-pinned__list">
        @for (item of items(); track item.id) {
          <li class="cfg-pinned__item">
            <a class="cfg-pinned__link" [routerLink]="item.route">
              <i class="pi pi-bookmark-fill cfg-pinned__icon" aria-hidden="true"></i>
              <span class="cfg-pinned__body">
                <span class="cfg-pinned__label">{{ item.label }}</span>
                <span class="cfg-pinned__category">{{ categoryLabel(item.category) }}</span>
              </span>
              <i class="pi pi-angle-right cfg-pinned__chevron" aria-hidden="true"></i>
            </a>
          </li>
        } @empty {
          <li class="cfg-pinned__empty">No pinned settings yet.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .cfg-pinned {
      padding: 1.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }
    .cfg-pinned__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }
    .cfg-pinned__heading {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }
    .cfg-pinned__count {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      color: var(--mpa-color-text-muted);
      padding: 0.1rem 0.55rem;
      border-radius: 999px;
      border: 1px solid var(--mpa-color-border);
    }
    .cfg-pinned__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .cfg-pinned__link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.75rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      border: 1px solid var(--mpa-color-border);
      text-decoration: none;
      color: inherit;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .cfg-pinned__link:hover {
      border-color: var(--mpa-color-primary);
      background: color-mix(in srgb, var(--mpa-color-primary) 6%, transparent);
    }
    .cfg-pinned__icon {
      color: var(--mpa-color-primary);
      flex: none;
    }
    .cfg-pinned__body {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      flex: 1;
      min-width: 0;
    }
    .cfg-pinned__label {
      font-weight: 600;
      color: var(--mpa-color-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cfg-pinned__category {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-pinned__chevron {
      color: var(--mpa-color-text-muted);
      flex: none;
    }
    .cfg-pinned__empty {
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgPinnedSettingsComponent {
  private readonly navState = inject(SettingsNavigationStateService);

  readonly items = this.navState.pinnedItems;

  categoryLabel(category: SettingsCategoryId): string {
    return getCategoryById(category)?.label ?? category;
  }
}
