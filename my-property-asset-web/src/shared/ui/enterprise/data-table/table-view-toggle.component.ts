import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { OutlineButtonComponent } from '../buttons/enterprise-button.component';
import type { EnterpriseTableViewMode } from './models/enterprise-table.models';

@Component({
  selector: 'app-enterprise-table-view-toggle',
  imports: [OutlineButtonComponent],
  template: `
    <div class="enterprise-table-view-toggle" role="group" aria-label="View mode">
      <app-outline-button
        label="Table"
        icon="pi pi-table"
        size="small"
        [disabled]="mode() === 'table'"
        (clicked)="modeChange.emit('table')"
      />
      <app-outline-button
        label="Cards"
        icon="pi pi-th-large"
        size="small"
        [disabled]="mode() === 'card'"
        (clicked)="modeChange.emit('card')"
      />
    </div>
  `,
  styles: `
    .enterprise-table-view-toggle {
      display: inline-flex;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableViewToggleComponent {
  readonly mode = input<EnterpriseTableViewMode>('table');

  readonly modeChange = output<EnterpriseTableViewMode>();
}
