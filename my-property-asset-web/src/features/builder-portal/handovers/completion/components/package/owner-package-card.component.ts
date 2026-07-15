import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CheckboxComponent } from '@shared/ui';

import { DocumentStoreService } from '../../../../documents/services/document-store.service';
import { WARRANTY_TERMS } from '../../config/completion.config';
import { CompletionStoreService } from '../../services/completion-store.service';

@Component({
  selector: 'app-owner-package-card',
  imports: [CheckboxComponent],
  template: `
    <div class="handover-info-panel owner-package-card">
      <h3 class="handover-info-panel__title">Owner delivery package</h3>

      <section class="owner-package-card__section">
        <h4 class="owner-package-card__section-title">Delivered documents</h4>
        @if (deliveredDocuments().length === 0) {
          <p class="mpa-body-md m-0">No owner-visible approved documents yet.</p>
        } @else {
          <ul class="owner-package-card__doc-list">
            @for (doc of deliveredDocuments(); track doc.id) {
              <li>{{ doc.name }}</li>
            }
          </ul>
        }
      </section>

      <section class="owner-package-card__section">
        <h4 class="owner-package-card__section-title">Warranty summary</h4>
        <dl class="handover-info-panel__list">
          @for (term of warrantyTerms; track term.id) {
            <div class="handover-info-panel__row"><dt>{{ term.label }}</dt><dd>{{ term.period }}</dd></div>
          }
        </dl>
      </section>

      <section class="owner-package-card__section">
        <h4 class="owner-package-card__section-title">Keys &amp; assets checklist</h4>
        <div class="owner-package-card__checklist">
          @for (item of keysAssets(); track item.id) {
            <app-checkbox [checked]="item.handedOver" [label]="item.label" (checkedChange)="onToggle(item.id)" />
          }
        </div>
      </section>

      <section class="owner-package-card__section">
        <h4 class="owner-package-card__section-title">Maintenance guide</h4>
        <p class="mpa-body-md m-0">The unit maintenance guide will be available as a downloadable document in a future integration.</p>
      </section>

      <div class="owner-package-card__download-placeholder">
        <i class="pi pi-download" aria-hidden="true"></i>
        <span>Download summary (ZIP of the full owner package) will be available in a future integration.</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerPackageCardComponent {
  private readonly documentStore = inject(DocumentStoreService);
  private readonly completionStore = inject(CompletionStoreService);

  readonly handoverId = input.required<string>();
  readonly unitId = input.required<string>();

  readonly warrantyTerms = WARRANTY_TERMS;

  readonly deliveredDocuments = computed(() =>
    this.documentStore
      .getByUnitId(this.unitId())
      .filter((d) => d.visibility === 'owner-visible' && d.approvalStatus === 'approved'),
  );

  readonly keysAssets = computed(() => this.completionStore.getByHandoverId(this.handoverId())?.keysAssets ?? []);

  onToggle(itemId: string): void {
    this.completionStore.toggleKeyAsset(this.handoverId(), itemId);
  }
}
