import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { IconButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseTableRowAction } from './models/enterprise-table.models';

/** P0.1 §6.4 — max one icon + overflow menu per row. */
@Component({
  selector: 'app-enterprise-table-row-actions',
  imports: [IconButtonComponent],
  template: `
    <div class="enterprise-table-row-actions" role="group" [attr.aria-label]="ariaLabel()">
      @if (primaryAction(); as primary) {
        <app-icon-button
          [label]="primary.label"
          [icon]="primary.icon || 'pi pi-eye'"
          size="small"
          [disabled]="primary.disabled ?? false"
          (clicked)="actionClick.emit(primary.id)"
        />
      }
      @if (overflowActions().length > 0) {
        <div class="enterprise-table-row-actions__overflow">
          <app-icon-button
            label="More actions"
            icon="pi pi-ellipsis-v"
            size="small"
            [ariaLabel]="'More actions'"
            (clicked)="toggleMenu($event)"
          />
          @if (menuOpen()) {
            <div
              class="enterprise-table-row-actions__menu"
              role="menu"
              (keydown.escape)="closeMenu()"
            >
              @for (action of overflowActions(); track action.id) {
                <button
                  type="button"
                  class="enterprise-table-row-actions__menu-item"
                  role="menuitem"
                  [disabled]="action.disabled"
                  (click)="onMenuAction(action.id)"
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
      }
    </div>
  `,
  styles: `
    .enterprise-table-row-actions {
      display: inline-flex;
      align-items: center;
      gap: var(--mpa-spacing-xs);
      justify-content: flex-end;
    }
    .enterprise-table-row-actions__overflow {
      position: relative;
    }
    .enterprise-table-row-actions__menu {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: var(--mpa-z-index-dropdown, 200);
      min-width: 10rem;
      margin-top: var(--mpa-spacing-xs);
      padding: var(--mpa-spacing-xs);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-elevated, var(--mpa-color-surface));
      box-shadow: var(--mpa-shadow-md, 0 4px 12px rgb(15 23 42 / 12%));
    }
    .enterprise-table-row-actions__menu-item {
      display: flex;
      width: 100%;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      padding: var(--mpa-spacing-sm);
      border: 0;
      border-radius: var(--mpa-radius-sm);
      background: transparent;
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm);
      text-align: left;
      cursor: pointer;
    }
    .enterprise-table-row-actions__menu-item:hover:not(:disabled) {
      background: var(--mpa-color-surface-muted);
    }
    .enterprise-table-row-actions__menu-item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableRowActionsComponent {
  readonly actions = input<readonly EnterpriseTableRowAction[]>([]);
  readonly ariaLabel = input('Row actions');

  readonly actionClick = output<string>();

  readonly menuOpen = signal(false);

  primaryAction(): EnterpriseTableRowAction | undefined {
    return this.actions().find((action) => action.visible !== false);
  }

  overflowActions(): EnterpriseTableRowAction[] {
    const visible = this.actions().filter((action) => action.visible !== false);
    return visible.slice(1);
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onMenuAction(actionId: string): void {
    this.actionClick.emit(actionId);
    this.closeMenu();
  }
}
