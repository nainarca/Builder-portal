import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { FeatureFlagService } from '@infrastructure/feature-flags';
import { PermissionService } from '@core/rbac';
import { NavigationItem, NavigationSection } from '../../models';
import { NavigationService } from '../../services';
import { filterVisibleNavigationItems } from '../../utils';

@Component({
  selector: 'app-nav-list',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-list.component.html',
  styleUrl: './nav-list.component.scss',
  host: {
    class: 'nav-list-host',
    '[class.nav-list-host--tabs]': "variant() === 'tabs'",
    '[class.nav-list-host--pills]': "variant() === 'pills'",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavListComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly featureFlags = inject(FeatureFlagService);
  private readonly permissions = inject(PermissionService);

  readonly section = input<NavigationSection | undefined>(undefined);
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly variant = input<'default' | 'tabs' | 'pills'>('default');
  readonly ariaLabel = input<string>('Navigation');
  readonly zone = input('navigation');

  readonly itemActivate = output<NavigationItem>();

  visibleItems(items: readonly NavigationItem[]): NavigationItem[] {
    return filterVisibleNavigationItems(items, {
      isFeatureEnabled: (flag) => this.featureFlags.isEnabled(flag),
      hasPermission: (requirements) => this.permissions.hasAllPermissions(requirements),
    });
  }

  isActive(item: NavigationItem): boolean {
    return item.route ? this.navigationService.isRouteActive(item.route) : false;
  }

  onItemClick(item: NavigationItem): void {
    this.itemActivate.emit(item);
    this.navigationService.notifyItemActivated({
      item,
      zone: this.zone(),
      context: this.navigationService.context(),
      timestamp: Date.now(),
    });
  }

  routeCommands(item: NavigationItem): string[] | null {
    if (!item.route) {
      return null;
    }

    if (typeof item.route === 'string') {
      return item.route.startsWith('/') ? [item.route] : ['/', item.route];
    }

    return ['/', ...item.route.filter(Boolean)];
  }
}
