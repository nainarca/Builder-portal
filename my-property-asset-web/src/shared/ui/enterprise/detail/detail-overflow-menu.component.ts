import { ChangeDetectionStrategy, Component, HostListener, input, output, signal } from '@angular/core';

import { IconButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseDetailAction } from './models/enterprise-detail.models';

/** Overflow for secondary / danger detail actions (UI-REBIRTH §5 — one primary + overflow). */
@Component({
  selector: 'app-enterprise-detail-overflow-menu',
  imports: [IconButtonComponent],
  template: `
    <div class="enterprise-detail-overflow" [class.enterprise-detail-overflow--open]="open()">
      <app-icon-button
        label="More actions"
        icon="pi pi-ellipsis-v"
        size="small"
        ariaLabel="More entity actions"
        (clicked)="toggle($event)"
      />
      @if (open()) {
        <div class="enterprise-detail-overflow__menu" role="menu" aria-label="Secondary entity actions">
          @for (action of actions(); track action.id) {
            <button
              type="button"
              class="enterprise-detail-overflow__item mpa-focus-visible"
              [class.enterprise-detail-overflow__item--danger]="action.severity === 'danger'"
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
    .enterprise-detail-overflow {
      position: relative;
      display: inline-flex;
    }
    .enterprise-detail-overflow__menu {
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
      animation: enterprise-detail-overflow-enter var(--mpa-animation-duration-fast)
        var(--mpa-animation-easing-emphasized);
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-detail-overflow__item {
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
    .enterprise-detail-overflow__item:hover:not(:disabled) {
      background: var(--mpa-color-surface-muted);
    }
    .enterprise-detail-overflow__item--danger {
      color: var(--mpa-color-danger);
    }
    .enterprise-detail-overflow__item:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .enterprise-detail-overflow__item:focus-visible {
      outline: 2px solid var(--mpa-color-focus);
      outline-offset: 2px;
    }
    @keyframes enterprise-detail-overflow-enter {
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
export class EnterpriseDetailOverflowMenuComponent {
  readonly actions = input<readonly EnterpriseDetailAction[]>([]);
  readonly actionClick = output<string>();
  readonly open = signal(false);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.open()) {
      this.open.set(false);
    }
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update((v) => !v);
  }

  onSelect(id: string): void {
    this.open.set(false);
    this.actionClick.emit(id);
  }
}
