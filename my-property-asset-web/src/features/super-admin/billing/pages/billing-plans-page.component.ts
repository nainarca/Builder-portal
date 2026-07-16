import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';
import { BillPlanCatalogComponent, BillUpgradeInsightsComponent } from '../components/plans';
import { BillSectionNavComponent } from '../components/shared';
import { PlanAdminPanelComponent } from '../components/plans/plan-admin-panel.component';

@Component({
  selector: 'app-billing-plans-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    BillSectionNavComponent,
    BillPlanCatalogComponent,
    BillUpgradeInsightsComponent,
    PlanAdminPanelComponent,
  ],
  template: `
    <app-base-page>
      <div class="bill-page">
        <app-page-header
          eyebrow="Plans"
          title="Plan catalog"
          description="Create, edit, deactivate, and assign commercial plans to builder organizations."
        />
        <app-bill-section-nav />
        <app-plan-admin-panel />
        <app-bill-plan-catalog />
        <app-bill-upgrade-insights />
      </div>
    </app-base-page>
  `,
  styles: `
    .bill-page {
      display: grid;
      gap: var(--mpa-spacing-lg, 1.5rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPlansPageComponent {}
