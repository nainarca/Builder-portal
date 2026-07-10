import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { NavigationStateService } from '../../services';
import { SidebarNavigationComponent } from '../sidebar-navigation/sidebar-navigation.component';

@Component({
  selector: 'app-navigation-drawer',
  imports: [SidebarNavigationComponent],
  templateUrl: './navigation-drawer.component.html',
  styleUrl: './navigation-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.navigation-drawer--open]': 'drawerOpen() || mobileMenuOpen()',
  },
})
export class NavigationDrawerComponent {
  private readonly state = inject(NavigationStateService);

  readonly ariaLabel = input('Navigation drawer');

  readonly drawerOpen = this.state.drawerOpen;
  readonly mobileMenuOpen = this.state.mobileMenuOpen;

  close(): void {
    this.state.closeDrawer();
    this.state.closeMobileNavigation();
  }
}
