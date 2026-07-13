import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { ConversionJourneyStep } from '../../../models/conversion.model';

@Component({
  selector: 'app-conversion-journey-timeline',
  imports: [RevealOnScrollDirective],
  templateUrl: './conversion-journey-timeline.component.html',
  styleUrl: './conversion-journey-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionJourneyTimelineComponent {
  readonly steps = input.required<readonly ConversionJourneyStep[]>();
}
