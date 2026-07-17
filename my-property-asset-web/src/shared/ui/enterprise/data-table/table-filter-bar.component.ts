import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ChipComponent } from '../../primitives/chip/chip.component';
import { GhostButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseTableFilterChip } from './models/enterprise-table.models';

@Component({
  selector: 'app-enterprise-table-filter-bar',
  imports: [ChipComponent, GhostButtonComponent],
  template: `
    @if (chips().length > 0 || showClearAll()) {
      <div
        class="enterprise-table-filter-bar"
        role="region"
        [attr.aria-label]="ariaLabel()"
        aria-live="polite"
      >
        @if (resultSummary()) {
          <span class="enterprise-table-filter-bar__summary">{{ resultSummary() }}</span>
        }
        <div class="enterprise-table-filter-bar__chips">
          @for (chip of chips(); track chip.id) {
            <app-chip
              [label]="chip.label"
              [removable]="chip.removable !== false"
              (removed)="chipRemove.emit(chip.id)"
            />
          }
        </div>
        @if (showClearAll() && chips().length > 0) {
          <app-ghost-button
            label="Clear all filters"
            icon="pi pi-filter-slash"
            size="small"
            (clicked)="clearAll.emit()"
          />
        }
      </div>
    }
  `,
  styles: `
    .enterprise-table-filter-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      margin-top: var(--mpa-spacing-sm);
    }
    .enterprise-table-filter-bar__summary {
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-table-filter-bar__chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableFilterBarComponent {
  readonly chips = input<readonly EnterpriseTableFilterChip[]>([]);
  readonly resultSummary = input<string | undefined>(undefined);
  readonly showClearAll = input(true);
  readonly ariaLabel = input('Active filters');

  readonly chipRemove = output<string>();
  readonly clearAll = output<void>();
}
