import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import {
  InsightCardComponent,
  InformationCardComponent,
  WarningCardComponent,
} from '../../cards/enterprise-cards.component';
import {
  ErrorAlertComponent,
  SuccessAlertComponent,
} from '../../alerts/enterprise-alerts.component';
import { HealthIndicatorComponent } from '../../status/enterprise-status.component';
import type { EnterpriseDashboardInsight } from '../models/enterprise-dashboard.models';
import type { EnterpriseHealthLevel } from '../../models/enterprise.models';

@Component({
  selector: 'app-enterprise-dashboard-insight',
  imports: [
    InsightCardComponent,
    WarningCardComponent,
    InformationCardComponent,
    SuccessAlertComponent,
    ErrorAlertComponent,
  ],
  template: `
    @switch (insight().kind) {
      @case ('recommendation') {
        <app-insight-card
          [headline]="insight().message"
          [actionLabel]="insight().actionLabel"
          (action)="action.emit(insight().id)"
        />
      }
      @case ('warning') {
        <app-warning-card
          [title]="insight().title"
          [description]="insight().message"
          [actionLabel]="insight().actionLabel"
          (action)="action.emit(insight().id)"
        />
      }
      @case ('information') {
        <app-information-card [title]="insight().title" [message]="insight().message" />
      }
      @case ('success') {
        <app-success-alert [message]="insight().message" />
      }
      @case ('alert') {
        <app-error-alert [message]="insight().message" />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardInsightComponent {
  readonly insight = input.required<EnterpriseDashboardInsight>();
  readonly action = output<string>();
}

@Component({
  selector: 'app-enterprise-dashboard-insights',
  imports: [EnterpriseDashboardInsightComponent],
  template: `
    <div class="enterprise-dashboard-insights" role="region" [attr.aria-label]="ariaLabel()">
      @for (insight of insights(); track insight.id) {
        <app-enterprise-dashboard-insight [insight]="insight" (action)="action.emit($event)" />
      }
    </div>
  `,
  styles: `
    .enterprise-dashboard-insights {
      display: flex; flex-direction: column; gap: var(--mpa-spacing-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardInsightsComponent {
  readonly insights = input<readonly EnterpriseDashboardInsight[]>([]);
  readonly ariaLabel = input('Dashboard insights');
  readonly action = output<string>();
}

@Component({
  selector: 'app-enterprise-health-indicator-panel',
  imports: [HealthIndicatorComponent],
  template: `
    <div class="enterprise-health-panel" role="region" [attr.aria-label]="ariaLabel()">
      @for (item of levels(); track item.label) {
        <div class="enterprise-health-panel__item">
          <span>{{ item.label }}</span>
          <app-health-indicator [level]="item.level" />
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-health-panel { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-health-panel__item { display: flex; justify-content: space-between; align-items: center; gap: var(--mpa-spacing-md); font-size: var(--mpa-font-size-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseHealthIndicatorPanelComponent {
  readonly levels = input<readonly { label: string; level: EnterpriseHealthLevel }[]>([]);
  readonly ariaLabel = input('System health');
}
