import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
    '[class.nav-list-host--compact]': 'compact()',
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
  /** Icon-only rail mode (labels visually hidden; titles remain for tooltips). */
  readonly compact = input(false);
  /** Allow one nested level under an item (P0: max two navigation levels). */
  readonly allowNesting = input(true);

  readonly itemActivate = output<NavigationItem>();

  private readonly expandedIds = signal<ReadonlySet<string>>(new Set());

  visibleItems(items: readonly NavigationItem[]): NavigationItem[] {
    return filterVisibleNavigationItems(items, {
      isFeatureEnabled: (flag) => this.featureFlags.isEnabled(flag),
      hasPermission: (requirements) => this.permissions.hasAllPermissions(requirements),
    });
  }

  isActive(item: NavigationItem): boolean {
    if (item.metadata?.activeMatch) {
      return this.navigationService.activeRoute().includes(item.metadata.activeMatch);
    }

    if (item.route && this.navigationService.isRouteActive(item.route)) {
      return true;
    }

    if (item.children?.length) {
      return item.children.some((child) => this.isActive(child));
    }

    return false;
  }

  isExpanded(item: NavigationItem): boolean {
    if (this.expandedIds().has(item.id)) {
      return true;
    }
    return this.isActive(item) && !!item.children?.length;
  }

  toggleExpanded(item: NavigationItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.expandedIds.update((current) => {
      const next = new Set(current);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      return next;
    });
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
