import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProjectMilestone } from '../../models/project.model';

@Component({
  selector: 'app-proj-timeline',
  imports: [DatePipe],
  template: `
    <section class="proj-timeline-section" aria-label="Construction timeline">
      <h3 class="mpa-heading-sm">Construction timeline</h3>
      <ol class="proj-timeline">
        @for (milestone of milestones(); track milestone.id) {
          <li class="proj-timeline__item">
            <span class="proj-timeline__dot" [class]="'proj-timeline__dot--' + milestone.status"></span>
            <div>
              <p class="proj-timeline__title">{{ milestone.label }}</p>
              @if (milestone.description) {
                <p class="proj-timeline__description">{{ milestone.description }}</p>
              }
              <span class="proj-timeline__time">{{ milestone.date | date: 'mediumDate' }}</span>
            </div>
          </li>
        }
      </ol>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTimelineComponent {
  readonly milestones = input.required<readonly ProjectMilestone[]>();
}
