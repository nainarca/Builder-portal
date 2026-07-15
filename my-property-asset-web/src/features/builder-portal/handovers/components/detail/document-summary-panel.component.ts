import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocumentStoreService } from '../../../documents/services/document-store.service';

@Component({
  selector: 'app-document-summary-panel',
  imports: [RouterLink],
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Document summary</h3>
      @if (totalCount() === 0) {
        <p class="mpa-body-md m-0">No documents linked to this unit yet.</p>
      } @else {
        <dl class="handover-info-panel__list">
          <div class="handover-info-panel__row"><dt>Total documents</dt><dd>{{ totalCount() }}</dd></div>
          <div class="handover-info-panel__row"><dt>Approved</dt><dd>{{ approvedCount() }}</dd></div>
          <div class="handover-info-panel__row"><dt>Pending review</dt><dd>{{ pendingCount() }}</dd></div>
        </dl>
      }
      <a class="handover-grid__view-link" [routerLink]="['/builder-portal/documents']" [queryParams]="{ unitId: unitId() }">
        View unit documents
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentSummaryPanelComponent {
  private readonly documentStore = inject(DocumentStoreService);

  readonly unitId = input.required<string>();

  private readonly unitDocuments = computed(() => this.documentStore.getByUnitId(this.unitId()));

  readonly totalCount = computed(() => this.unitDocuments().length);
  readonly approvedCount = computed(() => this.unitDocuments().filter((d) => d.approvalStatus === 'approved').length);
  readonly pendingCount = computed(() => this.unitDocuments().filter((d) => d.approvalStatus === 'pending-review').length);
}
