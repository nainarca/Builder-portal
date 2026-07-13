import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentCardComponent, ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderInfoPanelComponent } from '../shared/builder-info-panel.component';
import { BuilderStatisticsCardsComponent } from '../shared/builder-statistics-cards.component';
import { BuilderIntegrationPlaceholdersComponent } from './builder-integration-placeholders.component';

@Component({
  selector: 'app-bldr-overview',
  imports: [
    RouterLink,
    ContentSectionComponent,
    SectionHeaderComponent,
    ContentCardComponent,
    BuilderInfoPanelComponent,
    BuilderStatisticsCardsComponent,
    BuilderIntegrationPlaceholdersComponent,
  ],
  template: `
    <div class="bldr-overview">
      <app-bldr-statistics-cards [stats]="stats()" />
      <div class="bldr-overview__grid">
        <app-bldr-info-panel title="Company information" [items]="companyItems()" />
        <app-bldr-info-panel title="Registration & contact" [items]="registrationItems()" />
      </div>
      @if (builder().organizationId) {
        <app-content-section>
          <app-section-header title="Organization link" description="Linked tenant record" />
          <app-content-card icon="sitemap">
            <a [routerLink]="['/super-admin/organizations', builder().organizationId]">{{ builder().organizationName }}</a>
          </app-content-card>
        </app-content-section>
      }
      <app-bldr-integration-placeholders [builder]="builder()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderOverviewComponent {
  readonly builder = input.required<BuilderAdminRecord>();

  readonly stats = computed(() => [
    { label: 'Projects', value: String(this.builder().projectCount), icon: 'pi pi-folder' },
    { label: 'Units', value: String(this.builder().unitCount), icon: 'pi pi-home' },
    { label: 'Owners', value: String(this.builder().ownerCount), icon: 'pi pi-users' },
    { label: 'Contacts', value: String(this.builder().contactCount), icon: 'pi pi-id-card' },
  ]);

  readonly companyItems = computed(() => {
    const b = this.builder();
    const a = b.address;
    return [
      { label: 'Company', value: b.companyName },
      { label: 'Trading name', value: b.tradingName ?? '—' },
      { label: 'Address', value: `${a.street}, ${a.city}, ${a.state} ${a.postalCode}, ${a.country}` },
      { label: 'Region', value: b.region ?? '—' },
      { label: 'Plan', value: b.plan ?? '—' },
    ];
  });

  readonly registrationItems = computed(() => {
    const b = this.builder();
    return [
      { label: 'Registration #', value: b.registrationNumber ?? '—' },
      { label: 'Registered', value: b.registeredAt ?? '—' },
      { label: 'Primary contact', value: b.primaryContactName },
      { label: 'Email', value: b.primaryContactEmail },
      { label: 'Phone', value: b.primaryContactPhone ?? '—' },
    ];
  });
}
