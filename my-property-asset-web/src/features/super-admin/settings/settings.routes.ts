import { Routes } from '@angular/router';

import {
  SUPER_ADMIN_SETTINGS_GENERAL_METADATA,
  SUPER_ADMIN_SETTINGS_INTEGRATIONS_METADATA,
  SUPER_ADMIN_SETTINGS_LOCALIZATION_METADATA,
  SUPER_ADMIN_SETTINGS_METADATA,
  SUPER_ADMIN_SETTINGS_NOTIFICATIONS_METADATA,
  SUPER_ADMIN_SETTINGS_PLATFORM_METADATA,
  SUPER_ADMIN_SETTINGS_PREFERENCES_METADATA,
  SUPER_ADMIN_SETTINGS_SECURITY_METADATA,
} from '../../../core/constants/route-metadata.constants';
import { settingsUnsavedChangesGuard } from './guards/settings-unsaved-changes.guard';
import { SettingsDashboardPageComponent } from './pages/settings-dashboard-page.component';
import { SettingsSectionPageComponent } from './pages/settings-section-page.component';
import { SettingsCategoryId } from './models/settings-admin.model';

const sectionRoute = (path: string, category: SettingsCategoryId, metadata: object): Routes[number] => ({
  path,
  component: SettingsSectionPageComponent,
  canDeactivate: [settingsUnsavedChangesGuard],
  data: { ...metadata, settingsCategory: category },
});

export const SETTINGS_ADMIN_ROUTE_CHILDREN: Routes = [
  {
    path: '',
    component: SettingsDashboardPageComponent,
    data: SUPER_ADMIN_SETTINGS_METADATA,
  },
  sectionRoute('general', 'general', SUPER_ADMIN_SETTINGS_GENERAL_METADATA),
  sectionRoute('security', 'security', SUPER_ADMIN_SETTINGS_SECURITY_METADATA),
  sectionRoute('platform', 'platform', SUPER_ADMIN_SETTINGS_PLATFORM_METADATA),
  sectionRoute('notifications', 'notifications', SUPER_ADMIN_SETTINGS_NOTIFICATIONS_METADATA),
  sectionRoute('localization', 'localization', SUPER_ADMIN_SETTINGS_LOCALIZATION_METADATA),
  sectionRoute('integrations', 'integrations', SUPER_ADMIN_SETTINGS_INTEGRATIONS_METADATA),
  sectionRoute('preferences', 'preferences', SUPER_ADMIN_SETTINGS_PREFERENCES_METADATA),
];
