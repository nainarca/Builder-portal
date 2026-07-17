import { BuilderPortalPageComponent } from '../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ButtonComponent,
  ExportButtonComponent,
  EnterpriseFormPageHeaderComponent,
  PaginationWrapperComponent,
  SearchFieldComponent,
  SortControlComponent,
} from '@shared/ui';

import { KpiCardComponent } from '../../components/cards';
import { ChartWrapperComponent } from '../../components/charts';
import { DashboardChartConfig, DashboardKpiItem } from '../../models/dashboard.model';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import {
  DocumentAdvancedFiltersComponent,
  DocumentBulkActionsComponent,
  DocumentColumnSelectorComponent,
  DocumentDataGridComponent,
  DocumentGridComponent,
  DocumentQuickFiltersComponent,
  DocumentSavedViewsComponent,
  ExplorerScopeToggleComponent,
  ExplorerToolbarComponent,
  ExplorerViewToggleComponent } from '../components/explorer';
import { DocumentTileComponent } from '../components/shared';
import { DOCUMENT_SORT_OPTIONS, DOCUMENT_WORKSPACE_HEADER } from '../config/documents.config';
import { DocumentBulkAction, DocumentExplorerScope, DocumentRecord } from '../models/document.model';
import { DocumentListStateService } from '../services/document-list-state.service';
import { DocumentStoreService } from '../services/document-store.service';

@Component({
  selector: 'app-document-workspace-page',
  imports: [ BuilderPortalPageComponent,
    ButtonComponent,
    EnterpriseFormPageHeaderComponent, SearchFieldComponent,
    SortControlComponent,
    ExportButtonComponent,
    PaginationWrapperComponent,
    KpiCardComponent,
    ChartWrapperComponent,
    DocumentTileComponent,
    ExplorerToolbarComponent,
    ExplorerScopeToggleComponent,
    ExplorerViewToggleComponent,
    DocumentQuickFiltersComponent,
    DocumentAdvancedFiltersComponent,
    DocumentColumnSelectorComponent,
    DocumentSavedViewsComponent,
    DocumentBulkActionsComponent,
    DocumentGridComponent,
    DocumentDataGridComponent,
  ],
  templateUrl: './document-workspace-page.component.html',
  styleUrl: './document-workspace-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush })
export class DocumentWorkspacePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(DocumentStoreService);
  private readonly projectStore = inject(ProjectStoreService);
  readonly listState = inject(DocumentListStateService);

  readonly header = DOCUMENT_WORKSPACE_HEADER;
  readonly sortOptions = DOCUMENT_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly projects = computed(() => this.projectStore.projects());
  readonly tableItems = computed(() => [...this.listState.listResult().items]);

  private readonly activeDocuments = computed(() => this.store.documents().filter((d) => !d.archived));

  readonly kpis = computed<readonly DashboardKpiItem[]>(() => {
    const docs = this.activeDocuments();
    const pending = docs.filter((d) => d.approvalStatus === 'pending-review').length;
    const approved = docs.filter((d) => d.approvalStatus === 'approved').length;
    const shared = docs.filter((d) => d.visibility === 'owner-visible').length;
    return [
      { id: 'total-documents', label: 'Total documents', value: String(docs.length), icon: 'pi pi-file', tone: 'primary' },
      { id: 'pending-review', label: 'Pending review', value: String(pending), icon: 'pi pi-clock', tone: 'warning' },
      { id: 'approved', label: 'Approved', value: String(approved), icon: 'pi pi-check-circle', tone: 'success' },
      { id: 'shared', label: 'Shared with owners', value: String(shared), icon: 'pi pi-eye', tone: 'info' },
    ];
  });

  readonly approvalStatusChart = computed<DashboardChartConfig>(() => {
    const docs = this.activeDocuments();
    const labels = ['Draft', 'Pending review', 'Approved', 'Rejected'];
    const counts = [
      docs.filter((d) => d.approvalStatus === 'draft').length,
      docs.filter((d) => d.approvalStatus === 'pending-review').length,
      docs.filter((d) => d.approvalStatus === 'approved').length,
      docs.filter((d) => d.approvalStatus === 'rejected').length,
    ];
    return {
      id: 'approval-status',
      type: 'donut',
      title: 'Approval status',
      subtitle: 'Active documents by workflow stage',
      labels,
      series: [{ label: 'Documents', values: counts }] };
  });

  readonly recentDocuments = computed(() =>
    [...this.activeDocuments()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
  );

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    this.listState.applyInitialFilter(
      params.get('projectId'),
      params.get('unitId'),
      params.get('category'),
    );
  }

  goToUpload(): void {
    void this.router.navigate(['/builder-portal/documents/upload']);
  }

  goToCategories(): void {
    void this.router.navigate(['/builder-portal/documents/categories']);
  }

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onSelectionChange(selection: readonly DocumentRecord[]): void {
    this.listState.setSelection(selection.map((item) => item.id));
  }

  onScopeChange(scope: DocumentExplorerScope): void {
    this.listState.setScope(scope);
    if (scope === 'category') {
      this.goToCategories();
    }
  }

  onCardPageChange(event: unknown): void {
    const paginatorEvent = event as { first?: number; rows?: number };
    const rows = paginatorEvent.rows ?? this.listState.pageSize();
    const first = paginatorEvent.first ?? 0;
    if (rows !== this.listState.pageSize()) {
      this.listState.setPageSize(rows);
      return;
    }
    this.listState.setPage(Math.floor(first / rows) + 1);
  }

  async onBulkAction(action: DocumentBulkAction): Promise<void> {
    await this.listState.executeBulkAction(action);
  }

  async exportAll(): Promise<void> {
    await this.listState.exportAll();
  }
}
