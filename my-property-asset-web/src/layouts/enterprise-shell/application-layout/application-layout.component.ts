import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ResponsiveLayoutComponent } from '../responsive-layout/responsive-layout.component';
import { ShellBreadcrumbComponent } from '../shell-breadcrumb/shell-breadcrumb.component';
import { ShellContentAreaComponent } from '../shell-content-area/shell-content-area.component';
import { ShellFooterComponent } from '../shell-footer/shell-footer.component';
import { ShellHeaderComponent } from '../shell-header/shell-header.component';
import { ShellPageToolbarComponent } from '../shell-page-toolbar/shell-page-toolbar.component';
import { ShellSidebarComponent } from '../shell-sidebar/shell-sidebar.component';
import { WorkspaceHeaderComponent } from '../workspace-header/workspace-header.component';

/**
 * P0.1 §1 Application Shell — singular reusable frame for authenticated portals.
 * Shared by Super Admin, Builder Portal, and future Support / Operations shells.
 *
 * Region order (approved):
 * Header → Workspace Header → Breadcrumb → Page Toolbar → Content Area → Footer
 * with Sidebar in the responsive frame.
 */
@Component({
  selector: 'app-application-layout',
  imports: [
    ResponsiveLayoutComponent,
    ShellSidebarComponent,
    ShellHeaderComponent,
    WorkspaceHeaderComponent,
    ShellBreadcrumbComponent,
    ShellPageToolbarComponent,
    ShellContentAreaComponent,
    ShellFooterComponent,
  ],
  templateUrl: './application-layout.component.html',
  styleUrl: './application-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'application-layout',
  },
})
export class ApplicationLayoutComponent {
  readonly brand = input('MyPropertyAsset');
  readonly sidebarAriaLabel = input('Sidebar');
  readonly sidebarCollapsed = input(false);
  readonly stickyHeader = input(true);
  readonly showOrganizationSelector = input(true);
  readonly showHeaderNavigation = input(true);
  readonly showWorkspaceHeader = input(true);
  readonly showBreadcrumb = input(true);
  /** Shell page-toolbar region; off by default so in-page headers stay unchanged. */
  readonly showPageToolbar = input(false);
  readonly showFooter = input(true);
  readonly contentScrollable = input(true);
  readonly contentFluid = input(false);
  readonly layoutClass = input('');
}
