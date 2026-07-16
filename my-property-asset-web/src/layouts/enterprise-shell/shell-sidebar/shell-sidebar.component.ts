import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnterpriseSidebarComponent } from '../enterprise-sidebar/enterprise-sidebar.component';

/**
 * P0.1 §1.2 Sidebar — DS-02 Enterprise Sidebar implementation.
 */
@Component({
  selector: 'app-shell-sidebar',
  imports: [EnterpriseSidebarComponent],
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
