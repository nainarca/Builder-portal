import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { TextareaComponent } from '@shared/ui';

@Component({
  selector: 'app-acceptance-card',
  imports: [TextareaComponent],
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Acceptance notes</h3>
      <p class="mpa-body-md">Internal notes about this handover's review and acceptance — visible to builder admins only.</p>
      <app-textarea
        [value]="notes() ?? ''"
        [rows]="4"
        placeholder="Add acceptance notes…"
        ariaLabel="Acceptance notes"
        (valueChange)="notesChange.emit($event)"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptanceCardComponent {
  readonly notes = input<string | undefined>(undefined);

  readonly notesChange = output<string>();
}
