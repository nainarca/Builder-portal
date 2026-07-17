import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';

import {
  OpsHealthCardComponent,
  OpsSectionNavComponent,
  OpsSystemStatusComponent,
  OpsTimelineComponent,
} from '../components/shared';
import { OperationsAdminStoreService } from '../services/operations-admin-store.service';

@Component({
  selector: 'app-ops-health-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    OpsSectionNavComponent,
    OpsSystemStatusComponent,
    OpsHealthCardComponent,
    OpsTimelineComponent,
  ],
  template: `
    <app-sa-page>
      <div class="ops-page">
        <app-enterprise-form-page-header
          eyebrow="Operations"
          title="Platform Health"
          subtitle="Application, database, authentication, storage, API, and worker health status."
          mode="view"
        />
        <app-ops-section-nav />
        <app-ops-system-status [snapshot]="store.healthScore()" />
        <section>
          <h2 class="ops-panel__title">Service status</h2>
          <div class="ops-card-grid">
            @for (svc of store.healthServices(); track svc.id) {
              <app-ops-health-card [service]="svc" />
            }
          </div>
        </section>
        <section class="ops-panel">
          <h2 class="ops-panel__title">Status timeline</h2>
          <app-ops-timeline [events]="store.timeline()" />
        </section>
      </div>
    </app-sa-page>
  `,
  styleUrl: './ops-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsHealthPageComponent {
  readonly store = inject(OperationsAdminStoreService);
}
