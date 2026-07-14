import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

import {
  OpsAlertCardComponent,
  OpsMetricCardComponent,
  OpsSectionNavComponent,
  OpsSystemStatusComponent,
  OpsTimelineComponent,
} from '../components/shared';
import { OperationsAdminStoreService } from '../services/operations-admin-store.service';

@Component({
  selector: 'app-ops-dashboard-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    RouterLink,
    OpsSectionNavComponent,
    OpsSystemStatusComponent,
    OpsTimelineComponent,
    OpsAlertCardComponent,
    OpsMetricCardComponent,
  ],
  template: `
    <app-base-page>
      <div class="ops-page">
        <app-page-header
          eyebrow="Super Admin"
          title="Platform Operations Center"
          description="Monitor system health, audit activity, performance signals, and operational alerts."
        />
        <app-ops-section-nav />

        <app-ops-system-status [snapshot]="store.healthScore()" />

        <div class="ops-kpi-grid" aria-label="Operational summary">
          <div class="ops-kpi">
            <span class="ops-kpi__label">Active alerts</span>
            <span class="ops-kpi__value" [class.ops-kpi__value--danger]="store.overview().criticalAlerts > 0">
              {{ store.overview().activeAlerts }}
            </span>
          </div>
          <div class="ops-kpi">
            <span class="ops-kpi__label">Critical</span>
            <span class="ops-kpi__value" [class.ops-kpi__value--danger]="store.overview().criticalAlerts > 0">
              {{ store.overview().criticalAlerts }}
            </span>
          </div>
          <div class="ops-kpi">
            <span class="ops-kpi__label">Audit events today</span>
            <span class="ops-kpi__value">{{ store.overview().auditEventsToday }}</span>
          </div>
          <div class="ops-kpi">
            <span class="ops-kpi__label">Failed logins</span>
            <span class="ops-kpi__value">{{ store.overview().failedLoginsToday }}</span>
          </div>
          <div class="ops-kpi">
            <span class="ops-kpi__label">Avg response</span>
            <span class="ops-kpi__value">{{ store.overview().avgResponseMs }} ms</span>
          </div>
          <div class="ops-kpi">
            <span class="ops-kpi__label">Error rate</span>
            <span class="ops-kpi__value">{{ store.overview().errorRatePercent }}%</span>
          </div>
        </div>

        <nav class="ops-actions" aria-label="Quick actions">
          <a class="ops-action-btn" routerLink="/super-admin/operations/health"><i class="pi pi-heart" aria-hidden="true"></i> Health</a>
          <a class="ops-action-btn" routerLink="/super-admin/operations/audit"><i class="pi pi-book" aria-hidden="true"></i> Audit logs</a>
          <a class="ops-action-btn" routerLink="/super-admin/operations/activity"><i class="pi pi-users" aria-hidden="true"></i> User activity</a>
          <a class="ops-action-btn" routerLink="/super-admin/operations/monitoring"><i class="pi pi-chart-line" aria-hidden="true"></i> Monitoring</a>
          <a class="ops-action-btn" routerLink="/super-admin/operations/alerts"><i class="pi pi-bell" aria-hidden="true"></i> Alerts</a>
        </nav>

        <div class="ops-dashboard-grid">
          <div class="ops-dashboard-grid__main">
            <section class="ops-panel">
              <h2 class="ops-panel__title">Performance snapshot</h2>
              <div class="ops-card-grid">
                @for (metric of store.metrics(); track metric.id) {
                  <app-ops-metric-card [metric]="metric" />
                }
              </div>
            </section>
            <section class="ops-panel">
              <h2 class="ops-panel__title">Recent events</h2>
              <app-ops-timeline [events]="store.timeline()" />
            </section>
          </div>
          <aside class="ops-dashboard-grid__aside">
            <section class="ops-panel">
              <h2 class="ops-panel__title">Active alerts</h2>
              <div class="ops-stack">
                @for (alert of store.unacknowledgedAlerts(); track alert.id) {
                  <app-ops-alert-card [alert]="alert" (acknowledge)="store.acknowledgeAlert($event)" />
                } @empty {
                  <div class="ops-empty">No active alerts. Platform is clear.</div>
                }
              </div>
            </section>
          </aside>
        </div>
      </div>
    </app-base-page>
  `,
  styleUrl: './ops-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsDashboardPageComponent {
  readonly store = inject(OperationsAdminStoreService);
}
