import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HeaderPlaceholderComponent } from '../../components/header-placeholder/header-placeholder.component';

/**
 * P0.1 §1.1 Header — persistent global orientation strip.
 * Wraps existing header chrome; no visual redesign (DS-01).
 */
@Component({
  selector: 'app-shell-header',
  imports: [HeaderPlaceholderComponent],
  templateUrl: './shell-header.component.html',
  styleUrl: './shell-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-header',
  },
})
export class ShellHeaderComponent {
  readonly brand = input('MyPropertyAsset');
  readonly sticky = input(true);
  readonly showNavigation = input(true);
  readonly showOrganizationSelector = input(true);
}
