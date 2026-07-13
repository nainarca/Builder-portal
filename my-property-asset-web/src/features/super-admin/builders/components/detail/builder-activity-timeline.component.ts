import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { BuilderActivityRecord } from '../../models/builder-admin.model';

@Component({
  selector: 'app-bldr-activity-timeline',
  imports: [DatePipe, ContentSectionComponent, SectionHeaderComponent],
  template: `
    <app-content-section>
      <app-section-header title="Activity timeline" />
      <ul class="bldr-timeline">
        @for (item of items(); track item.id) {
          <li class="bldr-timeline__item">
            <span class="bldr-timeline__dot bldr-timeline__dot--{{ item.type }}"></span>
            <div>
              <p class="bldr-timeline__title">{{ item.title }}</p>
              <p class="bldr-timeline__desc">{{ item.description }}</p>
              <time>{{ item.timestamp | date: 'medium' }}</time>
            </div>
          </li>
        } @empty { <li>No activity recorded.</li> }
      </ul>
    </app-content-section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderActivityTimelineComponent {
  readonly items = input.required<readonly BuilderActivityRecord[]>();
}
