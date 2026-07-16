import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FooterPlaceholderComponent } from '../../components/footer-placeholder/footer-placeholder.component';

/**
 * P0.1 §1.7 Footer — minimal platform information landmark.
 * Wraps existing footer chrome; no visual redesign (DS-01).
 */
@Component({
  selector: 'app-shell-footer',
  imports: [FooterPlaceholderComponent],
  templateUrl: './shell-footer.component.html',
  styleUrl: './shell-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-footer',
  },
})
export class ShellFooterComponent {
  readonly brand = input('MyPropertyAsset');
  readonly showNavigation = input(true);
}
