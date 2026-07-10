import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';
import { OrganizationSelectorComponent } from '@core/organization-context';
import {
  QuickActionsComponent,
  TopNavigationComponent,
  UserNavigationComponent,
} from '../../../navigation/components';
import { NavigationStateService } from '../../../navigation/services';

@Component({
  selector: 'app-header-placeholder',
  imports: [
    QuickActionsComponent,
    TopNavigationComponent,
    UserNavigationComponent,
    OrganizationSelectorComponent,
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
