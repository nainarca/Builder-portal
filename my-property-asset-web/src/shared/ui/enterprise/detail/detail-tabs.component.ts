import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import type { EnterpriseDetailTab } from './models/enterprise-detail.models';

/**
 * Accessible in-page tab strip for Detail template (P0.1 §2.7 / §4.4).
 * Phone: native select switcher to avoid partial-tab scroll ambiguity.
 */
@Component({
  selector: 'app-enterprise-detail-tabs',
  template: `
    <div class="enterprise-detail-tabs">
      <div
        class="enterprise-detail-tabs__list"
        role="tablist"
        [attr.aria-label]="ariaLabel()"
      >
        @for (tab of tabs(); track tab.id; let i = $index) {
          <button
            type="button"
            class="enterprise-detail-tabs__tab mpa-focus-visible"
            role="tab"
            [id]="tabId(tab.id)"
            [attr.aria-selected]="tab.id === activeTabId()"
            [attr.aria-controls]="panelId(tab.id)"
            [attr.tabindex]="tab.id === activeTabId() ? 0 : -1"
            [disabled]="tab.disabled ?? false"
            (click)="select(tab.id)"
            (keydown)="onKeydown($event, i)"
          >
            @if (tab.icon) {
              <i [class]="tab.icon" aria-hidden="true"></i>
            }
            <span>{{ tab.label }}</span>
          </button>
        }
      </div>

      <label class="enterprise-detail-tabs__mobile">
        <span class="enterprise-detail-tabs__mobile-label">Section</span>
        <select
          class="enterprise-detail-tabs__select mpa-focus-visible"
          [attr.aria-label]="ariaLabel()"
          [value]="activeTabId()"
          (change)="select($any($event.target).value)"
        >
          @for (tab of tabs(); track tab.id) {
            <option [value]="tab.id" [disabled]="tab.disabled ?? false">{{ tab.label }}</option>
          }
        </select>
      </label>
    </div>
  `,
  styles: `
    .enterprise-detail-tabs {
      margin-top: var(--mpa-spacing-md);
    }
    .enterprise-detail-tabs__list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs);
      border-bottom: 1px solid var(--mpa-color-border);
      padding-bottom: 0;
    }
    .enterprise-detail-tabs__tab {
      display: inline-flex;
      align-items: center;
      gap: var(--mpa-spacing-xs);
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      margin-bottom: -1px;
      border: 0;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--mpa-color-text-muted);
      font: inherit;
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-medium);
      cursor: pointer;
      border-radius: var(--mpa-radius-sm) var(--mpa-radius-sm) 0 0;
    }
    .enterprise-detail-tabs__tab[aria-selected='true'] {
      color: var(--mpa-color-text);
      border-bottom-color: var(--mpa-color-primary);
    }
    .enterprise-detail-tabs__tab:hover:not(:disabled) {
      color: var(--mpa-color-text);
      background: var(--mpa-color-surface-muted);
    }
    .enterprise-detail-tabs__tab:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .enterprise-detail-tabs__mobile {
      display: none;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-detail-tabs__mobile-label {
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--mpa-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .enterprise-detail-tabs__select {
      width: 100%;
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text);
      font: inherit;
    }
    @media (max-width: 640px) {
      .enterprise-detail-tabs__list {
        display: none;
      }
      .enterprise-detail-tabs__mobile {
        display: flex;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDetailTabsComponent {
  readonly tabs = input.required<readonly EnterpriseDetailTab[]>();
  readonly activeTabId = input.required<string>();
  readonly ariaLabel = input('Detail sections');
  readonly idPrefix = input('detail');

  readonly tabChange = output<string>();

  readonly enabledTabs = computed(() => this.tabs().filter((t) => !t.disabled));

  tabId(id: string): string {
    return `${this.idPrefix()}-tab-${id}`;
  }

  panelId(id: string): string {
    return `${this.idPrefix()}-panel-${id}`;
  }

  select(id: string): void {
    if (id !== this.activeTabId()) {
      this.tabChange.emit(id);
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const enabled = this.enabledTabs();
    if (!enabled.length) {
      return;
    }
    let next = -1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (index + 1) % enabled.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (index - 1 + enabled.length) % enabled.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = enabled.length - 1;
    }
    if (next < 0) {
      return;
    }
    event.preventDefault();
    this.select(enabled[next].id);
  }
}
