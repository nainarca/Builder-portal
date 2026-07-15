import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';

import { TextareaComponent } from '@shared/ui';

import { InspectionStoreService } from '../../services/inspection-store.service';
import { ChecklistItem, ChecklistItemStatus } from '../../models/inspection.model';

@Component({
  selector: 'app-checklist-item',
  imports: [TextareaComponent],
  template: `
    <div class="checklist-item" [class.checklist-item--mandatory]="item().mandatory">
      <div class="checklist-item__header">
        <span class="checklist-item__label">{{ item().label }}</span>
        <span class="checklist-item__flag" [class.checklist-item__flag--mandatory]="item().mandatory">
          {{ item().mandatory ? 'Mandatory' : 'Optional' }}
        </span>
      </div>

      <div class="checklist-item__controls" role="group" [attr.aria-label]="item().label + ' status'">
        <button
          type="button"
          class="checklist-item__status-btn checklist-item__status-btn--pass"
          [class.checklist-item__status-btn--active]="item().status === 'passed'"
          (click)="setStatus('passed')"
        >
          <i class="pi pi-check" aria-hidden="true"></i> Pass
        </button>
        <button
          type="button"
          class="checklist-item__status-btn checklist-item__status-btn--fail"
          [class.checklist-item__status-btn--active]="item().status === 'failed'"
          (click)="setStatus('failed')"
        >
          <i class="pi pi-times" aria-hidden="true"></i> Fail
        </button>
        <button
          type="button"
          class="checklist-item__status-btn checklist-item__status-btn--na"
          [class.checklist-item__status-btn--active]="item().status === 'not-applicable'"
          (click)="setStatus('not-applicable')"
        >
          N/A
        </button>
      </div>

      @if (item().status === 'failed' || item().remarks || showRemarks()) {
        <app-textarea
          class="checklist-item__remarks"
          [value]="item().remarks ?? ''"
          [rows]="2"
          placeholder="Add remarks…"
          ariaLabel="Remarks for {{ item().label }}"
          (valueChange)="onRemarksChange($event)"
        />
      } @else {
        <button type="button" class="checklist-item__add-remarks" (click)="showRemarks.set(true)">
          <i class="pi pi-plus" aria-hidden="true"></i> Add remarks
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistItemComponent {
  private readonly store = inject(InspectionStoreService);

  readonly item = input.required<ChecklistItem>();
  readonly sectionId = input.required<string>();
  readonly inspectionId = input.required<string>();

  readonly showRemarks = signal(false);

  setStatus(status: ChecklistItemStatus): void {
    this.store.updateItemStatus(this.inspectionId(), this.sectionId(), this.item().id, status, this.item().remarks);
  }

  onRemarksChange(value: string): void {
    this.store.updateItemStatus(this.inspectionId(), this.sectionId(), this.item().id, this.item().status, value);
  }
}
