import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SettingsNavigationStateService } from '../../services/settings-navigation-state.service';

@Component({
  selector: 'app-cfg-favorites-panel',
  imports: [RouterLink],
  template: `
    <section class="cfg-favorites" aria-label="Favorite settings">
      <header class="cfg-favorites__header">
        <h3 class="cfg-favorites__heading">Favorites</h3>
        <span class="cfg-favorites__count">{{ items().length }}</span>
      </header>
      <ul class="cfg-favorites__list">
        @for (item of items(); track item.id) {
          <li class="cfg-favorites__item">
            <a class="cfg-favorites__link" [routerLink]="item.route">
              <i class="pi pi-star-fill cfg-favorites__star" aria-hidden="true"></i>
              <span class="cfg-favorites__body">
                <span class="cfg-favorites__label">{{ item.label }}</span>
                <span class="cfg-favorites__desc">{{ item.description }}</span>
              </span>
            </a>
            <button
              type="button"
              class="cfg-favorites__toggle"
              [attr.aria-label]="'Unpin ' + item.label + ' from favorites'"
              (click)="toggle(item.id)"
            >
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          </li>
        } @empty {
          <li class="cfg-favorites__empty">No favorites yet. Star a setting to add it here.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .cfg-favorites {
      padding: 1.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }
    .cfg-favorites__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }
    .cfg-favorites__heading {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      color: var(--mpa-color-text);
    }
    .cfg-favorites__count {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      color: var(--mpa-color-text-muted);
      padding: 0.1rem 0.55rem;
      border-radius: 999px;
      border: 1px solid var(--mpa-color-border);
    }
    .cfg-favorites__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .cfg-favorites__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .cfg-favorites__link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      min-width: 0;
      padding: 0.65rem 0.75rem;
      border-radius: var(--mpa-radius-md, 0.5rem);
      text-decoration: none;
      color: inherit;
      transition: background 0.15s ease;
    }
    .cfg-favorites__link:hover {
      background: color-mix(in srgb, var(--mpa-color-primary) 8%, transparent);
    }
    .cfg-favorites__star {
      color: var(--mpa-color-warning);
      flex: none;
    }
    .cfg-favorites__body {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
    }
    .cfg-favorites__label {
      font-weight: 600;
      color: var(--mpa-color-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cfg-favorites__desc {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .cfg-favorites__toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      flex: none;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: transparent;
      color: var(--mpa-color-text-muted);
      cursor: pointer;
      transition: color 0.15s ease, border-color 0.15s ease;
    }
    .cfg-favorites__toggle:hover {
      color: var(--mpa-color-danger);
      border-color: var(--mpa-color-danger);
    }
    .cfg-favorites__empty {
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgFavoritesPanelComponent {
  private readonly navState = inject(SettingsNavigationStateService);

  readonly items = this.navState.favoriteItems;

  toggle(id: string): void {
    this.navState.toggleFavorite(id);
  }
}
