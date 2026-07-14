import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

import {
  OpsAlertCardComponent,
  OpsIncidentCardComponent,
  OpsSectionNavComponent,
} from '../components/shared';
import { OperationsAdminStoreService } from '../services/operations-admin-store.service';
import { OperationsViewStateService } from '../services/operations-view-state.service';

@Component({
  selector: 'app-ops-alerts-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    OpsSectionNavComponent,
    OpsAlertCardComponent,
    OpsIncidentCardComponent,
  ],
  template: `
    <app-base-page>
      <div class="ops-page">
        <app-page-header
          eyebrow="Operations"
          title="Notifications & Alerts"
          description="Critical alerts, warnings, maintenance notices, and incident timeline."
        />
        <app-ops-section-nav />

        <div class="ops-toolbar">
          @for (f of filters; track f) {
            <button type="button" class="ops-chip" [class.ops-chip--active]="view.alertFilter() === f" (click)="view.setAlertFilter(f)">
              {{ f }}
            </button>
          }
        </div>

        <div class="ops-dashboard-grid">
          <div class="ops-dashboard-grid__main">
            <section>
              <h2 class="ops-panel__title">Alert history</h2>
              <div class="ops-stack">
                @for (alert of filteredAlerts(); track alert.id) {
                  <app-ops-alert-card [alert]="alert" (acknowledge)="store.acknowledgeAlert($event)" />
                } @empty {
                  <div class="ops-empty">No alerts in this view.</div>
                }
              </div>
            </section>
          </div>
          <aside class="ops-dashboard-grid__aside">
            <section>
              <h2 class="ops-panel__title">Incidents</h2>
              <div class="ops-stack">
                @for (inc of store.incidents(); track inc.id) {
                  <app-ops-incident-card [incident]="inc" />
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
export class OpsAlertsPageComponent {
  readonly store = inject(OperationsAdminStoreService);
  readonly view = inject(OperationsViewStateService);
  readonly filters = ['all', 'open', 'acknowledged'] as const;

  readonly filteredAlerts = computed(() => {
    const f = this.view.alertFilter();
    const alerts = this.store.alerts();
    if (f === 'open') return alerts.filter((a) => !a.acknowledged);
    if (f === 'acknowledged') return alerts.filter((a) => a.acknowledged);
    return alerts;
  });
}
