import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { EnterpriseDashboardHeaderComponent } from './dashboard-chrome.component';
import {
  EnterpriseDashboardToolbarComponent,
  EnterpriseDashboardFiltersComponent,
  EnterpriseDashboardFooterComponent,
} from './dashboard-chrome.component';
import { EnterpriseDashboardStateComponent } from '../states/dashboard-state.component';
import type {
  EnterpriseDashboardLayoutMode,
  EnterpriseDashboardLifecycleState,
  EnterpriseDashboardRhythm,
} from '../models/enterprise-dashboard.models';

/**
 * DS-06 Dashboard Shell — P0.1 §2.2 zone order via content projection.
 * Four fixed zones: KPI → Attention → Activity → Quick actions (UI-REBIRTH §3).
 * Presentation framework only; modules supply widgets and data.
 */
@Component({
  selector: 'app-enterprise-dashboard-shell',
  imports: [
    EnterpriseDashboardHeaderComponent,
    EnterpriseDashboardToolbarComponent,
    EnterpriseDashboardFiltersComponent,
    EnterpriseDashboardFooterComponent,
    EnterpriseDashboardStateComponent,
  ],
  template: `
    <div
      class="enterprise-dashboard-shell"
      [class.enterprise-dashboard-shell--analytics]="layoutMode() === 'analytics'"
      [class.enterprise-dashboard-shell--operational]="rhythm() === 'operational'"
      [class.enterprise-dashboard-shell--exception]="rhythm() === 'exception'"
    >
      <app-enterprise-dashboard-header
        [title]="title()"
        [description]="description()"
        [eyebrow]="eyebrow()"
        [showRefresh]="showRefresh()"
        [refreshing]="state() === 'refreshing'"
        (refresh)="refresh.emit()"
      >
        <ng-content select="[dashboardActions]" dashboardActions />
      </app-enterprise-dashboard-header>

      @if (showToolbar()) {
        <app-enterprise-dashboard-toolbar>
          <ng-content select="[toolbarStart]" />
          <ng-content select="[toolbarEnd]" />
        </app-enterprise-dashboard-toolbar>
      }

      @if (showFilters()) {
        <app-enterprise-dashboard-filters>
          <ng-content select="[dashboardFilters]" />
        </app-enterprise-dashboard-filters>
      }

      <ng-content select="[dashboardWelcome]" />
      <ng-content select="[dashboardAccountHealth]" />

      <app-enterprise-dashboard-state
        [state]="state()"
        [errorMessage]="errorMessage()"
        [maintenanceMessage]="maintenanceMessage()"
        (emptyAction)="emptyAction.emit($event)"
      >
        <div class="enterprise-dashboard-shell__zones">
          <div class="enterprise-dashboard-shell__zone" role="region" aria-label="KPI strip">
            <ng-content select="[kpiStrip]" />
          </div>
          <div class="enterprise-dashboard-shell__zone" role="region" aria-label="Attention zone">
            <ng-content select="[attentionZone]" />
          </div>
          <div class="enterprise-dashboard-shell__zone" role="region" aria-label="Activity and portfolio">
            <ng-content select="[activityZone]" />
            <ng-content select="[portfolioZone]" />
            <ng-content select="[mainContent]" />
          </div>
          <div class="enterprise-dashboard-shell__zone" role="region" aria-label="Quick actions">
            <ng-content select="[quickActions]" />
          </div>
        </div>
      </app-enterprise-dashboard-state>

      @if (showFooter()) {
        <app-enterprise-dashboard-footer>
          <ng-content select="[dashboardFooter]" />
        </app-enterprise-dashboard-footer>
      }
    </div>
  `,
  styles: `
    .enterprise-dashboard-shell {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xl);
      width: 100%;
    }
    .enterprise-dashboard-shell--analytics .enterprise-dashboard-shell__zones {
      gap: var(--mpa-spacing-xl);
    }
    .enterprise-dashboard-shell__zones {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xl);
    }
    .enterprise-dashboard-shell__zone:empty {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDashboardShellComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly layoutMode = input<EnterpriseDashboardLayoutMode>('dashboard');
  /** Builder = operational; Super Admin = exception-first (UI-REBIRTH §3 / §11). */
  readonly rhythm = input<EnterpriseDashboardRhythm>('operational');
  readonly state = input<EnterpriseDashboardLifecycleState>('idle');
  readonly errorMessage = input<string | undefined>(undefined);
  readonly maintenanceMessage = input<string | undefined>(undefined);
  readonly showToolbar = input(false);
  readonly showFilters = input(false);
  readonly showFooter = input(false);
  readonly showRefresh = input(true);

  readonly refresh = output<void>();
  readonly emptyAction = output<MouseEvent>();
}
