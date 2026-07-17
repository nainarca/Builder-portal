import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmptyNoDataComponent, EnterpriseSectionHeaderComponent } from '@shared/ui';

import { OrganizationActivityRecord } from '../../models/organization-admin.model';

@Component({
  selector: 'app-org-activity-timeline',
  imports: [DatePipe, EnterpriseSectionHeaderComponent, EmptyNoDataComponent],
  template: `
    <section class="org-activity" aria-label="Organization activity">
      <app-enterprise-section-header
        title="Recent activity"
        description="Latest organization events and changes"
      />

      @if (items().length) {
        <ul class="org-timeline">
          @for (item of items(); track item.id) {
            <li class="org-timeline__item">
              <span class="org-timeline__dot org-timeline__dot--{{ item.type }}" aria-hidden="true"></span>
              <div>
                <p class="org-timeline__title">{{ item.title }}</p>
                <p class="org-timeline__description">{{ item.description }}</p>
                <time class="org-timeline__time">{{ item.timestamp | date: 'medium' }}</time>
              </div>
            </li>
          }
        </ul>
      } @else {
        <app-empty-no-data
          title="No activity yet"
          description="Organization events will appear here as they occur."
        />
      }
    </section>
  `,
  styles: `
    .org-activity {
      display: grid;
      gap: var(--mpa-spacing-md);
    }

    .org-timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--mpa-spacing-md);
    }

    .org-timeline__item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface-elevated);
    }

    .org-timeline__dot {
      width: 0.625rem;
      height: 0.625rem;
      margin-top: 0.35rem;
      border-radius: 50%;
      background: var(--mpa-color-primary);
    }

    .org-timeline__dot--status { background: var(--mpa-color-success); }
    .org-timeline__dot--member { background: var(--mpa-color-info, var(--mpa-color-primary)); }
    .org-timeline__dot--branding { background: var(--mpa-color-warn); }
    .org-timeline__dot--system { background: var(--mpa-color-text-muted); }

    .org-timeline__title {
      margin: 0;
      font-weight: var(--mpa-font-weight-semibold);
    }

    .org-timeline__description {
      margin: 0.25rem 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }

    .org-timeline__time {
      font-size: var(--mpa-font-size-xs);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationActivityTimelineComponent {
  readonly items = input.required<readonly OrganizationActivityRecord[]>();
}
