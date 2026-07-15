import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { DocumentActivityItem } from '../../models/document.model';

@Component({
  selector: 'app-document-timeline',
  imports: [DatePipe],
  template: `
    <section class="doc-timeline-section" aria-label="Document activity timeline">
      <h3 class="mpa-heading-sm">Activity timeline</h3>
      @if (items().length === 0) {
        <p class="mpa-body-md m-0">No activity recorded yet.</p>
      } @else {
        <ul class="doc-timeline">
          @for (item of items(); track item.id) {
            <li class="doc-timeline__item">
              <span class="doc-timeline__icon" [class]="'doc-timeline__icon--' + (item.tone ?? 'neutral')">
                <i [class]="item.icon" aria-hidden="true"></i>
              </span>
              <div>
                <p class="doc-timeline__title">{{ item.title }}</p>
                <p class="doc-timeline__description">{{ item.description }}</p>
                <span class="doc-timeline__time">{{ item.timestamp | date: 'medium' }}</span>
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTimelineComponent {
  readonly items = input.required<readonly DocumentActivityItem[]>();
}
