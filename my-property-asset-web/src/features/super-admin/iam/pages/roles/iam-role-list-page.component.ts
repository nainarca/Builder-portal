import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import {
  EnterpriseDataTableShellComponent,
  EnterpriseFormPageHeaderComponent,
} from '@shared/ui';

import { SuperAdminPageComponent } from '../../../components/layout';
import { mapQuickFilters } from '../../../utils/super-admin-table.helpers';
import { IamRoleDataGridComponent } from '../../components/roles/list';
import { IamSectionNavComponent } from '../../components/shared';
import { RoleListStateService } from '../../services/role-list-state.service';

const SCOPE_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All roles' },
  { id: 'platform' as const, label: 'Platform' },
  { id: 'organization' as const, label: 'Organization' },
];

@Component({
  selector: 'app-iam-role-list-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    IamSectionNavComponent,
    IamRoleDataGridComponent,
  ],
  template: `
    <app-sa-page>
      <div class="iam-page">
        <app-enterprise-form-page-header
          eyebrow="Identity & Access"
          title="Roles"
          subtitle="System and organization roles with permission assignments."
          mode="view"
        />
        <app-iam-section-nav />
        <app-enterprise-data-table-shell
          [state]="listState.loading() ? 'loading' : 'idle'"
          [searchValue]="listState.search()"
          searchPlaceholder="Search roles…"
          tableAriaLabel="Roles table"
          [quickFilters]="scopeQuickFilters()"
          [showColumnSelector]="false"
          [showExport]="false"
          [showDensity]="false"
          [showPagination]="false"
          (searchChange)="listState.setSearch($event)"
          (quickFilterToggle)="onScopeFilter($event)"
        >
          <app-iam-role-data-grid
            tableBody
            [items]="listState.listResult().items"
            [loading]="listState.loading()"
            [total]="listState.listResult().total"
            [pageSize]="listState.pageSize()"
          />
        </app-enterprise-data-table-shell>
        <p class="iam-custom-roles-hint">
          <i class="pi pi-info-circle" aria-hidden="true"></i>
          Custom roles framework — UI placeholder for enterprise expansion.
        </p>
      </div>
    </app-sa-page>
  `,
  styleUrl: './iam-role-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleListPageComponent {
  readonly listState = inject(RoleListStateService);

  readonly scopeQuickFilters = computed(() =>
    mapQuickFilters(SCOPE_QUICK_FILTER_OPTIONS, this.listState.scopeFilter()),
  );

  onScopeFilter(filterId: string): void {
    this.listState.setScopeFilter(filterId as 'all' | 'platform' | 'organization');
  }
}
