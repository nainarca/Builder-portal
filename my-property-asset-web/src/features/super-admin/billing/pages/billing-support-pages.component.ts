import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';
import { BillAlertsPanelComponent } from '../components/alerts';
import { BillLicenseOverviewComponent } from '../components/licenses';
import { BillUsageDashboardComponent } from '../components/usage';
import { BillSectionNavComponent } from '../components/shared';

@Component({
  selector: 'app-billing-licenses-page',
  imports: [BasePageComponent, PageHeaderComponent, BillSectionNavComponent, BillLicenseOverviewComponent],
  template: `
    <app-base-page>
      <div class="bill-page">
        <app-page-header eyebrow="Licenses" title="License pools" description="Seat and license utilization across builders." />
        <app-bill-section-nav />
        <app-bill-license-overview />
      </div>
    </app-base-page>
  `,
  styles: `.bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingLicensesPageComponent {}

@Component({
  selector: 'app-billing-usage-page',
  imports: [BasePageComponent, PageHeaderComponent, BillSectionNavComponent, BillUsageDashboardComponent],
  template: `
    <app-base-page>
      <div class="bill-page">
        <app-page-header eyebrow="Usage" title="Usage dashboard" description="Commercial usage signals across the platform." />
        <app-bill-section-nav />
        <app-bill-usage-dashboard />
      </div>
    </app-base-page>
  `,
  styles: `.bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingUsagePageComponent {}

@Component({
  selector: 'app-billing-alerts-page',
  imports: [BasePageComponent, PageHeaderComponent, BillSectionNavComponent, BillAlertsPanelComponent],
  template: `
    <app-base-page>
      <div class="bill-page">
        <app-page-header eyebrow="Alerts" title="Commercial alerts" description="Trial expiry, renewals, and payment reminders." />
        <app-bill-section-nav />
        <app-bill-alerts-panel />
      </div>
    </app-base-page>
  `,
  styles: `.bill-page { display: grid; gap: var(--mpa-spacing-lg, 1.5rem); }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingAlertsPageComponent {}
