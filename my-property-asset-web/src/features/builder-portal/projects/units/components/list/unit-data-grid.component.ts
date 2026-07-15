import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { Unit } from '../../models/unit.model';
import { UnitAvatarComponent } from '../shared/unit-avatar.component';
import { UnitConstructionBadgeComponent } from '../shared/unit-construction-badge.component';
import { UnitStatusBadgeComponent } from '../shared/unit-status-badge.component';

@Component({
  selector: 'app-unit-data-grid',
  imports: [RouterLink, TableModule, UnitAvatarComponent, UnitStatusBadgeComponent, UnitConstructionBadgeComponent],
  template: `
    <p-table
      [value]="gridItems()"
      [loading]="loading()"
      [paginator]="true"
      [rows]="pageSize()"
      [totalRecords]="total()"
      [lazy]="false"
      [rowsPerPageOptions]="[12, 24, 48]"
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
          @if (isColumnVisible('unitNumber')) {
            <th pSortableColumn="unitNumber">Unit <p-sortIcon field="unitNumber" /></th>
          }
          @if (isColumnVisible('tower')) {
            <th>Tower</th>
          }
          @if (isColumnVisible('floor')) {
            <th pSortableColumn="floorNumber">Floor <p-sortIcon field="floorNumber" /></th>
          }
          @if (isColumnVisible('type')) {
            <th>Type</th>
          }
          @if (isColumnVisible('configuration')) {
            <th>Configuration</th>
          }
          @if (isColumnVisible('area')) {
            <th pSortableColumn="areaSqft">Area (sqft) <p-sortIcon field="areaSqft" /></th>
          }
          @if (isColumnVisible('status')) {
            <th>Status</th>
          }
          @if (isColumnVisible('constructionStage')) {
            <th>Construction stage</th>
          }
          @if (isColumnVisible('progress')) {
            <th pSortableColumn="progress">Progress <p-sortIcon field="progress" /></th>
          }
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-unit>
        <tr>
          <td>
            <p-tableCheckbox [value]="unit" />
          </td>
          @if (isColumnVisible('unitNumber')) {
            <td>
              <a class="unit-grid__name-link" [routerLink]="['/builder-portal/projects', projectId(), 'units', unit.id]">
                <app-unit-avatar [unitNumber]="unit.unitNumber" size="sm" />
                <span><strong>{{ unit.unitNumber }}</strong></span>
              </a>
            </td>
          }
          @if (isColumnVisible('tower')) {
            <td>{{ unit.towerName }}</td>
          }
          @if (isColumnVisible('floor')) {
            <td>{{ unit.floorNumber }}</td>
          }
          @if (isColumnVisible('type')) {
            <td>{{ typeLabel(unit.unitType) }}</td>
          }
          @if (isColumnVisible('configuration')) {
            <td>{{ unit.configuration }}</td>
          }
          @if (isColumnVisible('area')) {
            <td>{{ unit.areaSqft }}</td>
          }
          @if (isColumnVisible('status')) {
            <td><app-unit-status-badge [status]="unit.status" /></td>
          }
          @if (isColumnVisible('constructionStage')) {
            <td><app-unit-construction-badge [stage]="unit.constructionStage" /></td>
          }
          @if (isColumnVisible('progress')) {
            <td>{{ unit.progress }}%</td>
          }
          <td>
            <a class="unit-grid__view-link" [routerLink]="['/builder-portal/projects', projectId(), 'units', unit.id]">View</a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="visibleColumnCount() + 2">No units match your filters.</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitDataGridComponent {
  readonly items = input.required<readonly Unit[]>();
  readonly projectId = input.required<string>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(12);
  readonly visibleColumns = input<string[]>([]);
  readonly selected = input<readonly Unit[]>([]);

  readonly selectionChange = output<readonly Unit[]>();
  readonly pageChange = output<unknown>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: Unit[] = [];

  get selectionModel(): Unit[] {
    return this._selectionModel;
  }

  set selectionModel(value: Unit[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }

  isColumnVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }

  visibleColumnCount(): number {
    return this.visibleColumns().length;
  }

  typeLabel(type: Unit['unitType']): string {
    const map: Record<Unit['unitType'], string> = {
      apartment: 'Apartment',
      villa: 'Villa',
      studio: 'Studio',
      penthouse: 'Penthouse',
      commercial: 'Commercial',
      retail: 'Retail',
    };
    return map[type];
  }
}
