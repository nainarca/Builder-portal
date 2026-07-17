import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { EnterpriseTableEmptyComponent } from '@shared/ui';

import { PROJECT_TYPE_LABELS } from '../../config/projects.config';
import { Project } from '../../models/project.model';
import { ProjectAvatarComponent } from '../shared/project-avatar.component';
import { ProjectStatusBadgeComponent } from '../shared/project-status-badge.component';
import { ProjectTypeBadgeComponent } from '../shared/project-type-badge.component';

@Component({
  selector: 'app-proj-data-grid',
  imports: [
    RouterLink,
    TableModule,
    DatePipe,
    ProjectAvatarComponent,
    ProjectStatusBadgeComponent,
    ProjectTypeBadgeComponent,
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
            <th pSortableColumn="name">Project <p-sortIcon field="name" /></th>
          }
          @if (isColumnVisible('status')) {
            <th>Status</th>
          }
          @if (isColumnVisible('projectType')) {
            <th>Type</th>
          }
          @if (isColumnVisible('city')) {
            <th>City</th>
          }
          @if (isColumnVisible('launchDate')) {
            <th>Launch</th>
          }
          @if (isColumnVisible('expectedCompletionDate')) {
            <th pSortableColumn="expectedCompletionDate">
              Expected completion <p-sortIcon field="expectedCompletionDate" />
            </th>
          }
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-project>
        <tr>
          <td>
            <p-tableCheckbox [value]="project" />
          </td>
          @if (isColumnVisible('name')) {
            <td>
              <a class="proj-grid__name-link" [routerLink]="['/builder-portal/projects', project.id]">
                <app-proj-avatar
                  [name]="project.name"
                  [thumbnailUrl]="project.logoUrl ?? project.thumbnailUrl"
                  size="sm"
                />
                <span>
                  <strong>{{ project.name }}</strong>
                  <small>{{ project.code }}</small>
                </span>
              </a>
            </td>
          }
          @if (isColumnVisible('status')) {
            <td><app-proj-status-badge [status]="project.status" /></td>
          }
          @if (isColumnVisible('projectType')) {
            <td><app-proj-type-badge [projectType]="project.projectType" /></td>
          }
          @if (isColumnVisible('city')) {
            <td>{{ project.location.city }}</td>
          }
          @if (isColumnVisible('launchDate')) {
            <td>{{ project.launchDate | date: 'mediumDate' }}</td>
          }
          @if (isColumnVisible('expectedCompletionDate')) {
            <td>{{ project.expectedCompletionDate | date: 'mediumDate' }}</td>
          }
          <td>
            <a class="proj-grid__view-link" [routerLink]="['/builder-portal/projects', project.id]">View</a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="visibleColumnCount() + 2">
            <app-enterprise-table-empty
              title="No projects match your filters"
              description="Try adjusting filters or clearing search."
            />
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDataGridComponent {
  readonly items = input.required<readonly Project[]>();
  readonly loading = input(false);
  readonly total = input(0);
  readonly pageSize = input(10);
  readonly visibleColumns = input<string[]>([]);
  readonly selected = input<readonly Project[]>([]);

  readonly selectionChange = output<readonly Project[]>();
  readonly pageChange = output<unknown>();

  readonly gridItems = computed(() => [...this.items()]);

  private _selectionModel: Project[] = [];

  get selectionModel(): Project[] {
    return this._selectionModel;
  }

  set selectionModel(value: Project[]) {
    this._selectionModel = value;
    this.selectionChange.emit([...value]);
  }

  isColumnVisible(id: string): boolean {
    return this.visibleColumns().includes(id);
  }

  visibleColumnCount(): number {
    return this.visibleColumns().length;
  }

  typeLabel(type: Project['projectType']): string {
    return PROJECT_TYPE_LABELS[type] ?? type;
  }
}
