import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TableModule } from 'primeng/table';

import { EnterpriseTableEmptyComponent } from '@shared/ui';

import { InvitationAdminRecord } from '../../models/invitation-admin.model';
import { IamInvitationBadgeComponent, IamRoleBadgeComponent } from '../shared';

@Component({
  selector: 'app-iam-invitation-data-grid',
  imports: [TableModule, DatePipe, IamInvitationBadgeComponent, IamRoleBadgeComponent, EnterpriseTableEmptyComponent],
  template: `
    <p-table [value]="gridItems()" [loading]="loading()" [paginator]="true" [rows]="pageSize()"
      [totalRecords]="total()" [(selection)]="selectionModel" dataKey="id" [stripedRows]="true">
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
          <th>Email</th>
          <th>Role</th>
          <th>Organization</th>
          <th>Status</th>
          <th>Sent</th>
          <th>Expires</th>
          <th style="width: 8rem">Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-inv>
        <tr>
          <td><p-tableCheckbox [value]="inv" /></td>
          <td><strong>{{ inv.email }}</strong>@if (inv.name) { <small>{{ inv.name }}</small> }</td>
          <td><app-iam-role-badge [role]="inv.role" /></td>
          <td>{{ inv.organizationName || '—' }}</td>
          <td><app-iam-invitation-badge [status]="inv.status" /></td>
          <td>{{ inv.sentAt | date: 'mediumDate' }}</td>
          <td>{{ inv.expiresAt | date: 'mediumDate' }}</td>
          <td>
            @if (inv.status === 'pending') {
              <button type="button" class="iam-grid__action" (click)="resend.emit(inv.id)">Resend</button>
              <button type="button" class="iam-grid__action iam-grid__action--danger" (click)="cancelInvitation.emit(inv.id)">Cancel</button>
            }
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="8">
            <app-enterprise-table-empty
              title="No invitations found"
              description="Try adjusting filters or clearing search."
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamInvitationDataGridComponent {
  readonly items = input.required<readonly InvitationAdminRecord[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(10);
  readonly selectionChange = output<readonly InvitationAdminRecord[]>();
  readonly resend = output<string>();
  readonly cancelInvitation = output<string>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: InvitationAdminRecord[] = [];
  get selectionModel(): InvitationAdminRecord[] { return this._selectionModel; }
  set selectionModel(value: InvitationAdminRecord[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }
}
