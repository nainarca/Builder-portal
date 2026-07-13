import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { OrganizationActivityRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-activity-timeline',
  imports: [DatePipe, ContentSectionComponent, SectionHeaderComponent],
  template: `
    <app-content-section>
      <app-section-header title="Activity timeline" description="Recent organization events" />
      <ul class="org-timeline">
        @for (item of items(); track item.id) {
          <li class="org-timeline__item">
            <span class="org-timeline__dot org-timeline__dot--{{ item.type }}"></span>
            <div>
              <p class="org-timeline__title">{{ item.title }}</p>
              <p class="org-timeline__description">{{ item.description }}</p>
              <time class="org-timeline__time">{{ item.timestamp | date: 'medium' }}</time>
            </div>
          </li>
        } @empty {
          <li class="org-timeline__empty">No activity recorded yet.</li>
        }
      </ul>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationActivityTimelineComponent {
  readonly items = input.required<readonly OrganizationActivityRecord[]>();
}
