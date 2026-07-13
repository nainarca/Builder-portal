import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { AuthorizedButtonComponent } from '@core/rbac';
import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import {
  CfgGeneralSettingsPanelComponent,
  CfgIntegrationsSettingsPanelComponent,
  CfgLocalizationSettingsPanelComponent,
  CfgNotificationsSettingsPanelComponent,
  CfgPlatformSettingsPanelComponent,
  CfgSecuritySettingsPanelComponent,
  CfgSystemPreferencesPanelComponent,
} from '../components/sections';
import {
  CfgSectionNavComponent,
  CfgSettingsBreadcrumbComponent,
  CfgSettingsSearchComponent,
  CfgSettingsSidebarComponent,
} from '../components/shared';
import { getCategoryById } from '../config/settings.config';
import { SettingsCategoryId } from '../models/settings-admin.model';
import { SettingsNavigationStateService } from '../services/settings-navigation-state.service';
import { SettingsSectionStateService } from '../services/settings-section-state.service';

@Component({
  selector: 'app-settings-section-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    ButtonComponent,
    AuthorizedButtonComponent,
    CfgSectionNavComponent,
    CfgSettingsSearchComponent,
    CfgSettingsSidebarComponent,
    CfgSettingsBreadcrumbComponent,
    CfgGeneralSettingsPanelComponent,
    CfgSecuritySettingsPanelComponent,
    CfgPlatformSettingsPanelComponent,
    CfgNotificationsSettingsPanelComponent,
    CfgLocalizationSettingsPanelComponent,
    CfgIntegrationsSettingsPanelComponent,
    CfgSystemPreferencesPanelComponent,
  ],
  template: `
    <app-base-page>
      <div class="cfg-page cfg-page--section">
        <app-page-header
          eyebrow="Platform Configuration"
          [title]="sectionTitle()"
          [description]="sectionDescription()"
        >
          <app-authorized-button
            pageActions
            label="Save changes"
            icon="pi pi-check"
            permission="id-06-platform-operations:full"
            [loading]="section.saving()"
            [disabled]="!section.dirty()"
            (clicked)="section.save()"
          />
          <app-button
            pageActions
            label="Reset"
            [outlined]="true"
            [disabled]="!section.dirty()"
            (clicked)="section.resetDraft()"
          />
        </app-page-header>
        <app-cfg-section-nav />
        <div class="cfg-section-toolbar">
          <app-cfg-settings-breadcrumb [category]="sectionTitle()" section="Configuration" />
          <app-cfg-settings-search [compact]="true" />
        </div>
        <div class="cfg-section-layout">
          <app-cfg-settings-sidebar [activeCategory]="category()" />
          <div class="cfg-section-layout__content">
            @switch (category()) {
              @case ('general') { <app-cfg-general-settings-panel /> }
              @case ('security') { <app-cfg-security-settings-panel /> }
              @case ('platform') { <app-cfg-platform-settings-panel /> }
              @case ('notifications') { <app-cfg-notifications-settings-panel /> }
              @case ('localization') { <app-cfg-localization-settings-panel /> }
              @case ('integrations') { <app-cfg-integrations-settings-panel /> }
              @case ('preferences') { <app-cfg-system-preferences-panel /> }
            }
          </div>
        </div>
      </div>
    </app-base-page>
  `,
  styleUrl: './settings-section-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSectionPageComponent {
  readonly section = inject(SettingsSectionStateService);
  private readonly navState = inject(SettingsNavigationStateService);
  private readonly route = inject(ActivatedRoute);

  readonly category = toSignal(
    this.route.data.pipe(
      map((data) => (data['settingsCategory'] as SettingsCategoryId) ?? 'general'),
    ),
    { initialValue: 'general' as SettingsCategoryId },
  );

  readonly sectionTitle = () => getCategoryById(this.category())?.label ?? 'Settings';
  readonly sectionDescription = () => getCategoryById(this.category())?.description ?? '';

  constructor() {
    effect(() => {
      const cat = this.category();
      this.section.setCategory(cat);
      this.navState.setActiveCategory(cat);
      this.section.resetDraft();
    });
  }
}
