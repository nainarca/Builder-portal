import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  BasePageComponent, ButtonComponent, ExportButtonComponent, PageHeaderComponent,
  SearchFieldComponent, SortControlComponent, TableShellComponent, TableToolbarComponent,
} from '@shared/ui';

import { IamSectionNavComponent } from '../../components/shared';
import {
  IamUserAdvancedFiltersComponent, IamUserBulkActionsComponent, IamUserColumnSelectorComponent,
  IamUserDataGridComponent, IamUserQuickFiltersComponent, IamUserSavedViewsComponent,
} from '../../components/users/list';
import { USER_SORT_OPTIONS } from '../../config/iam.config';
import { UserAdminRecord, UserBulkAction } from '../../models/user-admin.model';
import { UserListStateService } from '../../services/user-list-state.service';

@Component({
  selector: 'app-iam-user-list-page',
  imports: [
    BasePageComponent, PageHeaderComponent, TableShellComponent, TableToolbarComponent,
    SearchFieldComponent, SortControlComponent, ExportButtonComponent, ButtonComponent,
    AuthorizedButtonComponent, IamSectionNavComponent,
    IamUserDataGridComponent, IamUserQuickFiltersComponent, IamUserAdvancedFiltersComponent,
    IamUserColumnSelectorComponent, IamUserSavedViewsComponent, IamUserBulkActionsComponent,
  ],
  templateUrl: './iam-user-list-page.component.html',
  styleUrl: './iam-user-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserListPageComponent {
  private readonly router = inject(Router);
  readonly listState = inject(UserListStateService);
  readonly sortOptions = USER_SORT_OPTIONS.map((o) => ({ label: o.label, value: o.value }));
  readonly tableItems = computed(() => [...this.listState.listResult().items]);

  onSearch(v: string): void { this.listState.setSearch(v); }
  onSort(v: string): void { this.listState.setSort(v); }
  onSelectionChange(s: readonly UserAdminRecord[]): void { this.listState.setSelection(s.map((u) => u.id)); }
  async onBulkAction(a: UserBulkAction): Promise<void> { await this.listState.executeBulkAction(a); }
  createUser(): void { void this.router.navigate(['/super-admin/iam/users/new']); }
  async exportAll(): Promise<void> { await this.listState.exportAll(); }
  openImport(): void { this.listState.openImportDialog(); }
}
