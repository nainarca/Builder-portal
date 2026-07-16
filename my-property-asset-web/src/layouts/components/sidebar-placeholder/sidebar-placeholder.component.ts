import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AuthContextService } from '@core/auth';
import { CurrentOrganizationService } from '@core/organization-context';

import { FavoritesNavigationComponent } from '../../../navigation/components/favorites-navigation/favorites-navigation.component';
import { RecentItemsNavigationComponent } from '../../../navigation/components/recent-items-navigation/recent-items-navigation.component';
import { SidebarNavigationComponent } from '../../../navigation/components/sidebar-navigation/sidebar-navigation.component';
import { NavigationStateService } from '../../../navigation/services';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar-placeholder',
  imports: [
    SidebarNavigationComponent,
    FavoritesNavigationComponent,
    RecentItemsNavigationComponent,
  ],
  templateUrl: './sidebar-placeholder.component.html',
  styleUrl: './sidebar-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'layout-sidebar-host',
    '[class.layout-sidebar-collapsible--collapsed]': 'collapsed()',
  },
})
export class SidebarPlaceholderComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly navigationState = inject(NavigationStateService);
  private readonly authContext = inject(AuthContextService);
  private readonly currentOrganization = inject(CurrentOrganizationService);

  readonly brand = input('MyPropertyAsset');
  readonly collapsed = input(false);
  readonly ariaLabel = input('Sidebar');
  readonly showNavigation = input(true);
  readonly showProfile = input(true);

  readonly sidebarCollapsed = this.navigationState.sidebarCollapsed;

  readonly userEmail = computed(() => this.authContext.user()?.email ?? '');
  readonly userInitial = computed(() => this.userEmail().charAt(0).toUpperCase() || '?');
  readonly organizationName = computed(() => this.currentOrganization.organizationName() ?? 'MyPropertyAsset');

  toggleSidebar(): void {
    const next = !this.sidebarCollapsed();
    this.navigationState.setSidebarCollapsed(next);
    this.layoutService.setSidebarCollapsed(next);
  }
}
