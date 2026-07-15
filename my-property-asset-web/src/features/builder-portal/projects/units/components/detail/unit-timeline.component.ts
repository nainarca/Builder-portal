import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UnitMilestone } from '../../models/unit.model';

@Component({
  selector: 'app-unit-timeline',
  imports: [DatePipe],
  template: `
    <section class="unit-timeline-section" aria-label="Construction timeline">
      <h3 class="mpa-heading-sm">Construction timeline</h3>
      <ol class="unit-timeline">
        @for (milestone of milestones(); track milestone.id) {
          <li class="unit-timeline__item">
            <span class="unit-timeline__dot" [class]="'unit-timeline__dot--' + milestone.status"></span>
            <div>
              <p class="unit-timeline__title">{{ milestone.label }}</p>
              @if (milestone.description) {
                <p class="mpa-body-md m-0">{{ milestone.description }}</p>
              }
              <span class="unit-timeline__time">{{ milestone.date | date: 'mediumDate' }}</span>
            </div>
          </li>
        }
      </ol>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitTimelineComponent {
  readonly milestones = input.required<readonly UnitMilestone[]>();
}
