import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

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
    BasePageComponent,
    PageHeaderComponent,
    OpsSectionNavComponent,
    OpsSystemStatusComponent,
    OpsHealthCardComponent,
    OpsTimelineComponent,
  ],
  template: `
    <app-base-page>
      <div class="ops-page">
        <app-page-header
          eyebrow="Operations"
          title="Platform Health"
          description="Application, database, authentication, storage, API, and worker health status."
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
    </app-base-page>
  `,
  styleUrl: './ops-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsHealthPageComponent {
  readonly store = inject(OperationsAdminStoreService);
}
