import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Workspace Indicator — current portal / organization context in the sidebar chrome.
 */
@Component({
  selector: 'app-sidebar-workspace-indicator',
  templateUrl: './sidebar-workspace-indicator.component.html',
  styleUrl: './sidebar-workspace-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sidebar-workspace-indicator',
    '[class.sidebar-workspace-indicator--compact]': 'compact()',
  },
})
export class SidebarWorkspaceIndicatorComponent {
  readonly brand = input('MyPropertyAsset');
  readonly organizationName = input<string | null>(null);
  readonly compact = input(false);

  readonly displayName = computed(() => this.organizationName()?.trim() || this.brand());
  readonly initial = computed(() => this.displayName().slice(0, 1).toUpperCase());
}
