import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ContentCardComponent, ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationInfoPanelComponent } from '../shared/organization-info-panel.component';
import { OrganizationStatisticsCardsComponent } from '../shared/organization-statistics-cards.component';

@Component({
  selector: 'app-org-overview',
  imports: [
    ContentSectionComponent,
    SectionHeaderComponent,
    ContentCardComponent,
    OrganizationInfoPanelComponent,
    OrganizationStatisticsCardsComponent,
  ],
  template: `
    <div class="org-overview">
      <app-org-statistics-cards [stats]="stats()" />

      <div class="org-overview__grid">
        <app-org-info-panel title="Profile" [items]="profileItems()" />
        <app-content-section>
          <app-section-header title="Subscription summary" description="Framework placeholder" />
          <app-content-card icon="credit-card">
            <p class="org-overview__subscription-tier">{{ org().subscriptionTier }}</p>
            <p class="org-overview__subscription-status">Status: {{ org().subscriptionStatus }}</p>
            <p class="mpa-body-md m-0">Billing integration will connect in a future module.</p>
          </app-content-card>
        </app-content-section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationOverviewComponent {
  readonly org = input.required<OrganizationAdminRecord>();

  readonly stats = computed(() => [
    { label: 'Members', value: String(this.org().memberCount), icon: 'pi pi-users' },
    { label: 'Projects', value: String(this.org().projectCount), icon: 'pi pi-folder' },
    { label: 'Plan', value: this.org().plan ?? '—', icon: 'pi pi-tag' },
    { label: 'Region', value: this.org().region ?? '—', icon: 'pi pi-globe' },
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
