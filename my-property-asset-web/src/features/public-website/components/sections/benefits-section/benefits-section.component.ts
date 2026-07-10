import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { PublicBenefitItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-benefits-section',
  templateUrl: './benefits-section.component.html',
  styleUrl: './benefits-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicBenefitsSectionComponent {
  readonly sectionId = input.required<string>();
  readonly eyebrow = input('Why MyPropertyAsset');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly benefits = input.required<readonly PublicBenefitItem[]>();
}
