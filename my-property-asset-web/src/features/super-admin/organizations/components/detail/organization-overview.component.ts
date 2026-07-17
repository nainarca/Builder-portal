import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  ContentCardComponent,
  EnterpriseDashboardKpiStripComponent,
  EnterpriseKpiPrimaryComponent,
  EnterpriseSectionHeaderComponent,
} from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationInfoPanelComponent } from '../shared/organization-info-panel.component';

@Component({
  selector: 'app-org-overview',
  imports: [
    EnterpriseDashboardKpiStripComponent,
    EnterpriseKpiPrimaryComponent,
    EnterpriseSectionHeaderComponent,
    OrganizationInfoPanelComponent,
    ContentCardComponent,
  ],
  template: `
    <div class="org-overview">
      <app-enterprise-dashboard-kpi-strip ariaLabel="Organization statistics">
        @for (stat of stats(); track stat.label) {
          <app-enterprise-kpi-primary
            [label]="stat.label"
            [value]="stat.value"
            [hint]="stat.hint"
          />
        }
      </app-enterprise-dashboard-kpi-strip>

      <div class="org-overview__grid">
        <section class="org-overview__section" aria-label="Organization profile">
          <app-enterprise-section-header
            title="Profile"
            description="Contact and identification metadata"
          />
          <app-org-info-panel title="Profile" [items]="profileItems()" />
        </section>

        <section class="org-overview__section" aria-label="Subscription summary">
          <app-enterprise-section-header
            title="Subscription summary"
            description="Commercial relationship overview"
          />
          <app-content-card icon="credit-card">
            <p class="org-overview__subscription-tier">{{ org().subscriptionTier }}</p>
            <p class="org-overview__subscription-status">Status: {{ org().subscriptionStatus }}</p>
            <p class="mpa-body-md m-0">Billing integration connects in the commercial module.</p>
          </app-content-card>
        </section>
      </div>
    </div>
  `,
  styles: `
    .org-overview {
      display: grid;
      gap: var(--mpa-spacing-xl);
    }

    .org-overview__grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--mpa-spacing-xl);
    }

    .org-overview__section {
      display: grid;
      gap: var(--mpa-spacing-md);
    }

    .org-overview__subscription-tier {
      margin: 0;
      font-size: var(--mpa-font-size-xl);
      font-weight: var(--mpa-font-weight-semibold);
    }

    .org-overview__subscription-status {
      margin: 0.25rem 0 var(--mpa-spacing-md);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm);
    }

    @media (max-width: 1024px) {
      .org-overview__grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationOverviewComponent {
  readonly org = input.required<OrganizationAdminRecord>();

  readonly stats = computed(() => [
    { label: 'Members', value: String(this.org().memberCount), hint: 'Active accounts' },
    { label: 'Projects', value: String(this.org().projectCount), hint: 'Portfolio size' },
    { label: 'Plan', value: this.org().plan ?? '—', hint: 'Commercial tier' },
    { label: 'Region', value: this.org().region ?? '—', hint: 'Operating region' },
  ]);

  readonly profileItems = computed(() => {
    const org = this.org();
    return [
      { label: 'Contact', value: org.contactName ?? '—' },
      { label: 'Email', value: org.contactEmail ?? '—' },
      { label: 'Slug', value: org.slug ?? '—' },
      { label: 'Description', value: org.description ?? '—' },
    ];
  });
}
