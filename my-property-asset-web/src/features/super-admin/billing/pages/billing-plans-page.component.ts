import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '@shared/ui';
import { BillPlanCatalogComponent, BillUpgradeInsightsComponent } from '../components/plans';
import { BillSectionNavComponent } from '../components/shared';
import { PlanAdminPanelComponent } from '../components/plans/plan-admin-panel.component';

import { SuperAdminPageComponent } from '../../components/layout';

@Component({
  selector: 'app-billing-plans-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    BillSectionNavComponent,
    BillPlanCatalogComponent,
    BillUpgradeInsightsComponent,
    PlanAdminPanelComponent,
  ],
  template: `
    <app-sa-page>
      <div class="bill-page">
        <app-enterprise-form-page-header
          eyebrow="Plans"
          title="Plan catalog"
          subtitle="Create, edit, deactivate, and assign commercial plans to builder organizations."
          mode="view"
        />
        <app-bill-section-nav />
        <app-plan-admin-panel />
        <app-bill-plan-catalog />
        <app-bill-upgrade-insights />
      </div>
    </app-sa-page>
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
