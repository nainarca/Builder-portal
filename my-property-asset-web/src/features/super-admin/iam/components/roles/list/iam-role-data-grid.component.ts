import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { EnterpriseTableEmptyComponent } from '@shared/ui';

import { RoleAdminRecord } from '../../../models/role-admin.model';
import { IamRoleBadgeComponent } from '../../shared';

@Component({
  selector: 'app-iam-role-data-grid',
  imports: [RouterLink, TableModule, IamRoleBadgeComponent, EnterpriseTableEmptyComponent],
  template: `
    <p-table [value]="gridItems()" [loading]="loading()" [paginator]="true" [rows]="pageSize()"
      [totalRecords]="total()" [stripedRows]="true">
      <ng-template pTemplate="header">
        <tr>
          <th>Role</th>
          <th>Scope</th>
          <th>Users</th>
          <th>Permissions</th>
          <th>Type</th>
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-r>
        <tr>
          <td>
            <a class="iam-grid__link" [routerLink]="['/super-admin/iam/roles', r.id]">
              <app-iam-role-badge [role]="r.id" />
              <span>{{ r.label }}</span>
            </a>
          </td>
          <td><span class="iam-role-scope">{{ r.scope }}</span></td>
          <td>{{ r.userCount }}</td>
          <td>{{ r.permissionCount }}</td>
          <td>{{ r.isSystem ? 'System' : 'Custom' }}</td>
          <td><a class="iam-grid__view" [routerLink]="['/super-admin/iam/roles', r.id]">View</a></td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="6">
            <app-enterprise-table-empty
              title="No roles match your filters"
              description="Try adjusting filters or clearing search."
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleDataGridComponent {
  readonly items = input.required<readonly RoleAdminRecord[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(25);

  readonly gridItems = computed(() => [...this.items()]);
}
