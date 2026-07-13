import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicAudienceBenefit } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-benefits-section',
  imports: [RevealOnScrollDirective],
  templateUrl: './benefits-section.component.html',
  styleUrl: './benefits-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicBenefitsSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Built for your stakeholders');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly benefits = input.required<readonly PublicAudienceBenefit[]>();
}
