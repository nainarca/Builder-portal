import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { UserAdminRecord } from '../../../models/user-admin.model';
import { IamRoleBadgeComponent, IamUserAvatarComponent, IamUserStatusBadgeComponent } from '../../shared';

@Component({
  selector: 'app-iam-user-data-grid',
  imports: [RouterLink, TableModule, DatePipe, IamUserAvatarComponent, IamUserStatusBadgeComponent, IamRoleBadgeComponent],
  template: `
    <p-table [value]="gridItems()" [loading]="loading()" [paginator]="true" [rows]="pageSize()"
      [totalRecords]="total()" [rowsPerPageOptions]="[10, 25, 50]" [(selection)]="selectionModel"
      dataKey="id" [stripedRows]="true">
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
          @if (isColumnVisible('displayName')) { <th pSortableColumn="displayName">User <p-sortIcon field="displayName" /></th> }
          @if (isColumnVisible('email')) { <th>Email</th> }
          @if (isColumnVisible('status')) { <th>Status</th> }
          @if (isColumnVisible('primaryRole')) { <th>Role</th> }
          @if (isColumnVisible('organizationName')) { <th>Organization</th> }
          @if (isColumnVisible('builderName')) { <th>Builder</th> }
          @if (isColumnVisible('lastLoginAt')) { <th>Last login</th> }
          @if (isColumnVisible('mfaEnabled')) { <th>MFA</th> }
          @if (isColumnVisible('createdAt')) { <th>Created</th> }
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-u>
        <tr>
          <td><p-tableCheckbox [value]="u" /></td>
          @if (isColumnVisible('displayName')) {
            <td>
              <a class="iam-grid__link" [routerLink]="['/super-admin/iam/users', u.id]">
                <app-iam-user-avatar [name]="u.displayName" [avatarUrl]="u.avatarUrl" size="sm" />
                <strong>{{ u.displayName }}</strong>
              </a>
            </td>
          }
          @if (isColumnVisible('email')) { <td>{{ u.email }}</td> }
          @if (isColumnVisible('status')) { <td><app-iam-user-status-badge [status]="u.status" /></td> }
          @if (isColumnVisible('primaryRole')) { <td><app-iam-role-badge [role]="u.primaryRole" /></td> }
          @if (isColumnVisible('organizationName')) { <td>{{ u.organizationName || '—' }}</td> }
          @if (isColumnVisible('builderName')) { <td>{{ u.builderName || '—' }}</td> }
          @if (isColumnVisible('lastLoginAt')) { <td>{{ u.lastLoginAt ? (u.lastLoginAt | date: 'mediumDate') : '—' }}</td> }
          @if (isColumnVisible('mfaEnabled')) { <td>{{ u.mfaEnabled ? 'Yes' : 'No' }}</td> }
          @if (isColumnVisible('createdAt')) { <td>{{ u.createdAt | date: 'mediumDate' }}</td> }
          <td><a class="iam-grid__view" [routerLink]="['/super-admin/iam/users', u.id]">View</a></td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr><td [attr.colspan]="visibleColumnCount() + 2">No users match your filters.</td></tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserDataGridComponent {
  readonly items = input.required<readonly UserAdminRecord[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(10);
  readonly visibleColumns = input<string[]>([]);
  readonly selectionChange = output<readonly UserAdminRecord[]>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: UserAdminRecord[] = [];
  get selectionModel(): UserAdminRecord[] { return this._selectionModel; }
  set selectionModel(value: UserAdminRecord[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }

  isColumnVisible(id: string): boolean { return this.visibleColumns().includes(id); }
  visibleColumnCount(): number { return this.visibleColumns().length; }
}
