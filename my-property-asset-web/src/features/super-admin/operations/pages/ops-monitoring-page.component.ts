import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

import {
  OpsMetricCardComponent,
  OpsSectionNavComponent,
  OpsStatusBadgeComponent,
} from '../components/shared';
import { TELEMETRY_PROVIDERS } from '../config/operations.config';
import { OperationsAdminStoreService } from '../services/operations-admin-store.service';

@Component({
  selector: 'app-ops-monitoring-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    OpsSectionNavComponent,
    OpsMetricCardComponent,
    OpsStatusBadgeComponent,
  ],
  template: `
    <app-base-page>
      <div class="ops-page">
        <app-page-header
          eyebrow="Operations"
          title="System Monitoring"
          description="Performance overview, queues, storage summary, and future telemetry providers."
        />
        <app-ops-section-nav />

        <section>
          <h2 class="ops-panel__title">Performance overview</h2>
          <div class="ops-card-grid">
            @for (metric of store.metrics(); track metric.id) {
              <app-ops-metric-card [metric]="metric" />
            }
          </div>
        </section>

        <div class="ops-dashboard-grid">
          <section class="ops-panel">
            <h2 class="ops-panel__title">Background jobs & queues</h2>
            @for (q of store.queues(); track q.id) {
              <div class="ops-queue">
                <div>
                  <strong>{{ q.name }}</strong>
                  <div style="font-size:var(--mpa-font-size-xs);color:var(--mpa-color-text-muted);margin-top:0.25rem">
                    Pending {{ q.pending }} · Processing {{ q.processing }} · Failed {{ q.failed }}
                  </div>
                </div>
                <app-ops-status-badge [status]="q.status" />
              </div>
            }
          </section>
          <section class="ops-panel">
            <h2 class="ops-panel__title">Resource usage</h2>
            <div class="ops-kpi-grid">
              <div class="ops-kpi"><span class="ops-kpi__label">Storage used</span><span class="ops-kpi__value">186 GB</span></div>
              <div class="ops-kpi"><span class="ops-kpi__label">Storage limit</span><span class="ops-kpi__value">250 GB</span></div>
              <div class="ops-kpi"><span class="ops-kpi__label">Warnings</span><span class="ops-kpi__value">3</span></div>
              <div class="ops-kpi"><span class="ops-kpi__label">Errors (24h)</span><span class="ops-kpi__value">12</span></div>
            </div>
          </section>
        </div>

        <section>
          <h2 class="ops-panel__title">Future telemetry integrations</h2>
          <div class="ops-provider-grid">
            @for (p of providers; track p.id) {
              <article class="ops-provider">
                <div class="ops-provider__name"><i [class]="p.icon" aria-hidden="true"></i> {{ p.name }}</div>
                <p class="ops-provider__desc">{{ p.description }}</p>
                <app-ops-status-badge [status]="'info'" [label]="p.status.replace('_', ' ')" />
              </article>
            }
          </div>
        </section>
      </div>
    </app-base-page>
  `,
  styleUrl: './ops-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsMonitoringPageComponent {
  readonly store = inject(OperationsAdminStoreService);
  readonly providers = TELEMETRY_PROVIDERS;
}
