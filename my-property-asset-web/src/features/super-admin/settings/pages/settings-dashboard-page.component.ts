import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

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
    BasePageComponent,
    PageHeaderComponent,
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
    <app-base-page>
      <div class="cfg-page">
        <app-page-header
          eyebrow="Super Admin"
          title="Platform Configuration Center"
          description="Manage platform settings, security policies, feature flags, and system preferences."
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
    </app-base-page>
  `,
  styleUrl: './settings-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDashboardPageComponent {}
