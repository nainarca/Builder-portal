import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HANDOVER_STAGE_DEFINITIONS } from '../../config/handovers.config';
import { HandoverStageStatus } from '../../models/handover.model';

interface MilestoneStep {
  readonly stageId: string;
  readonly label: string;
  readonly order: number;
  readonly status: HandoverStageStatus['status'];
}

@Component({
  selector: 'app-milestone-tracker',
  template: `
    <div class="milestone-tracker" role="list" aria-label="Handover milestones">
      @for (step of steps(); track step.stageId) {
        <div class="milestone-tracker__step" [class.milestone-tracker__step--completed]="step.status === 'completed'" role="listitem">
          <span class="milestone-tracker__dot" [class]="'milestone-tracker__dot--' + step.status">
            @if (step.status === 'completed') {
              <i class="pi pi-check" aria-hidden="true"></i>
            } @else {
              {{ step.order }}
            }
          </span>
          <span class="milestone-tracker__label">{{ step.label }}</span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestoneTrackerComponent {
  readonly stages = input.required<readonly HandoverStageStatus[]>();

  readonly steps = computed<readonly MilestoneStep[]>(() =>
    this.stages().map((stage, index) => {
      const def = HANDOVER_STAGE_DEFINITIONS.find((d) => d.id === stage.stageId);
      return {
        stageId: stage.stageId,
        label: def?.label ?? stage.stageId,
        order: index + 1,
        status: stage.status,
      };
    }),
  );
}
