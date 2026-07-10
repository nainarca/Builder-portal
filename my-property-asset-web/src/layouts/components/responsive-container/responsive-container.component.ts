import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-responsive-container',
  templateUrl: './responsive-container.component.html',
  styleUrl: './responsive-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.layout-responsive-container--sidebar-collapsed]': 'sidebarCollapsed()',
  },
})
export class ResponsiveContainerComponent {
  readonly variant = input<'public' | 'authenticated' | 'blank'>('public');
  readonly sidebarCollapsed = input(false);
}
