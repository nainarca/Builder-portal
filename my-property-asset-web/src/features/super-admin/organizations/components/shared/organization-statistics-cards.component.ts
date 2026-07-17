import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  EnterpriseDashboardKpiStripComponent,
  EnterpriseKpiPrimaryComponent,
} from '@shared/ui';

export interface OrganizationStatItem {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
}

@Component({
  selector: 'app-org-statistics-cards',
  imports: [EnterpriseDashboardKpiStripComponent, EnterpriseKpiPrimaryComponent],
  template: `
    <app-enterprise-dashboard-kpi-strip ariaLabel="Statistics">
      @for (stat of stats(); track stat.label) {
        <app-enterprise-kpi-primary
          [label]="stat.label"
          [value]="stat.value"
          [hint]="stat.hint"
        />
      }
    </app-enterprise-dashboard-kpi-strip>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationStatisticsCardsComponent {
  readonly stats = input.required<readonly OrganizationStatItem[]>();
}
