import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { GhostButtonComponent, OutlineButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseTableSavedSearch } from './models/enterprise-table.models';

/** Placeholder UI for saved searches — persistence is host-owned. */
@Component({
  selector: 'app-enterprise-table-saved-searches',
  imports: [OutlineButtonComponent, GhostButtonComponent],
  template: `
    <div class="enterprise-table-saved-searches">
      <app-outline-button
        label="Saved searches"
        icon="pi pi-bookmark"
        size="small"
        (clicked)="togglePanel()"
      />
      @if (panelOpen()) {
        <div class="enterprise-table-saved-searches__panel" role="dialog" aria-label="Saved searches">
          @if (searches().length === 0) {
            <p class="enterprise-table-saved-searches__empty">No saved searches yet.</p>
          } @else {
            @for (search of searches(); track search.id) {
              <button
                type="button"
                class="enterprise-table-saved-searches__item"
                [class.enterprise-table-saved-searches__item--active]="search.active"
                (click)="onSelect(search.id)"
              >
                {{ search.label }}
              </button>
            }
          }
          <app-ghost-button
            label="Save current search"
            icon="pi pi-plus"
            size="small"
            (clicked)="saveSearch.emit()"
          />
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-table-saved-searches {
      position: relative;
    }
    .enterprise-table-saved-searches__panel {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: var(--mpa-z-index-dropdown, 200);
      min-width: 14rem;
      margin-top: var(--mpa-spacing-xs);
      padding: var(--mpa-spacing-sm);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-elevated, var(--mpa-color-surface));
      box-shadow: var(--mpa-shadow-md, 0 4px 12px rgb(15 23 42 / 12%));
    }
    .enterprise-table-saved-searches__empty {
      margin: 0 0 var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-table-saved-searches__item {
      display: block;
      width: 100%;
      padding: var(--mpa-spacing-sm);
      border: 0;
      border-radius: var(--mpa-radius-sm);
      background: transparent;
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm);
      text-align: left;
      cursor: pointer;
    }
    .enterprise-table-saved-searches__item:hover,
    .enterprise-table-saved-searches__item--active {
      background: var(--mpa-color-surface-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableSavedSearchesComponent {
  readonly searches = input<readonly EnterpriseTableSavedSearch[]>([]);

  readonly searchSelect = output<string>();
  readonly saveSearch = output<void>();

  readonly panelOpen = signal(false);

  togglePanel(): void {
    this.panelOpen.update((open) => !open);
  }

  onSelect(searchId: string): void {
    this.searchSelect.emit(searchId);
    this.panelOpen.set(false);
  }
}
