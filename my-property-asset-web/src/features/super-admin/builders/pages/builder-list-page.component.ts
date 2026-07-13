import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import { BasePageComponent, ButtonComponent, ExportButtonComponent, PageHeaderComponent, SearchFieldComponent, SortControlComponent, TableShellComponent, TableToolbarComponent } from '@shared/ui';

import { BuilderAdvancedFiltersComponent, BuilderBulkActionsComponent, BuilderColumnSelectorComponent, BuilderDataGridComponent, BuilderQuickFiltersComponent, BuilderSavedViewsComponent } from '../components/list';
import { BUILDER_SORT_OPTIONS } from '../config/builders.config';
import { BuilderAdminRecord, BuilderBulkAction } from '../models/builder-admin.model';
import { BuilderListStateService } from '../services/builder-list-state.service';

@Component({
  selector: 'app-builder-list-page',
  imports: [
    BasePageComponent, PageHeaderComponent, TableShellComponent, TableToolbarComponent,
    SearchFieldComponent, SortControlComponent, ExportButtonComponent, ButtonComponent,
    AuthorizedButtonComponent, BuilderDataGridComponent, BuilderQuickFiltersComponent,
    BuilderAdvancedFiltersComponent, BuilderColumnSelectorComponent, BuilderSavedViewsComponent, BuilderBulkActionsComponent,
  ],
  templateUrl: './builder-list-page.component.html',
  styleUrl: './builder-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(BuilderListStateService);
  readonly sortOptions = BUILDER_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));
  readonly tableItems = computed(() => [...this.listState.listResult().items]);

  onSearch(v: string): void { this.listState.setSearch(v); }
  onSort(v: string): void { this.listState.setSort(v); }
  onSelectionChange(s: readonly BuilderAdminRecord[]): void { this.listState.setSelection(s.map((b) => b.id)); }
  async onBulkAction(a: BuilderBulkAction): Promise<void> { await this.listState.executeBulkAction(a); }
  createBuilder(): void { void this.router.navigate(['/super-admin/builders/new']); }
  async exportAll(): Promise<void> { await this.listState.exportAll(); }
  openImport(): void { this.listState.openImportDialog(); }
}
