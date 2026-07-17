import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { CardComponent } from '../../composites/cards/card.component';
import { EnterpriseButtonComponent } from '../buttons/enterprise-button.component';
import {
  EnterpriseMetricData,
  EnterpriseStatusFact,
  EnterpriseTimelineEvent,
  EnterpriseTrendDirection,
} from '../models/enterprise.models';
import { StatusBadgeComponent } from '../../composites/notification/status-badge.component';

@Component({
  selector: 'app-metric-card',
  imports: [CardComponent],
  template: `
    <app-card variant="flat">
      <div class="enterprise-metric-card">
        <p class="enterprise-metric-card__label">{{ data().label }}</p>
        <p class="enterprise-metric-card__value">{{ data().value }}</p>
        @if (data().trend || data().trendLabel || data().hint) {
          <p class="enterprise-metric-card__meta">
            @if (data().trend) {
              <span
                class="enterprise-metric-card__trend"
                [class.enterprise-metric-card__trend--up]="data().trend === 'up'"
                [class.enterprise-metric-card__trend--down]="data().trend === 'down'"
                [attr.aria-label]="trendAria()"
              >
                <i
                  class="pi"
                  [class.pi-arrow-up]="data().trend === 'up'"
                  [class.pi-arrow-down]="data().trend === 'down'"
                  [class.pi-minus]="data().trend === 'neutral'"
                  aria-hidden="true"
                ></i>
                @if (data().trendLabel) {
                  <span>{{ data().trendLabel }}</span>
                }
              </span>
            } @else if (data().trendLabel) {
              <span>{{ data().trendLabel }}</span>
            }
            @if (data().hint) {
              <span class="enterprise-metric-card__hint">{{ data().hint }}</span>
            }
          </p>
        }
      </div>
    </app-card>
  `,
  styleUrl: '../styles/metric-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricCardComponent {
  readonly data = input.required<EnterpriseMetricData>();

  readonly trendAria = computed(() => {
    const trend = this.data().trend;
    const label = this.data().trendLabel ?? '';
    if (trend === 'up') return `Trend up ${label}`.trim();
    if (trend === 'down') return `Trend down ${label}`.trim();
    return `Trend unchanged ${label}`.trim();
  });
}

@Component({
  selector: 'app-summary-card',
  imports: [CardComponent],
  template: `
    <app-card [variant]="variant()">
      <div class="enterprise-summary-card">
        @if (eyebrow()) {
          <p class="enterprise-summary-card__eyebrow">{{ eyebrow() }}</p>
        }
        <h3 class="enterprise-summary-card__title">{{ title() }}</h3>
        @if (description()) {
          <p class="enterprise-summary-card__description">{{ description() }}</p>
        }
        <ng-content />
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-summary-card { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-summary-card__eyebrow {
      margin: 0; font-size: var(--mpa-font-size-xs); font-weight: var(--mpa-font-weight-semibold);
      letter-spacing: 0.06em; text-transform: uppercase; color: var(--mpa-color-text-muted);
    }
    .enterprise-summary-card__title { margin: 0; font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-summary-card__description { margin: 0; color: var(--mpa-color-text-muted); font-size: var(--mpa-font-size-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCardComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly variant = input<'default' | 'flat' | 'outlined'>('default');
}

@Component({
  selector: 'app-status-card',
  imports: [CardComponent, StatusBadgeComponent, EnterpriseButtonComponent],
  template: `
    <app-card variant="default">
      <div class="enterprise-status-card">
        <app-status-badge [label]="statusLabel()" [severity]="statusSeverity()" [icon]="statusIcon()" />
        <h3 class="enterprise-status-card__title">{{ title() }}</h3>
        @if (facts().length) {
          <dl class="enterprise-status-card__facts">
            @for (fact of facts(); track fact.label) {
              <div class="enterprise-status-card__fact">
                <dt>{{ fact.label }}</dt>
                <dd>{{ fact.value }}</dd>
              </div>
            }
          </dl>
        }
        @if (actionLabel()) {
          <app-enterprise-button variant="outline" [label]="actionLabel()!" (clicked)="action.emit($event)" />
        }
        <ng-content />
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-status-card { display: flex; flex-direction: column; gap: var(--mpa-spacing-md); }
    .enterprise-status-card__title { margin: 0; font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-status-card__facts {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: var(--mpa-spacing-md); margin: 0;
    }
    .enterprise-status-card__fact dt {
      margin: 0; font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); text-transform: uppercase; letter-spacing: 0.04em;
    }
    .enterprise-status-card__fact dd { margin: 0.15rem 0 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusCardComponent {
  readonly title = input.required<string>();
  readonly statusLabel = input.required<string>();
  readonly statusSeverity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>('info');
  readonly statusIcon = input<string | undefined>(undefined);
  readonly facts = input<readonly EnterpriseStatusFact[]>([]);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-insight-card',
  imports: [CardComponent, EnterpriseButtonComponent],
  template: `
    <app-card variant="outlined">
      <div class="enterprise-insight-card">
        <div class="enterprise-insight-card__header">
          <i [class]="icon() || 'pi pi-lightbulb'" aria-hidden="true"></i>
          <p class="enterprise-insight-card__headline">{{ headline() }}</p>
        </div>
        @if (actionLabel()) {
          <app-enterprise-button variant="text" [label]="actionLabel()!" (clicked)="action.emit($event)" />
        }
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-insight-card { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-insight-card__header { display: flex; gap: var(--mpa-spacing-sm); align-items: flex-start; }
    .enterprise-insight-card__header i { color: var(--mpa-color-info); margin-top: 0.15rem; }
    .enterprise-insight-card__headline { margin: 0; font-size: var(--mpa-font-size-sm); line-height: var(--mpa-line-height-normal); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsightCardComponent {
  readonly headline = input.required<string>();
  readonly icon = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-information-card',
  imports: [CardComponent],
  template: `
    <app-card variant="outlined">
      <div class="enterprise-information-card" role="note">
        <i class="pi pi-info-circle" aria-hidden="true"></i>
        <div>
          @if (title()) {
            <h3 class="enterprise-information-card__title">{{ title() }}</h3>
          }
          <p class="enterprise-information-card__body">{{ message() }}</p>
          <ng-content />
        </div>
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-information-card {
      display: flex; gap: var(--mpa-spacing-sm); color: var(--mpa-color-text);
    }
    .enterprise-information-card i { color: var(--mpa-color-info); flex-shrink: 0; }
    .enterprise-information-card__title { margin: 0 0 var(--mpa-spacing-xs); font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-information-card__body { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCardComponent {
  readonly message = input.required<string>();
  readonly title = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-warning-card',
  imports: [CardComponent, EnterpriseButtonComponent],
  template: `
    <app-card variant="outlined">
      <div class="enterprise-warning-card" role="status" aria-label="Warning">
        <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
        <div class="enterprise-warning-card__body">
          <p class="enterprise-warning-card__sr">Warning</p>
          <h3 class="enterprise-warning-card__title">{{ title() }}</h3>
          @if (description()) {
            <p class="enterprise-warning-card__description">{{ description() }}</p>
          }
          @if (actionLabel()) {
            <app-enterprise-button variant="outline" [label]="actionLabel()!" (clicked)="action.emit($event)" />
          }
        </div>
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-warning-card {
      display: flex; gap: var(--mpa-spacing-sm);
      border-left: 3px solid var(--mpa-color-warning);
      padding-left: var(--mpa-spacing-sm);
    }
    .enterprise-warning-card i { color: var(--mpa-color-warning); flex-shrink: 0; }
    .enterprise-warning-card__sr {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;
    }
    .enterprise-warning-card__body { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); min-width: 0; }
    .enterprise-warning-card__title { margin: 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-warning-card__description { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningCardComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-enterprise-action-card',
  imports: [CardComponent, EnterpriseButtonComponent],
  template: `
    <app-card variant="interactive">
      <div class="enterprise-action-card">
        <h3 class="enterprise-action-card__title">{{ title() }}</h3>
        @if (description()) {
          <p class="enterprise-action-card__description">{{ description() }}</p>
        }
        <app-enterprise-button
          variant="primary"
          [label]="actionLabel()"
          (clicked)="action.emit($event)"
        />
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-action-card { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); align-items: flex-start; }
    .enterprise-action-card__title { margin: 0; font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-action-card__description { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseActionCardComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly actionLabel = input('Continue');
  readonly action = output<MouseEvent>();
}

@Component({
  selector: 'app-timeline-card',
  imports: [CardComponent],
  template: `
    <app-card variant="default">
      @if (title()) {
        <h3 class="enterprise-timeline-card__title">{{ title() }}</h3>
      }
      <ol class="enterprise-timeline-card__list">
        @for (event of events(); track event.id) {
          <li class="enterprise-timeline-card__item">
            <span class="enterprise-timeline-card__node" aria-hidden="true">
              <i [class]="event.icon || 'pi pi-circle-fill'"></i>
            </span>
            <div class="enterprise-timeline-card__content">
              <p class="enterprise-timeline-card__event-title">{{ event.title }}</p>
              @if (event.description) {
                <p class="enterprise-timeline-card__event-description">{{ event.description }}</p>
              }
              <time
                class="enterprise-timeline-card__timestamp"
                [attr.datetime]="event.absoluteTimestamp || null"
                [attr.title]="event.absoluteTimestamp || event.timestamp"
              >{{ event.timestamp }}</time>
            </div>
          </li>
        }
      </ol>
    </app-card>
  `,
  styles: `
    .enterprise-timeline-card__title { margin: 0 0 var(--mpa-spacing-md); font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-timeline-card__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--mpa-spacing-md); }
    .enterprise-timeline-card__item { display: flex; gap: var(--mpa-spacing-sm); position: relative; }
    .enterprise-timeline-card__node {
      width: 1.5rem; display: flex; justify-content: center; color: var(--mpa-color-primary); flex-shrink: 0;
    }
    .enterprise-timeline-card__content { min-width: 0; display: flex; flex-direction: column; gap: 0.15rem; }
    .enterprise-timeline-card__event-title { margin: 0; font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
    .enterprise-timeline-card__event-description { margin: 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-timeline-card__timestamp { font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); font-variant-numeric: tabular-nums; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineCardComponent {
  readonly events = input.required<readonly EnterpriseTimelineEvent[]>();
  readonly title = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-quick-action-card',
  imports: [],
  template: `
    <button
      type="button"
      class="enterprise-quick-action-card"
      [attr.aria-label]="label()"
      (click)="activated.emit()"
    >
      <i [class]="icon()" aria-hidden="true"></i>
      <span>{{ label() }}</span>
    </button>
  `,
  styles: `
    .enterprise-quick-action-card {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: var(--mpa-spacing-sm); width: 100%; min-height: 5.5rem;
      padding: var(--mpa-spacing-md); border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md); background: var(--mpa-color-surface);
      color: var(--mpa-color-text); cursor: pointer;
      transition: background-color var(--mpa-transition-fast), border-color var(--mpa-transition-fast);
    }
    .enterprise-quick-action-card:hover {
      background: color-mix(in srgb, var(--mpa-color-primary-subtle) 70%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-primary) 35%, var(--mpa-color-border));
    }
    .enterprise-quick-action-card:focus-visible {
      outline: 2px solid var(--mpa-color-focus); outline-offset: 2px;
    }
    .enterprise-quick-action-card i { font-size: 1.25rem; color: var(--mpa-color-primary); }
    .enterprise-quick-action-card span { font-size: var(--mpa-font-size-sm); font-weight: var(--mpa-font-weight-medium); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionCardComponent {
  readonly label = input.required<string>();
  readonly icon = input('pi pi-bolt');
  readonly activated = output<void>();
}

@Component({
  selector: 'app-analytics-card',
  imports: [CardComponent],
  template: `
    <app-card variant="default">
      <div class="enterprise-analytics-card">
        <div class="enterprise-analytics-card__header">
          <div>
            <h3 class="enterprise-analytics-card__title">{{ title() }}</h3>
            @if (subtitle()) {
              <p class="enterprise-analytics-card__subtitle">{{ subtitle() }}</p>
            }
          </div>
          @if (value()) {
            <p class="enterprise-analytics-card__value">{{ value() }}</p>
          }
        </div>
        <div class="enterprise-analytics-card__body">
          <ng-content />
        </div>
      </div>
    </app-card>
  `,
  styles: `
    .enterprise-analytics-card { display: flex; flex-direction: column; gap: var(--mpa-spacing-md); }
    .enterprise-analytics-card__header { display: flex; justify-content: space-between; gap: var(--mpa-spacing-md); align-items: flex-start; }
    .enterprise-analytics-card__title { margin: 0; font-size: var(--mpa-font-size-lg); font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-analytics-card__subtitle { margin: 0.25rem 0 0; font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .enterprise-analytics-card__value {
      margin: 0; font-size: var(--mpa-font-size-xl); font-weight: var(--mpa-font-weight-semibold);
      font-variant-numeric: tabular-nums;
    }
    .enterprise-analytics-card__body { min-height: 8rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | undefined>(undefined);
  readonly value = input<string | undefined>(undefined);
}

export type { EnterpriseTrendDirection };
