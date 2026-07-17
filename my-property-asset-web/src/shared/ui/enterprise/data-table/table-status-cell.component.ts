import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PillComponent } from '../status/enterprise-status.component';

/** P0.1 §6.6 — semantic status pill for table cells. */
@Component({
  selector: 'app-enterprise-table-status-cell',
  imports: [PillComponent],
  template: `
    <app-pill [label]="label()" [severity]="severity()" [icon]="icon()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableStatusCellComponent {
  readonly label = input.required<string>();
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>(
    'secondary',
  );
  readonly icon = input<string | undefined>(undefined);
}
