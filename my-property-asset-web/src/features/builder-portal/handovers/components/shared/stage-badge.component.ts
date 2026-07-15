import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HANDOVER_STAGE_DEFINITIONS } from '../../config/handovers.config';
import { HandoverStageId } from '../../models/handover.model';

@Component({
  selector: 'app-stage-badge',
  template: `<span class="stage-badge"><i class="pi pi-compass" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageBadgeComponent {
  readonly stageId = input.required<HandoverStageId>();

  readonly label = computed(
    () => HANDOVER_STAGE_DEFINITIONS.find((s) => s.id === this.stageId())?.label ?? this.stageId(),
  );
}
