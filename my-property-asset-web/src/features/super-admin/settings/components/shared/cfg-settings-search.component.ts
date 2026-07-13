import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { SettingsNavigationStateService } from '../../services/settings-navigation-state.service';
import { SettingsSearchItem } from '../../models/settings-admin.model';

@Component({
  selector: 'app-cfg-settings-search',
  template: `
    <div class="cfg-search" [class.cfg-search--compact]="compact()">
      <div class="cfg-search__field">
        <i class="pi pi-search cfg-search__icon" aria-hidden="true"></i>
        <input
          type="search"
          class="cfg-search__input"
          aria-autocomplete="list"
          aria-controls="cfg-search-results"
          [attr.aria-expanded]="showResults()"
          [value]="navState.searchQuery()"
          placeholder="Search settings…"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown.escape)="clear()"
        />
        @if (navState.searchQuery()) {
          <button
            type="button"
            class="cfg-search__clear"
            aria-label="Clear search"
            (click)="clear()"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </button>
        }
      </div>

      @if (showResults() && results().length) {
        <ul id="cfg-search-results" class="cfg-search__results" role="listbox">
          @for (result of results(); track result.id) {
            <li class="cfg-search__result" role="option" [attr.aria-selected]="false">
              <button
                type="button"
                class="cfg-search__result-button"
                (mousedown)="navigate(result)"
              >
                <span class="cfg-search__result-label">{{ result.label }}</span>
                <span class="cfg-search__result-description">{{ result.description }}</span>
                <span class="cfg-search__result-category">{{ result.category }}</span>
              </button>
            </li>
          }
        </ul>
      } @else if (showResults() && navState.searchQuery().trim()) {
        <div class="cfg-search__empty">No settings match “{{ navState.searchQuery() }}”.</div>
      }
    </div>
  `,
  styles: `
    .cfg-search {
      position: relative;
      width: 100%;
      max-width: 480px;
    }
    .cfg-search--compact {
      max-width: 280px;
    }
    .cfg-search__field {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.75rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .cfg-search__field:focus-within {
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 1px var(--mpa-color-primary);
    }
    .cfg-search--compact .cfg-search__field {
      padding: 0.4rem 0.6rem;
    }
    .cfg-search__icon {
      color: var(--mpa-color-text-muted);
      flex: none;
    }
    .cfg-search__input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .cfg-search__input::placeholder {
      color: var(--mpa-color-text-muted);
    }
    .cfg-search__clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--mpa-color-text-muted);
      cursor: pointer;
      padding: 0.1rem;
      border-radius: var(--mpa-radius-sm, 0.375rem);
    }
    .cfg-search__clear:hover {
      color: var(--mpa-color-text);
    }
    .cfg-search__results {
      position: absolute;
      top: calc(100% + 0.35rem);
      left: 0;
      right: 0;
      z-index: 20;
      list-style: none;
      margin: 0;
      padding: 0.35rem;
      max-height: 320px;
      overflow-y: auto;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
    }
    .cfg-search__result-button {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-template-areas:
        'label category'
        'description category';
      align-items: center;
      gap: 0.1rem 0.75rem;
      width: 100%;
      text-align: left;
      padding: 0.5rem 0.65rem;
      border: none;
      background: transparent;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      cursor: pointer;
    }
    .cfg-search__result-button:hover {
      background: var(--mpa-color-background, #f4f6f9);
    }
    .cfg-search__result-label {
      grid-area: label;
      font-weight: 600;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }
    .cfg-search__result-description {
      grid-area: description;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-search__result-category {
      grid-area: category;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      text-transform: capitalize;
      padding: 0.1rem 0.5rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: 999px;
    }
    .cfg-search__empty {
      position: absolute;
      top: calc(100% + 0.35rem);
      left: 0;
      right: 0;
      z-index: 20;
      padding: 0.85rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSettingsSearchComponent {
  readonly navState = inject(SettingsNavigationStateService);
  private readonly router = inject(Router);

  readonly compact = input(false);

  protected readonly focused = signal(false);

  protected readonly results = this.navState.searchResults;
  protected readonly showResults = signal(false);

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.navState.setSearchQuery(value);
    this.showResults.set(true);
  }

  onFocus(): void {
    this.focused.set(true);
    this.showResults.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.showResults.set(false);
  }

  navigate(result: SettingsSearchItem): void {
    this.showResults.set(false);
    void this.router.navigateByUrl(result.route);
  }

  clear(): void {
    this.navState.setSearchQuery('');
    this.showResults.set(false);
  }
}
