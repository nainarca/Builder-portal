import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { TimelineEvent } from '../../../models/company.model';

@Component({
  selector: 'app-company-timeline',
  imports: [RevealOnScrollDirective],
  templateUrl: './company-timeline.component.html',
  styleUrl: './company-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyTimelineComponent {
  readonly events = input.required<readonly TimelineEvent[]>();
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly variant = input<'vertical' | 'horizontal'>('vertical');
}
