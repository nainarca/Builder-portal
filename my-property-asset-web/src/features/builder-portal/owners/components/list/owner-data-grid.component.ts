import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { EnterpriseTableEmptyComponent } from '@shared/ui';

import { OwnerListItem } from '../../models/owner.model';
import { CustomerAvatarComponent } from '../shared/customer-avatar.component';
import { InvitationBadgeComponent } from '../shared/invitation-badge.component';
import { OwnerStatusBadgeComponent } from '../shared/owner-status-badge.component';

@Component({
  selector: 'app-owner-data-grid',
  imports: [RouterLink, TableModule, CustomerAvatarComponent, OwnerStatusBadgeComponent, InvitationBadgeComponent, EnterpriseTableEmptyComponent],
  template: `
    <p-table
      [value]="gridItems()"
      [loading]="loading()"
      [paginator]="true"
      [rows]="pageSize()"
      [totalRecords]="total()"
      [(selection)]="selectionModel"
      dataKey="owner.id"
      [stripedRows]="true"
      (onPage)="pageChange.emit($event)"
    >
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem">
            <p-tableHeaderCheckbox />
          </th>
          @if (isColumnVisible('name')) {
            <th>Owner</th>
          }
          @if (isColumnVisible('contact')) {
            <th>Contact</th>
          }
          @if (isColumnVisible('unit')) {
            <th>Assigned unit</th>
          }
          @if (isColumnVisible('activation')) {
            <th>Activation</th>
          }
          @if (isColumnVisible('invitation')) {
            <th>Invitation</th>
          }
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>
            <p-tableCheckbox [value]="item" />
          </td>
          @if (isColumnVisible('name')) {
            <td>
              <a class="owner-grid__name-link" [routerLink]="['/builder-portal/owners', item.owner.id]">
                <app-customer-avatar [name]="fullName(item)" size="sm" />
                <span>
                  <strong>{{ fullName(item) }}</strong>
                  <span class="owner-grid__meta">{{ item.owner.city }}</span>
                </span>
              </a>
            </td>
          }
          @if (isColumnVisible('contact')) {
            <td>{{ item.owner.email }}<br /><span class="owner-grid__meta">{{ item.owner.phone }}</span></td>
          }
          @if (isColumnVisible('unit')) {
            <td>
              @if (item.assignment) {
                {{ item.assignment.unitNumber }} · {{ item.assignment.projectName }}
              } @else {
                <span class="owner-grid__meta">Unassigned</span>
              }
            </td>
          }
          @if (isColumnVisible('activation')) {
            <td><app-owner-status-badge [status]="item.owner.activationStatus" /></td>
          }
          @if (isColumnVisible('invitation')) {
            <td>
              @if (item.assignment) {
                <app-invitation-badge [status]="item.assignment.invitation.status" />
              } @else {
                <span class="owner-grid__meta">—</span>
              }
            </td>
          }
          <td>
            <a class="owner-grid__view-link" [routerLink]="['/builder-portal/owners', item.owner.id]">View</a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="visibleColumnCount() + 2">
            <app-enterprise-table-empty
              title="No owners match your filters"
              description="Try adjusting filters or clearing search."
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerDataGridComponent {
  readonly items = input.required<readonly OwnerListItem[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(12);
  readonly visibleColumns = input<string[]>([]);

  readonly selectionChange = output<readonly OwnerListItem[]>();
  readonly pageChange = output<unknown>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: OwnerListItem[] = [];

  get selectionModel(): OwnerListItem[] {
    return this._selectionModel;
  }

  set selectionModel(value: OwnerListItem[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }

  isColumnVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }

  visibleColumnCount(): number {
    return this.visibleColumns().length;
  }

  fullName(item: OwnerListItem): string {
    return `${item.owner.firstName} ${item.owner.lastName}`;
  }
}
