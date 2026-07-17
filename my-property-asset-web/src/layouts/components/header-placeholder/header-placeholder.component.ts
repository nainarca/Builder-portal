import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';
import { OrganizationSelectorComponent } from '@core/organization-context';
import {
  QuickActionsComponent,
  TopNavigationComponent,
  UserNavigationComponent,
} from '../../../navigation/components';
import { NavigationStateService } from '../../../navigation/services';
import { ShellGlobalSearchComponent } from '../../enterprise-shell/shell-global-search/shell-global-search.component';
import { ShellNotificationAreaComponent } from '../../enterprise-shell/shell-notification-area/shell-notification-area.component';

@Component({
  selector: 'app-header-placeholder',
  imports: [
    QuickActionsComponent,
    TopNavigationComponent,
    UserNavigationComponent,
    OrganizationSelectorComponent,
    ShellGlobalSearchComponent,
    ShellNotificationAreaComponent,
  ],
  templateUrl: './header-placeholder.component.html',
  styleUrl: './header-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'layout-header-host',
    '[class.layout-sticky-header]': 'sticky()',
  },
})
export class HeaderPlaceholderComponent {
  private readonly navigationState = inject(NavigationStateService);
  private readonly currentOrganization = inject(CurrentOrganizationService);

  readonly brand = input('MyPropertyAsset');
  readonly sticky = input(true);
  readonly showNavigation = input(true);
  readonly showOrganizationSelector = input(true);
  readonly showGlobalSearch = input(true);
  readonly showNotifications = input(true);

  readonly mobileMenuOpen = this.navigationState.mobileMenuOpen;

  readonly displayBrand = computed(() => {
    const organization = this.currentOrganization.activeOrganization();
    return organization?.name ?? this.brand();
  });

  readonly brandInitial = computed(() => this.displayBrand().slice(0, 1).toUpperCase());

  toggleMobileNavigation(): void {
    this.navigationState.toggleMobileNavigation();
  }
}
