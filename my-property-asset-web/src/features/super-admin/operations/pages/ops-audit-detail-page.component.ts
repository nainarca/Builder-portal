import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { BasePageComponent, PageHeaderComponent } from '@shared/ui';

import { OpsSectionNavComponent, OpsStatusBadgeComponent } from '../components/shared';
import { formatOpsDate } from '../config/operations.config';
import { OperationsAdminStoreService } from '../services/operations-admin-store.service';

@Component({
  selector: 'app-ops-audit-detail-page',
  imports: [BasePageComponent, PageHeaderComponent, RouterLink, OpsSectionNavComponent, OpsStatusBadgeComponent],
  template: `
    <app-base-page>
      <div class="ops-page">
        <app-page-header
          eyebrow="Audit Logs"
          [title]="record()?.action ?? 'Audit event'"
          [description]="record()?.summary ?? 'Event not found'"
        />
        <app-ops-section-nav />
        <a class="ops-action-btn" routerLink="/super-admin/operations/audit"><i class="pi pi-arrow-left" aria-hidden="true"></i> Back to audit list</a>
        @if (record(); as row) {
          <section class="ops-panel ops-detail">
            <app-ops-status-badge [status]="row.outcome" />
            <dl>
              <dt>ID</dt><dd>{{ row.id }}</dd>
              <dt>Actor</dt><dd>{{ row.actorName }} · {{ row.actorEmail }}</dd>
              <dt>Category</dt><dd>{{ row.category }}</dd>
              <dt>Resource</dt><dd>{{ row.resource }}</dd>
              <dt>Timestamp</dt><dd>{{ formatDate(row.timestamp) }}</dd>
              <dt>IP address</dt><dd>{{ row.ipAddress }}</dd>
              @if (row.organizationName) { <dt>Organization</dt><dd>{{ row.organizationName }}</dd> }
              @if (row.builderName) { <dt>Builder</dt><dd>{{ row.builderName }}</dd> }
            </dl>
          </section>
        } @else {
          <div class="ops-empty">Audit record not found.</div>
        }
      </div>
    </app-base-page>
  `,
  styleUrl: './ops-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsAuditDetailPageComponent {
  private readonly store = inject(OperationsAdminStoreService);
  private readonly route = inject(ActivatedRoute);
  formatDate = formatOpsDate;

  private readonly id = toSignal(this.route.paramMap.pipe(map((p) => p.get('id'))), {
    initialValue: null as string | null,
  });

  readonly record = computed(() => {
    const id = this.id();
    return id ? this.store.getAuditById(id) : undefined;
  });
}
