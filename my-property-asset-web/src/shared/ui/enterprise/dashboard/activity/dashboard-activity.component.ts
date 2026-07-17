import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { CardComponent } from '../../../composites/cards/card.component';
import { TimelineCardComponent } from '../../cards/enterprise-cards.component';
import { GhostButtonComponent } from '../../buttons/enterprise-button.component';
import { EmptyNoActivityComponent } from '../../empty-states/enterprise-empty-states.component';
import type {
  EnterpriseDashboardActivityItem,
  EnterpriseDashboardApprovalItem,
  EnterpriseDashboardEventItem,
  EnterpriseDashboardNotificationItem,
  EnterpriseDashboardTaskItem,
  EnterpriseTimelineEvent,
} from '../models/enterprise-dashboard.models';

@Component({
  selector: 'app-enterprise-recent-activity',
  imports: [CardComponent, EmptyNoActivityComponent],
  template: `
    <app-card variant="default">
      @if (title()) {
        <h3 class="enterprise-activity__title">{{ title() }}</h3>
      }
      @if (items().length === 0) {
        <app-empty-no-activity />
      } @else {
        <ul class="enterprise-activity__list" role="list">
          @for (item of items(); track item.id) {
            <li class="enterprise-activity__item">
              @if (item.icon) {
                <i [class]="item.icon" aria-hidden="true"></i>
              }
              <div>
                <p class="enterprise-activity__item-title">{{ item.title }}</p>
                @if (item.description) {
                  <p class="enterprise-activity__item-description">{{ item.description }}</p>
                }
                <time [attr.datetime]="item.absoluteTimestamp ?? null">{{ item.timestamp }}</time>
              </div>
            </li>
          }
        </ul>
      }
    </app-card>
  `,
  styles: `
    .enterprise-activity__title { margin: 0 0 var(--mpa-spacing-md); font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-activity__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--mpa-spacing-md); }
    .enterprise-activity__item { display: flex; gap: var(--mpa-spacing-sm); align-items: flex-start; }
    .enterprise-activity__item i { color: var(--mpa-color-primary); margin-top: 0.15rem; }
    .enterprise-activity__item-title { margin: 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
    .enterprise-activity__item-description { margin: 0.15rem 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-activity__item time { font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseRecentActivityComponent {
  readonly title = input('Recent activity');
  readonly items = input<readonly EnterpriseDashboardActivityItem[]>([]);
}

@Component({
  selector: 'app-enterprise-dashboard-timeline',
  imports: [TimelineCardComponent],
  template: `<app-timeline-card [title]="title()" [events]="events()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardTimelineComponent {
  readonly title = input<string | undefined>(undefined);
  readonly events = input.required<readonly EnterpriseTimelineEvent[]>();
}

@Component({
  selector: 'app-enterprise-notifications-panel',
  imports: [CardComponent, GhostButtonComponent],
  template: `
    <app-card variant="default">
      <div class="enterprise-notifications__header">
        <h3 class="enterprise-notifications__title">{{ title() }}</h3>
        @if (showMarkAllRead()) {
          <app-ghost-button label="Mark all read" size="small" (clicked)="markAllRead.emit()" />
        }
      </div>
      <ul class="enterprise-notifications__list" role="list" aria-live="polite">
        @for (item of items(); track item.id) {
          <li class="enterprise-notifications__item" [class.enterprise-notifications__item--unread]="!item.read">
            <p class="enterprise-notifications__item-title">{{ item.title }}</p>
            <p class="enterprise-notifications__item-message">{{ item.message }}</p>
            <time>{{ item.timestamp }}</time>
          </li>
        }
      </ul>
    </app-card>
  `,
  styles: `
    .enterprise-notifications__header { display: flex; justify-content: space-between; align-items: center; gap: var(--mpa-spacing-sm); margin-bottom: var(--mpa-spacing-md); }
    .enterprise-notifications__title { margin: 0; font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-notifications__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-notifications__item { padding: var(--mpa-spacing-sm); border-radius: var(--mpa-radius-md); border: 1px solid var(--mpa-color-border); }
    .enterprise-notifications__item--unread { background: var(--mpa-color-surface-muted); }
    .enterprise-notifications__item-title { margin: 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
    .enterprise-notifications__item-message { margin: 0.15rem 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-notifications__item time { font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseNotificationsPanelComponent {
  readonly title = input('Notifications');
  readonly items = input<readonly EnterpriseDashboardNotificationItem[]>([]);
  readonly showMarkAllRead = input(true);
  readonly markAllRead = output<void>();
}

@Component({
  selector: 'app-enterprise-tasks-panel',
  imports: [CardComponent],
  template: `
    <app-card variant="default">
      <h3 class="enterprise-tasks__title">{{ title() }}</h3>
      <ul class="enterprise-tasks__list" role="list">
        @for (task of items(); track task.id) {
          <li class="enterprise-tasks__item">
            <span [class.enterprise-tasks__item--done]="task.completed">{{ task.title }}</span>
            @if (task.dueLabel) {
              <small>{{ task.dueLabel }}</small>
            }
          </li>
        }
      </ul>
    </app-card>
  `,
  styles: `
    .enterprise-tasks__title { margin: 0 0 var(--mpa-spacing-md); font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-tasks__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-tasks__item { display: flex; justify-content: space-between; gap: var(--mpa-spacing-sm); font-size: var(--mpa-font-size-sm); }
    .enterprise-tasks__item--done { text-decoration: line-through; color: var(--mpa-color-text-muted); }
    .enterprise-tasks__item small { color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTasksPanelComponent {
  readonly title = input('Tasks');
  readonly items = input<readonly EnterpriseDashboardTaskItem[]>([]);
}

@Component({
  selector: 'app-enterprise-pending-approvals',
  imports: [CardComponent, GhostButtonComponent],
  template: `
    <app-card variant="default">
      <h3 class="enterprise-approvals__title">{{ title() }}</h3>
      <ul class="enterprise-approvals__list" role="list">
        @for (item of items(); track item.id) {
          <li class="enterprise-approvals__item">
            <div>
              <p class="enterprise-approvals__item-title">{{ item.title }}</p>
              <p class="enterprise-approvals__item-meta">{{ item.requester }} · {{ item.submittedAt }}</p>
            </div>
            <app-ghost-button label="Review" size="small" (clicked)="review.emit(item.id)" />
          </li>
        }
      </ul>
    </app-card>
  `,
  styles: `
    .enterprise-approvals__title { margin: 0 0 var(--mpa-spacing-md); font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-approvals__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-approvals__item { display: flex; justify-content: space-between; align-items: center; gap: var(--mpa-spacing-sm); padding: var(--mpa-spacing-sm); border: 1px solid var(--mpa-color-border); border-radius: var(--mpa-radius-md); }
    .enterprise-approvals__item-title { margin: 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
    .enterprise-approvals__item-meta { margin: 0.15rem 0 0; font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterprisePendingApprovalsComponent {
  readonly title = input('Pending approvals');
  readonly items = input<readonly EnterpriseDashboardApprovalItem[]>([]);
  readonly review = output<string>();
}

@Component({
  selector: 'app-enterprise-upcoming-events',
  imports: [CardComponent],
  template: `
    <app-card variant="default">
      <h3 class="enterprise-events__title">{{ title() }}</h3>
      <ul class="enterprise-events__list" role="list">
        @for (event of items(); track event.id) {
          <li class="enterprise-events__item">
            <p class="enterprise-events__item-title">{{ event.title }}</p>
            <p class="enterprise-events__item-meta">
              {{ event.startLabel }}
              @if (event.location) { · {{ event.location }} }
            </p>
          </li>
        }
      </ul>
    </app-card>
  `,
  styles: `
    .enterprise-events__title { margin: 0 0 var(--mpa-spacing-md); font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-events__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-events__item { padding: var(--mpa-spacing-sm); border-left: 3px solid var(--mpa-color-primary); }
    .enterprise-events__item-title { margin: 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
    .enterprise-events__item-meta { margin: 0.15rem 0 0; font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseUpcomingEventsComponent {
  readonly title = input('Upcoming events');
  readonly items = input<readonly EnterpriseDashboardEventItem[]>([]);
}
