import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  BasePageComponent,
  ButtonComponent,
  PageHeaderComponent,
  PaginationWrapperComponent,
  SearchFieldComponent,
  TableShellComponent,
} from '@shared/ui';
import { KpiCardComponent } from '../../components/cards';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import {
  COMMUNICATION_STATUS_OPTIONS,
  COMMUNICATION_TYPE_OPTIONS,
  COMMUNICATION_WORKSPACE_HEADER,
} from '../config/communications.config';
import { CommunicationDashboardService } from '../services/communication-dashboard.service';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-communication-workspace-page',
  imports: [
    RouterLink,
    BasePageComponent,
    PageHeaderComponent,
    AuthorizedButtonComponent,
    SearchFieldComponent,
    TableShellComponent,
    PaginationWrapperComponent,
    KpiCardComponent,
  ],
  template: `
    <app-base-page>
      <div class="comm-page">
        <app-page-header
          [eyebrow]="header.eyebrow"
          [title]="header.title"
          [description]="header.description"
        >
          <app-authorized-button
            pageActions
            label="Create communication"
            icon="pi pi-plus"
            permission="id-11-notification:contribute"
            (clicked)="create()"
          />
        </app-page-header>

        <section class="comm-page__kpis">
          @for (kpi of kpis(); track kpi.id) {
            <app-bp-kpi-card [item]="kpi" />
          }
        </section>

        <app-table-shell title="Communications" description="Search, filter, and manage owner messages.">
          <div tableToolbar class="comm-page__toolbar">
            <app-search-field
              [value]="communicationService.query().search"
              placeholder="Search communications"
              (valueChange)="onSearch($event)"
            />
            <select [value]="communicationService.query().status" (change)="onStatusChange($event)">
              @for (option of statusOptions; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
            <select [value]="communicationService.query().communicationType" (change)="onTypeChange($event)">
              <option value="all">All types</option>
              @for (option of typeOptions; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
            <select [value]="communicationService.query().projectId" (change)="onProjectChange($event)">
              <option value="">All projects</option>
              @for (project of projects(); track project.id) {
                <option [value]="project.id">{{ project.name }}</option>
              }
            </select>
          </div>

          <table class="comm-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Recipients</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              @for (item of listResult().items; track item.id) {
                <tr>
                  <td><a [routerLink]="['/builder-portal/communications', item.id]">{{ item.title }}</a></td>
                  <td>{{ item.communicationType }}</td>
                  <td><span class="comm-badge comm-badge--{{ item.status }}">{{ item.status }}</span></td>
                  <td>{{ item.priority }}</td>
                  <td>{{ item.recipientCount }}</td>
                  <td>{{ formatDate(item.updatedAt) }}</td>
                </tr>
              } @empty {
                <tr><td colspan="6">No communications found.</td></tr>
              }
            </tbody>
          </table>

          <app-pagination-wrapper
            [rows]="listResult().pageSize"
            [totalRecords]="listResult().total"
            [first]="(listResult().page - 1) * listResult().pageSize"
            (pageChange)="onPageChange($event)"
          />
        </app-table-shell>
      </div>
    </app-base-page>
  `,
  styles: `
    .comm-page { display: grid; gap: 1.25rem; }
    .comm-page__kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
    .comm-page__toolbar { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
    .comm-page__toolbar select {
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
    }
    .comm-table { width: 100%; border-collapse: collapse; }
    .comm-table th, .comm-table td {
      padding: 0.75rem;
      border-bottom: 1px solid var(--mpa-color-border);
      text-align: left;
    }
    .comm-badge {
      display: inline-flex;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      font-size: 0.75rem;
      text-transform: capitalize;
      background: color-mix(in srgb, var(--mpa-color-primary) 12%, transparent);
    }
    .comm-badge--published { background: color-mix(in srgb, var(--mpa-color-success) 18%, transparent); }
    .comm-badge--scheduled { background: color-mix(in srgb, var(--mpa-color-warning) 18%, transparent); }
    .comm-badge--draft { background: color-mix(in srgb, var(--mpa-color-text-muted) 18%, transparent); }
    @media (max-width: 1080px) { .comm-page__kpis { grid-template-columns: 1fr 1fr; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunicationWorkspacePageComponent {
  private readonly router = inject(Router);
  private readonly dashboard = inject(CommunicationDashboardService);
  private readonly projectStore = inject(ProjectStoreService);
  readonly communicationService = inject(CommunicationService);

  readonly header = COMMUNICATION_WORKSPACE_HEADER;
  readonly statusOptions = COMMUNICATION_STATUS_OPTIONS;
  readonly typeOptions = COMMUNICATION_TYPE_OPTIONS;
  readonly listResult = this.communicationService.listResult;
  readonly projects = computed(() => this.projectStore.projects());

  readonly kpis = computed(() => {
    const summary = this.dashboard.summary();
    return [
      { id: 'draft', label: 'Draft messages', value: String(summary.draftCount), icon: 'pi pi-file-edit', tone: 'neutral' as const },
      { id: 'published', label: 'Published', value: String(summary.publishedCount), icon: 'pi pi-send', tone: 'success' as const },
      { id: 'scheduled', label: 'Scheduled', value: String(summary.scheduledCount), icon: 'pi pi-calendar', tone: 'warning' as const },
      { id: 'recipients', label: 'Total recipients', value: String(summary.totalRecipients), icon: 'pi pi-users', tone: 'primary' as const },
    ];
  });

  create(): void {
    void this.router.navigate(['/builder-portal/communications/create']);
  }

  onSearch(value: string): void {
    this.communicationService.setQuery({ search: value, page: 1 });
  }

  onStatusChange(event: Event): void {
    this.communicationService.setQuery({
      status: (event.target as HTMLSelectElement).value as typeof COMMUNICATION_STATUS_OPTIONS[number]['value'],
      page: 1,
    });
  }

  onTypeChange(event: Event): void {
    this.communicationService.setQuery({
      communicationType: (event.target as HTMLSelectElement).value as 'all' | typeof COMMUNICATION_TYPE_OPTIONS[number]['value'],
      page: 1,
    });
  }

  onProjectChange(event: Event): void {
    this.communicationService.setQuery({ projectId: (event.target as HTMLSelectElement).value, page: 1 });
  }

  onPageChange(event: unknown): void {
    const pageEvent = event as { first?: number; rows?: number };
    const page = Math.floor((pageEvent.first ?? 0) / (pageEvent.rows ?? this.listResult().pageSize)) + 1;
    this.communicationService.setQuery({ page });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString();
  }
}
