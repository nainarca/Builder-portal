import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

import {
  WlBrandHealthCardComponent,
  WlBrandOverviewComponent,
  WlBrandQuickActionsComponent,
  WlRecentChangesComponent,
} from '../components/dashboard';
import { WlBrandCardComponent, WlSectionNavComponent } from '../components/shared';
import { BrandAdminStoreService } from '../services/brand-admin-store.service';
import { BrandStudioStateService } from '../services/brand-studio-state.service';

@Component({
  selector: 'app-brand-dashboard-page',
  imports: [
    BasePageComponent, PageHeaderComponent, WlSectionNavComponent,
    WlBrandOverviewComponent, WlBrandHealthCardComponent, WlBrandQuickActionsComponent,
    WlRecentChangesComponent, WlBrandCardComponent,
  ],
  template: `
    <app-base-page>
      <div class="wl-page">
        <app-page-header eyebrow="Super Admin" title="Brand Experience Center"
          description="White-label branding, themes, and visual identity for the platform and tenants." />
        <app-wl-section-nav />
        <app-wl-brand-overview />
        <div class="wl-dashboard-grid">
          <div class="wl-dashboard-grid__main">
            <section class="wl-dashboard-brands">
              <h2 class="mpa-heading-sm">Brand profiles</h2>
              <div class="wl-dashboard-brands__grid">
                @for (brand of store.brands(); track brand.id) {
                  <app-wl-brand-card [brand]="brand" (selectBrand)="openStudio($event)" />
                }
              </div>
            </section>
            <app-wl-recent-changes />
          </div>
          <aside class="wl-dashboard-grid__aside">
            <app-wl-brand-health-card [score]="store.getDefault().healthScore" title="Platform brand health" />
            <app-wl-brand-quick-actions />
          </aside>
        </div>
      </div>
    </app-base-page>
  `,
  styleUrl: './brand-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandDashboardPageComponent {
  readonly store = inject(BrandAdminStoreService);
  private readonly studio = inject(BrandStudioStateService);
  private readonly router = inject(Router);

  openStudio(brandId: string): void {
    this.studio.selectBrand(brandId);
    void this.router.navigate(['/super-admin/branding/studio']);
  }
}
