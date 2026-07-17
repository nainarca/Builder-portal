import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { PaginationWrapperComponent } from '../../composites/data-display/pagination-wrapper.component';
import type { EnterpriseTablePaginationState } from './models/enterprise-table.models';

/** P0.1 §6.7 — numbered pagination with row summary. */
@Component({
  selector: 'app-enterprise-table-pagination',
  imports: [PaginationWrapperComponent],
  template: `
    <div class="enterprise-table-pagination" role="navigation" aria-label="Table pagination">
      @if (showSummary()) {
        <span class="enterprise-table-pagination__summary">{{ summaryText() }}</span>
      }
      <app-pagination-wrapper
        [rows]="pagination().pageSize"
        [totalRecords]="pagination().totalRecords"
        [first]="pagination().first"
        [rowsPerPageOptions]="rowsPerPageOptions()"
        (pageChange)="pageChange.emit($event)"
      />
    </div>
  `,
  styles: `
    .enterprise-table-pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--mpa-spacing-md);
      margin-top: var(--mpa-spacing-md);
    }
    .enterprise-table-pagination__summary {
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    @media (max-width: 640px) {
      .enterprise-table-pagination {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTablePaginationComponent {
  readonly pagination = input<EnterpriseTablePaginationState>({
    page: 1,
    pageSize: 10,
    totalRecords: 0,
    first: 0,
  });
  readonly rowsPerPageOptions = input<number[]>([10, 25, 50, 100]);
  readonly showSummary = input(true);

  readonly pageChange = output<unknown>();

  summaryText(): string {
    const { first, pageSize, totalRecords } = this.pagination();
    if (totalRecords === 0) {
      return 'No records';
    }
    const from = first + 1;
    const to = Math.min(first + pageSize, totalRecords);
    return `Showing ${from}–${to} of ${totalRecords}`;
  }
}
