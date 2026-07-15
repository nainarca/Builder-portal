import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  BasePageComponent,
  ButtonComponent,
  ExportButtonComponent,
  PageHeaderComponent,
  PaginationWrapperComponent,
  SearchFieldComponent,
  SortControlComponent,
  TableShellComponent,
  TableToolbarComponent,
} from '@shared/ui';

import {
  ProjectAdvancedFiltersComponent,
  ProjectBulkActionsComponent,
  ProjectCardGridComponent,
  ProjectColumnSelectorComponent,
  ProjectDataGridComponent,
  ProjectQuickFiltersComponent,
  ProjectSavedViewsComponent,
  ProjectViewToggleComponent,
} from '../components/list';
import { PROJECT_SORT_OPTIONS } from '../config/projects.config';
import { Project, ProjectBulkAction } from '../models/project.model';
import { ProjectListStateService } from '../services/project-list-state.service';

@Component({
  selector: 'app-project-list-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    TableShellComponent,
    TableToolbarComponent,
    SearchFieldComponent,
    SortControlComponent,
    ExportButtonComponent,
    PaginationWrapperComponent,
    ButtonComponent,
    AuthorizedButtonComponent,
    ProjectDataGridComponent,
    ProjectCardGridComponent,
    ProjectViewToggleComponent,
    ProjectQuickFiltersComponent,
    ProjectAdvancedFiltersComponent,
    ProjectColumnSelectorComponent,
    ProjectSavedViewsComponent,
    ProjectBulkActionsComponent,
  ],
  templateUrl: './project-list-page.component.html',
  styleUrl: './project-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(ProjectListStateService);

  readonly sortOptions = PROJECT_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly tableItems = computed(() => [...this.listState.listResult().items]);

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onSelectionChange(selection: readonly Project[]): void {
    this.listState.setSelection(selection.map((item) => item.id));
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

  async onBulkAction(action: ProjectBulkAction): Promise<void> {
    await this.listState.executeBulkAction(action);
  }

  createProject(): void {
    void this.router.navigate(['/builder-portal/projects/create']);
  }

  async exportAll(): Promise<void> {
    await this.listState.exportAll();
  }

  openImport(): void {
    this.listState.openImportDialog();
  }
}
