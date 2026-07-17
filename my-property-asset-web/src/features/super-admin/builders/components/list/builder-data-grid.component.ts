import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { EnterpriseTableEmptyComponent } from '@shared/ui';

import { BuilderAdminRecord } from '../../models/builder-admin.model';
import { BuilderAvatarComponent } from '../shared/builder-avatar.component';
import { BuilderStatusBadgeComponent } from '../shared/builder-status-badge.component';

@Component({
  selector: 'app-bldr-data-grid',
  imports: [RouterLink, TableModule, DatePipe, BuilderAvatarComponent, BuilderStatusBadgeComponent, EnterpriseTableEmptyComponent],
  template: `
    <p-table [value]="gridItems()" [loading]="loading()" [paginator]="true" [rows]="pageSize()"
      [totalRecords]="total()" [rowsPerPageOptions]="[10, 25, 50]" [(selection)]="selectionModel"
      dataKey="id" [stripedRows]="true">
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
          @if (isColumnVisible('companyName')) { <th pSortableColumn="companyName">Builder <p-sortIcon field="companyName" /></th> }
          @if (isColumnVisible('status')) { <th>Status</th> }
          @if (isColumnVisible('region')) { <th>Region</th> }
          @if (isColumnVisible('plan')) { <th>Plan</th> }
          @if (isColumnVisible('organizationName')) { <th>Organization</th> }
          @if (isColumnVisible('projectCount')) { <th pSortableColumn="projectCount">Projects <p-sortIcon field="projectCount" /></th> }
          @if (isColumnVisible('unitCount')) { <th>Units</th> }
          @if (isColumnVisible('primaryContactName')) { <th>Contact</th> }
          @if (isColumnVisible('createdAt')) { <th>Registered</th> }
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-b>
        <tr>
          <td><p-tableCheckbox [value]="b" /></td>
          @if (isColumnVisible('companyName')) {
            <td>
              <a class="bldr-grid__link" [routerLink]="['/super-admin/builders', b.id]">
                <app-bldr-avatar [name]="b.companyName" [logoUrl]="b.logoUrl" [primaryColor]="b.primaryColor ?? '#1B4D89'" size="sm" />
                <span><strong>{{ b.companyName }}</strong>@if (b.tradingName) { <small>{{ b.tradingName }}</small> }</span>
              </a>
            </td>
          }
          @if (isColumnVisible('status')) { <td><app-bldr-status-badge [status]="b.status" /></td> }
          @if (isColumnVisible('region')) { <td>{{ b.region || '—' }}</td> }
          @if (isColumnVisible('plan')) { <td>{{ b.plan || '—' }}</td> }
          @if (isColumnVisible('organizationName')) {
            <td>
              @if (b.organizationId) {
                <a [routerLink]="['/super-admin/organizations', b.organizationId]">{{ b.organizationName }}</a>
              } @else { — }
            </td>
          }
          @if (isColumnVisible('projectCount')) { <td>{{ b.projectCount }}</td> }
          @if (isColumnVisible('unitCount')) { <td>{{ b.unitCount }}</td> }
          @if (isColumnVisible('primaryContactName')) { <td>{{ b.primaryContactName }}</td> }
          @if (isColumnVisible('createdAt')) { <td>{{ b.createdAt | date: 'mediumDate' }}</td> }
          <td><a class="bldr-grid__view" [routerLink]="['/super-admin/builders', b.id]">View</a></td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="visibleColumnCount() + 2">
            <app-enterprise-table-empty
              title="No builders match your filters"
              description="Try adjusting filters or clearing search."
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderDataGridComponent {
  readonly items = input.required<readonly BuilderAdminRecord[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(10);
  readonly visibleColumns = input<string[]>([]);
  readonly selectionChange = output<readonly BuilderAdminRecord[]>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: BuilderAdminRecord[] = [];
  get selectionModel(): BuilderAdminRecord[] { return this._selectionModel; }
  set selectionModel(value: BuilderAdminRecord[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }

  isColumnVisible(id: string): boolean { return this.visibleColumns().includes(id); }
  visibleColumnCount(): number { return this.visibleColumns().length; }
}
