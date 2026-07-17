import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';
import {
  CfgCategoryGridComponent,
  CfgFavoritesPanelComponent,
  CfgPinnedSettingsComponent,
  CfgQuickActionsComponent,
  CfgRecentUpdatesComponent,
  CfgSettingsOverviewComponent,
} from '../components/dashboard';
import { CfgSectionNavComponent, CfgSettingsSearchComponent } from '../components/shared';

@Component({
  selector: 'app-settings-dashboard-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    CfgSectionNavComponent,
    CfgSettingsSearchComponent,
    CfgSettingsOverviewComponent,
    CfgCategoryGridComponent,
    CfgRecentUpdatesComponent,
    CfgQuickActionsComponent,
    CfgFavoritesPanelComponent,
    CfgPinnedSettingsComponent,
  ],
  template: `
    <app-sa-page>
      <div class="cfg-page">
        <app-enterprise-form-page-header
          eyebrow="Super Admin"
          title="Platform Configuration Center"
          subtitle="Manage platform settings, security policies, feature flags, and system preferences."
          mode="view"
        />
        <app-cfg-section-nav />
        <div class="cfg-dashboard-toolbar">
          <app-cfg-settings-search />
        </div>
        <app-cfg-settings-overview />
        <div class="cfg-dashboard-grid">
          <div class="cfg-dashboard-grid__main">
            <section>
              <h2 class="mpa-heading-sm">Settings categories</h2>
              <app-cfg-category-grid />
            </section>
            <app-cfg-recent-updates />
          </div>
          <aside class="cfg-dashboard-grid__aside">
            <app-cfg-quick-actions />
            <app-cfg-favorites-panel />
            <app-cfg-pinned-settings />
          </aside>
        </div>
      </div>
    </app-sa-page>
  `,
  styleUrl: './settings-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDashboardPageComponent {}
