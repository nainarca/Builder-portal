import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import {
  OpsActivityCardComponent,
  OpsSectionNavComponent,
  OpsStatusBadgeComponent,
} from '../components/shared';
import { AUDIT_CATEGORIES, formatOpsDate } from '../config/operations.config';
import { OperationsAdminStoreService } from '../services/operations-admin-store.service';
import { OperationsViewStateService } from '../services/operations-view-state.service';

@Component({
  selector: 'app-ops-audit-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    ButtonComponent,
    RouterLink,
    OpsSectionNavComponent,
    OpsActivityCardComponent,
    OpsStatusBadgeComponent,
  ],
  template: `
    <app-base-page>
      <div class="ops-page">
        <app-page-header
          eyebrow="Operations"
          title="Audit Logs"
          description="Searchable immutable trail of platform, organization, and builder activity."
        >
          <app-button pageActions label="Export CSV" icon="pi pi-download" [outlined]="true" (clicked)="exportHint = true" />
        </app-page-header>
        <app-ops-section-nav />

        <div class="ops-toolbar">
          <label class="ops-search">
            <i class="pi pi-search" aria-hidden="true"></i>
            <input
              type="search"
              placeholder="Search actors, actions, resources…"
              [value]="view.auditQuery()"
              (input)="view.setAuditQuery($any($event.target).value)"
            />
          </label>
          @for (cat of categories; track cat.id) {
            <button
              type="button"
              class="ops-chip"
              [class.ops-chip--active]="view.auditCategory() === cat.id"
              (click)="view.setAuditCategory(cat.id)"
            >
              {{ cat.label }}
            </button>
          }
        </div>

        <div class="ops-toolbar">
          @for (outcome of outcomes; track outcome) {
            <button
              type="button"
              class="ops-chip"
              [class.ops-chip--active]="view.auditOutcome() === outcome"
              (click)="view.setAuditOutcome(outcome)"
            >
              {{ outcome }}
            </button>
          }
          <span class="ops-kpi__label" style="margin-left:auto">Retention: 365 days · {{ filtered().length }} events</span>
        </div>

        @if (exportHint) {
          <div class="ops-empty">Export is a UI placeholder — wire to reporting in a future release.</div>
        }

        <div class="ops-dashboard-grid">
          <div class="ops-dashboard-grid__main ops-stack">
            @for (row of filtered(); track row.id) {
              <app-ops-activity-card [entry]="row" (selectEntry)="view.selectAudit($event)" />
            } @empty {
              <div class="ops-empty">No audit events match your filters.</div>
            }
          </div>
          <aside class="ops-dashboard-grid__aside">
            <section class="ops-panel ops-detail">
              <h2 class="ops-panel__title">Audit details</h2>
              @if (selected(); as row) {
                <app-ops-status-badge [status]="row.outcome" />
                <dl>
                  <dt>Action</dt><dd>{{ row.action }}</dd>
                  <dt>Actor</dt><dd>{{ row.actorName }} ({{ row.actorEmail }})</dd>
                  <dt>Category</dt><dd>{{ row.category }}</dd>
                  <dt>Resource</dt><dd>{{ row.resource }}</dd>
                  <dt>When</dt><dd>{{ formatDate(row.timestamp) }}</dd>
                  <dt>IP</dt><dd>{{ row.ipAddress }}</dd>
                  @if (row.organizationName) {
                    <dt>Organization</dt><dd>{{ row.organizationName }}</dd>
                  }
                  @if (row.builderName) {
                    <dt>Builder</dt><dd>{{ row.builderName }}</dd>
                  }
                  <dt>Summary</dt><dd>{{ row.summary }}</dd>
                </dl>
                @if (row.metadata) {
                  <h3 class="ops-panel__title">Metadata</h3>
                  <dl>
                    @for (entry of metadataEntries(row.metadata); track entry[0]) {
                      <dt>{{ entry[0] }}</dt><dd>{{ entry[1] }}</dd>
                    }
                  </dl>
                }
                <a class="ops-action-btn" [routerLink]="['/super-admin/operations/audit', row.id]">Open full view</a>
              } @else {
                <div class="ops-empty">Select an audit event to inspect details.</div>
              }
            </section>
          </aside>
        </div>
      </div>
    </app-base-page>
  `,
  styleUrl: './ops-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpsAuditPageComponent {
  readonly store = inject(OperationsAdminStoreService);
  readonly view = inject(OperationsViewStateService);
  readonly categories = AUDIT_CATEGORIES;
  readonly outcomes = ['all', 'success', 'failure', 'denied'] as const;
  exportHint = false;
  formatDate = formatOpsDate;

  readonly filtered = computed(() =>
    this.store.filterAudit({
      query: this.view.auditQuery(),
      category: this.view.auditCategory(),
      outcome: this.view.auditOutcome(),
    }),
  );

  readonly selected = computed(() => {
    const id = this.view.selectedAuditId();
    if (!id) return this.filtered()[0];
    return this.store.getAuditById(id) ?? this.filtered()[0];
  });

  metadataEntries(meta: Record<string, string>): [string, string][] {
    return Object.entries(meta);
  }
}
