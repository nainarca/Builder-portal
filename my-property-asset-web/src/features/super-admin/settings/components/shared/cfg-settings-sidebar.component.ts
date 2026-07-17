import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  EnterpriseSettingsNavigationComponent,
  type EnterpriseSettingsNavItem,
} from '@shared/ui';

import { SETTINGS_CATEGORIES } from '../../config/settings.config';
import { SettingsCategoryId, SettingsNavItem } from '../../models/settings-admin.model';

@Component({
  selector: 'app-cfg-settings-sidebar',
  imports: [EnterpriseSettingsNavigationComponent],
  template: `
    <app-enterprise-settings-navigation
      title="Categories"
      ariaLabel="Settings categories"
      [items]="navItems()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSettingsSidebarComponent {
  readonly activeCategory = input<SettingsCategoryId | null>(null);
  readonly categories: readonly SettingsNavItem[] = SETTINGS_CATEGORIES;

  readonly navItems = computed((): readonly EnterpriseSettingsNavItem[] =>
    this.categories.map((category) => ({
      id: category.id,
      label: category.label,
      description: category.description,
      icon: category.icon,
      href: category.route,
      active: category.id === this.activeCategory(),
    })),
  );
}
