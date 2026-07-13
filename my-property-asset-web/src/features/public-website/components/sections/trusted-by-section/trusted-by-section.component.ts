import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicTrustedLogo } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-trusted-by-section',
  imports: [RevealOnScrollDirective],
  templateUrl: './trusted-by-section.component.html',
  styleUrl: './trusted-by-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicTrustedBySectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Trusted by');
  readonly title = input('Property leaders building with MyPropertyAsset');
  readonly logos = input.required<readonly PublicTrustedLogo[]>();
}
