import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UserActivityRecord } from '../../models/user-admin.model';

@Component({
  selector: 'app-iam-activity-timeline',
  imports: [DatePipe],
  template: `
    <section class="iam-timeline-section">
      <h2 class="mpa-heading-sm">Activity timeline</h2>
      <ul class="iam-timeline">
        @for (item of items(); track item.id) {
          <li class="iam-timeline__item">
            <span class="iam-timeline__dot iam-timeline__dot--{{ item.type }}"></span>
            <div>
              <p class="iam-timeline__title">{{ item.title }}</p>
              <p class="iam-timeline__desc">{{ item.description }}</p>
              <time class="iam-timeline__time">{{ item.timestamp | date: 'medium' }}</time>
            </div>
          </li>
        } @empty { <li class="iam-timeline__empty">No activity recorded.</li> }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamActivityTimelineComponent {
  readonly items = input.required<readonly UserActivityRecord[]>();
}
