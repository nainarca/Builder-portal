import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BasePageComponent, PageHeaderComponent, SearchFieldComponent, TableShellComponent, TableToolbarComponent } from '@shared/ui';

import { IamRoleDataGridComponent, IamRoleQuickFiltersComponent } from '../../components/roles/list';
import { IamSectionNavComponent } from '../../components/shared';
import { RoleListStateService } from '../../services/role-list-state.service';

@Component({
  selector: 'app-iam-role-list-page',
  imports: [
    BasePageComponent, PageHeaderComponent, TableShellComponent, TableToolbarComponent,
    SearchFieldComponent, IamSectionNavComponent, IamRoleDataGridComponent, IamRoleQuickFiltersComponent,
  ],
  template: `
    <app-base-page>
      <div class="iam-page">
        <app-page-header eyebrow="Identity & Access" title="Roles"
          description="System and organization roles with permission assignments." />
        <app-iam-section-nav />
        <app-iam-role-quick-filters [selected]="listState.scopeFilter()"
          (selectedChange)="listState.setScopeFilter($event)" />
        <app-table-shell [value]="tableItems()" [loading]="listState.loading()">
          <app-table-toolbar tableToolbar>
            <app-search-field toolbarStart [value]="listState.search()" placeholder="Search roles…"
              ariaLabel="Search roles" (valueChange)="listState.setSearch($event)" />
          </app-table-toolbar>
          <app-iam-role-data-grid [items]="listState.listResult().items" [loading]="listState.loading()"
            [total]="listState.listResult().total" [pageSize]="listState.pageSize()" />
        </app-table-shell>
        <p class="iam-custom-roles-hint">
          <i class="pi pi-info-circle" aria-hidden="true"></i>
          Custom roles framework — UI placeholder for enterprise expansion.
        </p>
      </div>
    </app-base-page>
  `,
  styleUrl: './iam-role-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleListPageComponent {
  readonly listState = inject(RoleListStateService);
  readonly tableItems = computed(() => [...this.listState.listResult().items]);
}
