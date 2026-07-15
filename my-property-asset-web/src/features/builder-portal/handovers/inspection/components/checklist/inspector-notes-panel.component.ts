import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { TextareaComponent } from '@shared/ui';

import { InspectionStoreService } from '../../services/inspection-store.service';

@Component({
  selector: 'app-inspector-notes-panel',
  imports: [TextareaComponent],
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Inspector notes</h3>
      <app-textarea
        [value]="notes() ?? ''"
        [rows]="4"
        placeholder="Add inspector notes for this category…"
        ariaLabel="Inspector notes"
        (valueChange)="onChange($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectorNotesPanelComponent {
  private readonly store = inject(InspectionStoreService);

  readonly inspectionId = input.required<string>();
  readonly notes = input<string | undefined>(undefined);

  onChange(value: string): void {
    this.store.updateInspectorNotes(this.inspectionId(), value);
  }
}
