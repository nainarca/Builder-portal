import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { Handover } from '../../models/handover.model';
import { HandoverStatusBadgeComponent } from '../shared/handover-status-badge.component';
import { StageBadgeComponent } from '../shared/stage-badge.component';

@Component({
  selector: 'app-handover-data-grid',
  imports: [RouterLink, TableModule, HandoverStatusBadgeComponent, StageBadgeComponent],
  template: `
    <p-table [value]="gridItems()" [stripedRows]="true">
      <ng-template pTemplate="header">
        <tr>
          <th>Unit</th>
          <th>Owner</th>
          <th>Current stage</th>
          <th>Status</th>
          <th>Progress</th>
          <th style="width: 5rem"></th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-handover>
        <tr>
          <td>
            <a class="handover-grid__name-link" [routerLink]="['/builder-portal/handovers', handover.id]">
              <span>
                {{ handover.unitNumber }}
                <span class="handover-grid__meta">{{ handover.projectName }}</span>
              </span>
            </a>
          </td>
          <td>{{ handover.ownerName }}</td>
          <td><app-stage-badge [stageId]="currentStageId(handover)" /></td>
          <td><app-handover-status-badge [status]="handover.overallStatus" /></td>
          <td>{{ handover.overallProgress }}%</td>
          <td>
            <a class="handover-grid__view-link" [routerLink]="['/builder-portal/handovers', handover.id]">View</a>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="6">No handovers match your filters.</td>
        </tr>
      </ng-template>
    </p-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverDataGridComponent {
  readonly items = input.required<readonly Handover[]>();

  readonly gridItems = computed(() => [...this.items()]);

  currentStageId(handover: Handover): Handover['stages'][number]['stageId'] {
    const active = handover.stages.find((s) => s.status !== 'completed');
    return active?.stageId ?? handover.stages[handover.stages.length - 1].stageId;
  }
}
