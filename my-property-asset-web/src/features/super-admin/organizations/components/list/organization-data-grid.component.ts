import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { EnterpriseTableEmptyComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from '../shared/organization-avatar.component';
import { OrganizationStatusBadgeComponent } from '../shared/organization-status-badge.component';

@Component({
  selector: 'app-org-data-grid',
  imports: [
    RouterLink,
    TableModule,
    DatePipe,
    TitleCasePipe,
    OrganizationAvatarComponent,
    OrganizationStatusBadgeComponent,
    EnterpriseTableEmptyComponent,
  ],
  template: `
    <p-table
      [value]="gridItems()"
      [loading]="loading()"
      [paginator]="true"
      [rows]="pageSize()"
      [totalRecords]="total()"
      [lazy]="false"
      [rowsPerPageOptions]="[10, 25, 50]"
      [(selection)]="selectionModel"
      dataKey="id"
      [stripedRows]="true"
      (onPage)="pageChange.emit($event)"
    >
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem">
            <p-tableHeaderCheckbox />
          </th>
          @if (isColumnVisible('name')) {
            <th pSortableColumn="name">Organization <p-sortIcon field="name" /></th>
          }
          @if (isColumnVisible('type')) {
            <th>Type</th>
          }
          @if (isColumnVisible('status')) {
            <th>Status</th>
          }
          @if (isColumnVisible('region')) {
            <th>Region</th>
          }
          @if (isColumnVisible('plan')) {
            <th>Plan</th>
          }
          @if (isColumnVisible('memberCount')) {
            <th pSortableColumn="memberCount">Members <p-sortIcon field="memberCount" /></th>
          }
          @if (isColumnVisible('subscriptionTier')) {
            <th>Subscription</th>
          }
          @if (isColumnVisible('createdAt')) {
            <th>Created</th>
          }
          @if (isColumnVisible('updatedAt')) {
            <th>Updated</th>
          }
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-org>
        <tr>
          <td>
            <p-tableCheckbox [value]="org" />
          </td>
          @if (isColumnVisible('name')) {
            <td>
              <a class="org-grid__name-link" [routerLink]="['/super-admin/organizations', org.id]">
                <app-org-avatar [name]="org.name" [logoUrl]="org.logoUrl" [primaryColor]="org.primaryColor" size="sm" />
                <span>
                  <strong>{{ org.name }}</strong>
                  @if (org.shortName) {
                    <small>{{ org.shortName }}</small>
                  }
                </span>
              </a>
            </td>
          }
          @if (isColumnVisible('type')) {
            <td>{{ org.type | titlecase }}</td>
          }
          @if (isColumnVisible('status')) {
            <td><app-org-status-badge [status]="org.status" /></td>
          }
          @if (isColumnVisible('region')) {
            <td>{{ org.region || '—' }}</td>
          }
          @if (isColumnVisible('plan')) {
            <td>{{ org.plan || '—' }}</td>
          }
          @if (isColumnVisible('memberCount')) {
            <td>{{ org.memberCount }}</td>
          }
          @if (isColumnVisible('subscriptionTier')) {
            <td>{{ org.subscriptionTier }}</td>
          }
          @if (isColumnVisible('createdAt')) {
            <td>{{ org.createdAt | date: 'mediumDate' }}</td>
          }
          @if (isColumnVisible('updatedAt')) {
            <td>{{ org.updatedAt | date: 'mediumDate' }}</td>
          }
          <td>
            <a class="org-grid__view-link" [routerLink]="['/super-admin/organizations', org.id]">View</a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="visibleColumnCount() + 2">
            <app-enterprise-table-empty
              title="No organizations match your filters"
              description="Try clearing filters or create a new organization."
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationDataGridComponent {
  readonly items = input.required<readonly OrganizationAdminRecord[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(10);
  readonly visibleColumns = input<string[]>([]);
  readonly selected = input<readonly OrganizationAdminRecord[]>([]);

  readonly selectionChange = output<readonly OrganizationAdminRecord[]>();
  readonly pageChange = output<unknown>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: OrganizationAdminRecord[] = [];

  get selectionModel(): OrganizationAdminRecord[] {
    return this._selectionModel;
  }

  set selectionModel(value: OrganizationAdminRecord[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }

  isColumnVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }

  visibleColumnCount(): number {
    return this.visibleColumns().length;
  }
}
