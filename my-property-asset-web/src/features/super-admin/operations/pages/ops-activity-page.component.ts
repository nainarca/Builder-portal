import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { EnterpriseFormPageHeaderComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';

import { OpsSectionNavComponent, OpsStatusBadgeComponent } from '../components/shared';
import { formatOpsDate } from '../config/operations.config';
import { OperationsAdminStoreService } from '../services/operations-admin-store.service';
import { OperationsViewStateService } from '../services/operations-view-state.service';

@Component({
  selector: 'app-ops-activity-page',
  imports: [SuperAdminPageComponent, EnterpriseFormPageHeaderComponent, OpsSectionNavComponent, OpsStatusBadgeComponent],
  template: `
    <app-sa-page>
      <div class="ops-page">
        <app-enterprise-form-page-header
          eyebrow="Operations"
          title="User Activity"
          subtitle="Recent logins, failed attempts, sessions, and security events across organizations and builders."
          mode="view"
        />
        <app-ops-section-nav />

        <div class="ops-toolbar">
          @for (f of filters; track f) {
            <button type="button" class="ops-chip" [class.ops-chip--active]="view.activityFilter() === f" (click)="view.setActivityFilter(f)">
              {{ f.replace('_', ' ') }}
            </button>
          }
        </div>

        <div class="ops-stack">
          @for (row of filtered(); track row.id) {
            <article class="ops-panel" style="padding:1rem">
              <header style="display:flex;justify-content:space-between;gap:1rem;align-items:center;margin-bottom:0.5rem">
                <strong>{{ row.userName }}</strong>
                <app-ops-status-badge [status]="row.type === 'failed_login' ? 'warning' : 'info'" [label]="row.type.replace('_', ' ')" />
              </header>
              <p style="margin:0 0 0.35rem;color:var(--mpa-color-text-muted);font-size:var(--mpa-font-size-sm)">{{ row.detail }}</p>
              <span style="font-size:var(--mpa-font-size-xs);color:var(--mpa-color-text-muted)">
                {{ row.email }} · {{ formatDate(row.timestamp) }}
                @if (row.organizationName) { · {{ row.organizationName }} }
                @if (row.location) { · {{ row.location }} }
              </span>
            </article>
          } @empty {
            <div class="ops-empty">No activity for this filter.</div>
          }
        </div>
      </div>
    </app-sa-page>
  `,
  styleUrl: './ops-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsActivityPageComponent {
  readonly store = inject(OperationsAdminStoreService);
  readonly view = inject(OperationsViewStateService);
  readonly filters = ['all', 'login', 'failed_login', 'session', 'security', 'org', 'builder'] as const;
  formatDate = formatOpsDate;

  readonly filtered = computed(() => {
    const f = this.view.activityFilter();
    const rows = this.store.userActivity();
    return f === 'all' ? rows : rows.filter((r) => r.type === f);
  });
}
