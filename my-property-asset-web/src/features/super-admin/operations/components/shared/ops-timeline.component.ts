import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { formatOpsDate } from '../../config/operations.config';
import { TimelineEvent } from '../../models/operations-admin.model';
import { OpsStatusBadgeComponent } from './ops-status-badge.component';

@Component({
  selector: 'app-ops-timeline',
  imports: [OpsStatusBadgeComponent],
  template: `
    <ol class="ops-timeline" aria-label="Operations timeline">
      @for (event of events(); track event.id) {
        <li class="ops-timeline__item">
          <span class="ops-timeline__marker" aria-hidden="true"></span>
          <div class="ops-timeline__body">
            <div class="ops-timeline__head">
              <strong>{{ event.title }}</strong>
              @if (event.severity) {
                <app-ops-status-badge [status]="event.severity" />
              }
            </div>
            <p>{{ event.description }}</p>
            <time>{{ formatDate(event.timestamp) }} · {{ event.kind }}</time>
          </div>
        </li>
      } @empty {
        <li class="ops-timeline__empty">No recent events.</li>
      }
    </ol>
  `,
  styles: `
    .ops-timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
      border-left: 2px solid var(--mpa-color-border);
      margin-left: 0.55rem;
    }
    .ops-timeline__item {
      position: relative;
      padding: 0 0 1.25rem 1.25rem;
    }
    .ops-timeline__marker {
      position: absolute;
      left: -0.45rem;
      top: 0.2rem;
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 50%;
      background: var(--mpa-color-primary);
      border: 2px solid var(--mpa-color-surface);
    }
    .ops-timeline__head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 0.25rem;
    }
    .ops-timeline__head strong {
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .ops-timeline__body p {
      margin: 0 0 0.35rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .ops-timeline__body time {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      text-transform: capitalize;
    }
    .ops-timeline__empty {
      padding-left: 1.25rem;
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsTimelineComponent {
  readonly events = input.required<readonly TimelineEvent[]>();
  formatDate = formatOpsDate;
}
