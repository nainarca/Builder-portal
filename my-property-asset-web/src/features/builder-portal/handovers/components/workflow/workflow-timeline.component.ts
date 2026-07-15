import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HANDOVER_STAGE_DEFINITIONS } from '../../config/handovers.config';
import { HandoverStageStatus } from '../../models/handover.model';

interface WorkflowTimelineRow {
  readonly stageId: string;
  readonly label: string;
  readonly description: string;
  readonly status: HandoverStageStatus['status'];
}

@Component({
  selector: 'app-workflow-timeline',
  template: `
    <ol class="workflow-timeline">
      @for (row of rows(); track row.stageId) {
        <li class="workflow-timeline__item" [class.workflow-timeline__item--completed]="row.status === 'completed'">
          <span class="workflow-timeline__dot" [class]="'workflow-timeline__dot--' + row.status">
            @if (row.status === 'completed') {
              <i class="pi pi-check" aria-hidden="true"></i>
            } @else if (row.status === 'delayed') {
              <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
            } @else {
              <i class="pi pi-circle-fill workflow-timeline__dot-icon" aria-hidden="true"></i>
            }
          </span>
          <div>
            <p class="workflow-timeline__title">{{ row.label }}</p>
            <p class="workflow-timeline__description">{{ row.description }}</p>
            <span class="workflow-timeline__status-chip" [class]="'workflow-timeline__status-chip--' + row.status">
              {{ statusLabel(row.status) }}
            </span>
          </div>
        </li>
      }
    </ol>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowTimelineComponent {
  readonly stages = input.required<readonly HandoverStageStatus[]>();

  readonly rows = computed<readonly WorkflowTimelineRow[]>(() =>
    this.stages().map((stage) => {
      const def = HANDOVER_STAGE_DEFINITIONS.find((d) => d.id === stage.stageId);
      return {
        stageId: stage.stageId,
        label: def?.label ?? stage.stageId,
        description: def?.description ?? '',
        status: stage.status,
      };
    }),
  );

  statusLabel(status: HandoverStageStatus['status']): string {
    const map: Record<HandoverStageStatus['status'], string> = {
      completed: 'Completed',
      'in-progress': 'In progress',
      delayed: 'Delayed',
      upcoming: 'Upcoming',
    };
    return map[status];
  }
}
