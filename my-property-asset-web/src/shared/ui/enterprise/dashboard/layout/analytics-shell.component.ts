import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseDashboardShellComponent } from '../layout/dashboard-shell.component';

/** Analytics layout variant — P0.1 §2.5 filter bar + chart-dominant zones. */
@Component({
  selector: 'app-enterprise-analytics-shell',
  imports: [EnterpriseDashboardShellComponent],
  template: `
    <app-enterprise-dashboard-shell
      [title]="title()"
      [description]="description()"
      [eyebrow]="eyebrow()"
      layoutMode="analytics"
      [state]="state()"
      [errorMessage]="errorMessage()"
      [showToolbar]="showToolbar()"
      [showFilters]="true"
      [showFooter]="showFooter()"
      [showRefresh]="showRefresh()"
      (refresh)="refresh.emit()"
      (emptyAction)="emptyAction.emit($event)"
    >
      <ng-content select="[dashboardActions]" dashboardActions />
      <ng-content select="[toolbarStart]" toolbarStart />
      <ng-content select="[toolbarEnd]" toolbarEnd />
      <ng-content select="[dashboardFilters]" dashboardFilters />
      <ng-content select="[kpiStrip]" kpiStrip />
      <ng-content select="[attentionZone]" attentionZone />
      <ng-content select="[activityZone]" activityZone />
      <ng-content select="[portfolioZone]" portfolioZone />
      <ng-content select="[mainContent]" mainContent />
      <ng-content select="[quickActions]" quickActions />
      <ng-content select="[dashboardFooter]" dashboardFooter />
    </app-enterprise-dashboard-shell>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseAnalyticsShellComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly state = input<'idle' | 'loading' | 'refreshing' | 'error' | 'no-data' | 'permission-denied' | 'maintenance'>('idle');
  readonly errorMessage = input<string | undefined>(undefined);
  readonly showToolbar = input(true);
  readonly showFooter = input(false);
  readonly showRefresh = input(true);

  readonly refresh = output<void>();
  readonly emptyAction = output<MouseEvent>();
}
