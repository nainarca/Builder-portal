import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { Project } from '../../models/project.model';
import { ProjectAvatarComponent } from '../shared/project-avatar.component';
import { ProjectHealthBadgeComponent } from '../shared/project-health-badge.component';
import { ProjectStatusBadgeComponent } from '../shared/project-status-badge.component';

@Component({
  selector: 'app-proj-data-grid',
  imports: [
    RouterLink,
    TableModule,
    DatePipe,
    ProjectAvatarComponent,
    ProjectStatusBadgeComponent,
    ProjectHealthBadgeComponent,
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
          @if (isColumnVisible('constructionStage')) {
            <th>Construction stage</th>
          }
          @if (isColumnVisible('health')) {
            <th>Health</th>
          }
          @if (isColumnVisible('progress')) {
            <th pSortableColumn="progress">Progress <p-sortIcon field="progress" /></th>
          }
          @if (isColumnVisible('units')) {
            <th>Units</th>
          }
          @if (isColumnVisible('city')) {
            <th>Location</th>
          }
          @if (isColumnVisible('targetCompletionDate')) {
            <th pSortableColumn="targetCompletionDate">
              Target completion <p-sortIcon field="targetCompletionDate" />
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
                <app-proj-avatar [name]="project.name" [thumbnailUrl]="project.thumbnailUrl" size="sm" />
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
          @if (isColumnVisible('constructionStage')) {
            <td>{{ stageLabel(project.constructionStage) }}</td>
          }
          @if (isColumnVisible('health')) {
            <td><app-proj-health-badge [health]="project.health" /></td>
          }
          @if (isColumnVisible('progress')) {
            <td>{{ project.progress }}%</td>
          }
          @if (isColumnVisible('units')) {
            <td>{{ project.summary.unitsSold }}/{{ project.summary.unitsTotal }}</td>
          }
          @if (isColumnVisible('city')) {
            <td>{{ project.location.city }}</td>
          }
          @if (isColumnVisible('targetCompletionDate')) {
            <td>{{ project.targetCompletionDate | date: 'mediumDate' }}</td>
          }
          <td>
            <a class="proj-grid__view-link" [routerLink]="['/builder-portal/projects', project.id]">View</a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="visibleColumnCount() + 2">No projects match your filters.</td>
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

  stageLabel(stage: Project['constructionStage']): string {
    const map: Record<Project['constructionStage'], string> = {
      'land-acquisition': 'Land acquisition',
      foundation: 'Foundation',
      structure: 'Structure',
      finishing: 'Finishing',
      handover: 'Handover',
      completed: 'Completed',
    };
    return map[stage];
  }
}
