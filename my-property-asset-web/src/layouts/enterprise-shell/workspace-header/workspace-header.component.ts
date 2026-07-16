import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  ContextNavigationComponent,
  SecondaryNavigationComponent,
} from '../../../navigation/components';

/**
 * Workspace Header — portal workspace/context strip below the global Header.
 * Hosts existing context + secondary navigation (P0.1 Workspace Switcher lives in Header;
 * this region carries in-shell workspace orientation without redesigning those nav composites).
 */
@Component({
  selector: 'app-workspace-header',
  imports: [ContextNavigationComponent, SecondaryNavigationComponent],
  templateUrl: './workspace-header.component.html',
  styleUrl: './workspace-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'workspace-header',
  },
})
export class WorkspaceHeaderComponent {
  readonly showContextNavigation = input(true);
  readonly showSecondaryNavigation = input(true);
}
