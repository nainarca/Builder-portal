import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OwnerActivityItem } from '../../models/owner.model';

@Component({
  selector: 'app-customer-timeline',
  imports: [DatePipe],
  template: `
    <section class="owner-timeline-section" aria-label="Customer activity timeline">
      <h3 class="mpa-heading-sm">Activity timeline</h3>
      @if (items().length === 0) {
        <p class="mpa-body-md m-0">No activity recorded yet.</p>
      } @else {
        <ul class="owner-timeline">
          @for (item of items(); track item.id) {
            <li class="owner-timeline__item">
              <span class="owner-timeline__icon" [class]="'owner-timeline__icon--' + (item.tone ?? 'neutral')">
                <i [class]="item.icon" aria-hidden="true"></i>
              </span>
              <div>
                <p class="owner-timeline__title">{{ item.title }}</p>
                <p class="owner-timeline__description">{{ item.description }}</p>
                <span class="owner-timeline__time">{{ item.timestamp | date: 'medium' }}</span>
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerTimelineComponent {
  readonly items = input.required<readonly OwnerActivityItem[]>();
}
