import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ApprovalStatus } from '../../models/document.model';

@Component({
  selector: 'app-document-quick-filters',
  template: `
    <div class="doc-quick-filters" role="group" aria-label="Quick filters">
      @for (filter of filters; track filter.value) {
        <button
          type="button"
          class="doc-quick-filters__chip"
          [class.doc-quick-filters__chip--active]="selected() === filter.value"
          [attr.aria-pressed]="selected() === filter.value"
          (click)="selectedChange.emit(filter.value)"
        >
          {{ filter.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentQuickFiltersComponent {
  readonly selected = input<ApprovalStatus | 'all'>('all');

  readonly selectedChange = output<ApprovalStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Draft', value: 'draft' as const },
    { label: 'Pending review', value: 'pending-review' as const },
    { label: 'Approved', value: 'approved' as const },
    { label: 'Rejected', value: 'rejected' as const },
  ];
}
