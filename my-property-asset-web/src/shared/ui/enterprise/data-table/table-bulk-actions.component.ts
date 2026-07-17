import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import {
  DangerButtonComponent,
  GhostButtonComponent,
  OutlineButtonComponent,
} from '../buttons/enterprise-button.component';
import type { EnterpriseTableBulkAction } from './models/enterprise-table.models';

/** P0.1 §6.3 — bulk bar replaces toolbar position when rows are selected. */
@Component({
  selector: 'app-enterprise-table-bulk-actions',
  imports: [
    OutlineButtonComponent,
    DangerButtonComponent,
    GhostButtonComponent,
  ],
  template: `
    @if (selectedCount() > 0) {
      <div
        class="enterprise-table-bulk-actions"
        role="toolbar"
        [attr.aria-label]="ariaLabel()"
        aria-live="polite"
      >
        <span class="enterprise-table-bulk-actions__count">
          {{ selectionSummary() }}
        </span>
        <div class="enterprise-table-bulk-actions__actions">
          @for (action of actions(); track action.id) {
            @if (action.severity === 'danger') {
              <app-danger-button
                [label]="action.label"
                [icon]="action.icon"
                size="small"
                [disabled]="action.disabled ?? false"
                (clicked)="actionClick.emit(action.id)"
              />
            } @else {
              <app-outline-button
                [label]="action.label"
                [icon]="action.icon"
                size="small"
                [disabled]="action.disabled ?? false"
                (clicked)="actionClick.emit(action.id)"
              />
            }
          }
          <ng-content />
        </div>
        <app-ghost-button
          label="Clear selection"
          icon="pi pi-times"
          size="small"
          (clicked)="clearSelection.emit()"
        />
      </div>
    }
  `,
  styles: `
    .enterprise-table-bulk-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface-muted);
    }
    .enterprise-table-bulk-actions__count {
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-table-bulk-actions__actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-xs);
      flex: 1;
    }
    @media (max-width: 640px) {
      .enterprise-table-bulk-actions__actions {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableBulkActionsComponent {
  readonly selectedCount = input(0);
  readonly totalCount = input(0);
  readonly actions = input<readonly EnterpriseTableBulkAction[]>([]);
  readonly ariaLabel = input('Bulk actions');

  readonly actionClick = output<string>();
  readonly clearSelection = output<void>();

  selectionSummary(): string {
    const selected = this.selectedCount();
    const total = this.totalCount();
    if (total > 0) {
      return `${selected} of ${total} selected`;
    }
    return `${selected} selected`;
  }
}
