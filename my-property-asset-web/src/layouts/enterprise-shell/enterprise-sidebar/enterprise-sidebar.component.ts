import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { AuthContextService } from '@core/auth';
import { CurrentOrganizationService } from '@core/organization-context';
import { FavoritesNavigationComponent } from '../../../navigation/components/favorites-navigation/favorites-navigation.component';
import { RecentItemsNavigationComponent } from '../../../navigation/components/recent-items-navigation/recent-items-navigation.component';
import { SidebarNavigationComponent } from '../../../navigation/components/sidebar-navigation/sidebar-navigation.component';
import { NavigationStateService } from '../../../navigation/services';
import { LayoutService } from '../../services/layout.service';
import { SidebarWorkspaceIndicatorComponent } from '../sidebar-workspace-indicator/sidebar-workspace-indicator.component';
import { EnterpriseUserProfileCardComponent } from '@shared/ui';

/**
 * DS-02 Enterprise Sidebar — desktop rail with collapse, hover expansion, groups,
 * workspace indicator, and favorites/recent placeholders (P0.1 §1.2 / §4.1–4.2).
 */
@Component({
  selector: 'app-enterprise-sidebar',
  imports: [
    SidebarWorkspaceIndicatorComponent,
    SidebarNavigationComponent,
    FavoritesNavigationComponent,
    RecentItemsNavigationComponent,
    EnterpriseUserProfileCardComponent,
  ],
  templateUrl: './enterprise-sidebar.component.html',
  styleUrl: './enterprise-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'enterprise-sidebar-host',
    '(mouseenter)': 'onHostMouseEnter()',
    '(mouseleave)': 'onHostMouseLeave()',
  },
})
export class EnterpriseSidebarComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly navigationState = inject(NavigationStateService);
  private readonly authContext = inject(AuthContextService);
  private readonly currentOrganization = inject(CurrentOrganizationService);

  readonly brand = input('MyPropertyAsset');
  readonly collapsed = input(false);
  readonly ariaLabel = input('Sidebar');
  readonly showNavigation = input(true);
  readonly showProfile = input(true);
  readonly enableHoverExpand = input(true);

  private readonly hoverExpandedSignal = signal(false);
  readonly hoverExpanded = this.hoverExpandedSignal.asReadonly();
  private tabletDefaultApplied = false;

  readonly pinnedCollapsed = computed(
    () => this.collapsed() || this.navigationState.sidebarCollapsed(),
  );

  /** Icon-rail when pinned collapsed and not hover-expanded. */
  readonly iconRail = computed(() => this.pinnedCollapsed() && !this.hoverExpanded());

  /** Visually expanded (full labels) — either pinned open or hover-expanded. */
  readonly visuallyExpanded = computed(() => !this.pinnedCollapsed() || this.hoverExpanded());

  readonly userEmail = computed(() => this.authContext.user()?.email ?? '');
  readonly userInitial = computed(() => this.userEmail().charAt(0).toUpperCase() || '?');
  readonly organizationName = computed(
    () => this.currentOrganization.organizationName() ?? this.brand(),
  );

  constructor() {
    // P0.1: tablet defaults to icon-only rail; desktop starts expanded.
    afterNextRender(() => {
      if (this.tabletDefaultApplied || typeof window === 'undefined') {
        return;
      }
      this.tabletDefaultApplied = true;
      const width = window.innerWidth;
      if (width >= 640 && width < 1024 && !this.navigationState.sidebarCollapsed()) {
        this.navigationState.setSidebarCollapsed(true);
        this.layoutService.setSidebarCollapsed(true);
      }
    });
  }

  onHostMouseEnter(): void {
    if (this.enableHoverExpand() && this.pinnedCollapsed()) {
      this.hoverExpandedSignal.set(true);
    }
  }

  onHostMouseLeave(): void {
    this.hoverExpandedSignal.set(false);
  }

  toggleSidebar(): void {
    const next = !this.pinnedCollapsed();
    this.hoverExpandedSignal.set(false);
    this.navigationState.setSidebarCollapsed(next);
    this.layoutService.setSidebarCollapsed(next);
  }
}
