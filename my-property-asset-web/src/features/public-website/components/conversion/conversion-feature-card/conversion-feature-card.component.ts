import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ConversionFeatureHighlight } from '../../../models/conversion.model';

@Component({
  selector: 'app-conversion-feature-card',
  templateUrl: './conversion-feature-card.component.html',
  styleUrl: './conversion-feature-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionFeatureCardComponent {
  readonly feature = input.required<ConversionFeatureHighlight>();
}
