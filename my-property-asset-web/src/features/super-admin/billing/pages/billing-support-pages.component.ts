import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '@shared/ui';
import { BillAlertsPanelComponent } from '../components/alerts';
import { BillLicenseOverviewComponent } from '../components/licenses';
import { BillUsageDashboardComponent } from '../components/usage';
import { BillSectionNavComponent } from '../components/shared';

import { SuperAdminPageComponent } from '../../components/layout';

@Component({
  selector: 'app-billing-licenses-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    BillSectionNavComponent,
    BillLicenseOverviewComponent,
  ],
  template: `
    <app-sa-page>
      <div class="bill-page">
        <app-enterprise-form-page-header
          eyebrow="Licenses"
          title="License pools"
          subtitle="Seat and license utilization across builders."
          mode="view"
        />
        <app-bill-section-nav />
        <app-bill-license-overview />
      </div>
    </app-sa-page>
  `,
  styles: `.bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingLicensesPageComponent {}

@Component({
  selector: 'app-billing-usage-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    BillSectionNavComponent,
    BillUsageDashboardComponent,
  ],
  template: `
    <app-sa-page>
      <div class="bill-page">
        <app-enterprise-form-page-header
          eyebrow="Usage"
          title="Usage dashboard"
          subtitle="Commercial usage signals across the platform."
          mode="view"
        />
        <app-bill-section-nav />
        <app-bill-usage-dashboard />
      </div>
    </app-sa-page>
  `,
  styles: `.bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingUsagePageComponent {}

@Component({
  selector: 'app-billing-alerts-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    BillSectionNavComponent,
    BillAlertsPanelComponent,
  ],
  template: `
    <app-sa-page>
      <div class="bill-page">
        <app-enterprise-form-page-header
          eyebrow="Alerts"
          title="Commercial alerts"
          subtitle="Trial expiry, renewals, and payment reminders."
          mode="view"
        />
        <app-bill-section-nav />
        <app-bill-alerts-panel />
      </div>
    </app-sa-page>
  `,
  styles: `.bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingAlertsPageComponent {}
