import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ResponsiveContainerComponent } from '../../components/responsive-container/responsive-container.component';

/**
 * Responsive Layout — breakpoint-aware shell frame (P0 §17 / P0.1 responsive rules).
 * Wraps existing responsive container; no breakpoint redesign (DS-01).
 */
@Component({
  selector: 'app-responsive-layout',
  imports: [ResponsiveContainerComponent],
  templateUrl: './responsive-layout.component.html',
  styleUrl: './responsive-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'responsive-layout',
  },
})
export class ResponsiveLayoutComponent {
  readonly variant = input<'public' | 'authenticated' | 'blank'>('authenticated');
  readonly sidebarCollapsed = input(false);
}
