import { ChangeDetectionStrategy, Component, HostListener, input, output, signal } from '@angular/core';

import { IconButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseTableSecondaryAction } from './models/enterprise-table.models';

/**
 * Toolbar overflow for secondary list actions (Import, Advanced filters, Refresh…).
 * Keeps exactly one primary action in the page header (UI-REBIRTH §4 / §6 / §20 #5).
 */
@Component({
  selector: 'app-enterprise-table-overflow-menu',
  imports: [IconButtonComponent],
  template: `
    <div class="enterprise-table-overflow" [class.enterprise-table-overflow--open]="open()">
      <app-icon-button
        label="More list actions"
        icon="pi pi-ellipsis-v"
        size="small"
        ariaLabel="More list actions"
        (clicked)="toggle($event)"
      />
      @if (open()) {
        <div
          class="enterprise-table-overflow__menu"
          role="menu"
          aria-label="Secondary list actions"
        >
          @for (action of actions(); track action.id) {
            <button
              type="button"
              class="enterprise-table-overflow__item mpa-focus-visible"
              role="menuitem"
              [disabled]="action.disabled ?? false"
              (click)="onSelect(action.id)"
            >
              @if (action.icon) {
                <i [class]="action.icon" aria-hidden="true"></i>
              }
              {{ action.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-table-overflow {
      position: relative;
      display: inline-flex;
    }
    .enterprise-table-overflow__menu {
      position: absolute;
      top: calc(100% + var(--mpa-spacing-xs));
      right: 0;
      z-index: var(--mpa-z-index-dropdown, 200);
      min-width: 12rem;
      padding: var(--mpa-spacing-xs);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-elevated, var(--mpa-color-surface));
      box-shadow: var(--mpa-elevation-md);
      animation: enterprise-table-overflow-enter var(--mpa-animation-duration-fast)
        var(--mpa-animation-easing-emphasized);
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-table-overflow__item {
      display: flex;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      width: 100%;
      padding: var(--mpa-spacing-sm) var(--mpa-spacing-md);
      border: 0;
      border-radius: var(--mpa-radius-sm);
      background: transparent;
      color: var(--mpa-color-text);
      font: inherit;
      font-size: var(--mpa-font-size-sm);
      text-align: left;
      cursor: pointer;
    }
    .enterprise-table-overflow__item:hover:not(:disabled) {
      background: var(--mpa-color-surface-muted);
    }
    .enterprise-table-overflow__item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .enterprise-table-overflow__item:focus-visible {
      outline: 2px solid var(--mpa-color-focus);
      outline-offset: 2px;
    }
    @keyframes enterprise-table-overflow-enter {
      from {
        opacity: 0;
        transform: translateY(calc(var(--mpa-spacing-xs) * -1));
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableOverflowMenuComponent {
  readonly actions = input<readonly EnterpriseTableSecondaryAction[]>([]);

  readonly actionClick = output<string>();

  readonly open = signal(false);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((value) => !value);
  }

  onSelect(id: string): void {
    this.open.set(false);
    this.actionClick.emit(id);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }
}
