import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentWrapperComponent } from '../../components/content-wrapper/content-wrapper.component';
import { PageContainerComponent } from '../../components/page-container/page-container.component';

/**
 * P0.1 §1.6 Content Area — the one region that changes per page.
 * Composes existing content wrapper + page container; no page redesign (DS-01).
 */
@Component({
  selector: 'app-shell-content-area',
  imports: [ContentWrapperComponent, PageContainerComponent],
  templateUrl: './shell-content-area.component.html',
  styleUrl: './shell-content-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-content-area',
  },
})
export class ShellContentAreaComponent {
  readonly scrollable = input(true);
  readonly fluid = input(false);
}
