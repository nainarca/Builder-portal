import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SidebarPlaceholderComponent } from '../../components/sidebar-placeholder/sidebar-placeholder.component';

/**
 * P0.1 §1.2 Sidebar — primary top-level navigation region.
 * Wraps existing sidebar chrome only. Sidebar redesign is DS-02 — do not change structure here.
 */
@Component({
  selector: 'app-shell-sidebar',
  imports: [SidebarPlaceholderComponent],
  templateUrl: './shell-sidebar.component.html',
  styleUrl: './shell-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-sidebar',
  },
})
export class ShellSidebarComponent {
  readonly brand = input('MyPropertyAsset');
  readonly collapsed = input(false);
  readonly ariaLabel = input('Sidebar');
  readonly showNavigation = input(true);
  readonly showProfile = input(true);
}
