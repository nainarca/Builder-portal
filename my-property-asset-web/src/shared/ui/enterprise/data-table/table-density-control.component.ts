import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { OutlineButtonComponent } from '../buttons/enterprise-button.component';
import type { TableDensity } from './models/enterprise-table.models';

@Component({
  selector: 'app-enterprise-table-density-control',
  imports: [OutlineButtonComponent],
  template: `
    <div class="enterprise-table-density-control" role="group" aria-label="Table density">
      <app-outline-button
        label="Comfortable"
        size="small"
        [disabled]="density() === 'comfortable'"
        (clicked)="densityChange.emit('comfortable')"
      />
      <app-outline-button
        label="Compact"
        size="small"
        [disabled]="density() === 'compact'"
        (clicked)="densityChange.emit('compact')"
      />
    </div>
  `,
  styles: `
    .enterprise-table-density-control {
      display: inline-flex;
      gap: var(--mpa-spacing-xs);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTableDensityControlComponent {
  readonly density = input<TableDensity>('comfortable');

  readonly densityChange = output<TableDensity>();
}
