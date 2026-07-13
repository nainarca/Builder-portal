import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  BasePageComponent,
  ButtonComponent,
  ExportButtonComponent,
  PageHeaderComponent,
  SearchFieldComponent,
  SortControlComponent,
  TableShellComponent,
  TableToolbarComponent,
} from '@shared/ui';

import {
  OrganizationAdvancedFiltersComponent,
  OrganizationBulkActionsComponent,
  OrganizationColumnSelectorComponent,
  OrganizationDataGridComponent,
  OrganizationQuickFiltersComponent,
  OrganizationSavedViewsComponent,
} from '../components/list';
import { ORGANIZATION_SORT_OPTIONS } from '../config/organizations.config';
import { OrganizationAdminRecord, OrganizationBulkAction } from '../models/organization-admin.model';
import { OrganizationListStateService } from '../services/organization-list-state.service';

@Component({
  selector: 'app-organization-list-page',
  imports: [
    BasePageComponent,
    PageHeaderComponent,
    TableShellComponent,
    TableToolbarComponent,
    SearchFieldComponent,
    SortControlComponent,
    ExportButtonComponent,
    ButtonComponent,
    AuthorizedButtonComponent,
    OrganizationDataGridComponent,
    OrganizationQuickFiltersComponent,
    OrganizationAdvancedFiltersComponent,
    OrganizationColumnSelectorComponent,
    OrganizationSavedViewsComponent,
    OrganizationBulkActionsComponent,
  ],
  templateUrl: './organization-list-page.component.html',
  styleUrl: './organization-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(OrganizationListStateService);

  readonly sortOptions = ORGANIZATION_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));

  readonly tableItems = computed(() => [...this.listState.listResult().items]);

  onSearch(value: string): void {
    this.listState.setSearch(value);
  }

  onSort(value: string): void {
    this.listState.setSort(value);
  }

  onSelectionChange(selection: readonly OrganizationAdminRecord[]): void {
    this.listState.setSelection(selection.map((item) => item.id));
  }

  async onBulkAction(action: OrganizationBulkAction): Promise<void> {
    await this.listState.executeBulkAction(action);
  }

  createOrganization(): void {
    void this.router.navigate(['/super-admin/organizations/new']);
  }

  async exportAll(): Promise<void> {
    await this.listState.exportAll();
  }

  openImport(): void {
    this.listState.openImportDialog();
  }
}
