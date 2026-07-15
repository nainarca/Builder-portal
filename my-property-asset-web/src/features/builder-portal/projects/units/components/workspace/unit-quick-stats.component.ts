import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { KpiCardComponent } from '../../../../components/cards';
import { DashboardKpiItem } from '../../../../models/dashboard.model';

@Component({
  selector: 'app-unit-quick-stats',
  imports: [KpiCardComponent],
  template: `
    <section class="unit-quick-stats" aria-label="Unit quick statistics">
      @for (stat of stats(); track stat.id) {
        <app-bp-kpi-card [item]="stat" />
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitQuickStatsComponent {
  readonly stats = input.required<readonly DashboardKpiItem[]>();
}
