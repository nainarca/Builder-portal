import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EnterpriseWorkspaceSwitcherComponent } from '@shared/ui';

/**
 * Sidebar workspace switcher — real control (UI-REBIRTH §2 / §19 #2).
 * Delegates to the shared enterprise workspace switcher → organization selector.
 */
@Component({
  selector: 'app-sidebar-workspace-indicator',
  imports: [EnterpriseWorkspaceSwitcherComponent],
  templateUrl: './sidebar-workspace-indicator.component.html',
  styleUrl: './sidebar-workspace-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar-workspace-indicator',
    '[class.sidebar-workspace-indicator--compact]': 'compact()',
  },
})
export class SidebarWorkspaceIndicatorComponent {
  /** Retained for call-site compatibility; selector reads live org context. */
  readonly brand = input('MyPropertyAsset');
  readonly organizationName = input<string | null>(null);
  readonly compact = input(false);
}
