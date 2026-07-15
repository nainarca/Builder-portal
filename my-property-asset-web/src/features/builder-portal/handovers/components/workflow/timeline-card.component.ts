import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HandoverActivityItem } from '../../models/handover.model';

@Component({
  selector: 'app-timeline-card',
  imports: [DatePipe],
  template: `
    <section class="timeline-card" [attr.aria-label]="title()">
      <h3 class="handover-info-panel__title">{{ title() }}</h3>
      @if (items().length === 0) {
        <p class="mpa-body-md m-0">No activity recorded yet.</p>
      } @else {
        <ul class="timeline-card__list">
          @for (item of items(); track item.id) {
            <li class="timeline-card__item">
              <span class="timeline-card__icon" [class]="'timeline-card__icon--' + (item.tone ?? 'neutral')">
                <i [class]="item.icon" aria-hidden="true"></i>
              </span>
              <div>
                <p class="timeline-card__title">{{ item.title }}</p>
                <p class="timeline-card__description">{{ item.description }}</p>
                <span class="timeline-card__time">{{ item.timestamp | date: 'medium' }}</span>
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineCardComponent {
  readonly title = input('Activity timeline');
  readonly items = input.required<readonly HandoverActivityItem[]>();
}
