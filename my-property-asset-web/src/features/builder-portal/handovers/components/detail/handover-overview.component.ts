import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Handover } from '../../models/handover.model';

@Component({
  selector: 'app-handover-overview',
  imports: [RouterLink],
  template: `
    <div class="handover-overview__grid">
      <div class="handover-info-panel">
        <h3 class="handover-info-panel__title">Project summary</h3>
        <dl class="handover-info-panel__list">
          <div class="handover-info-panel__row">
            <dt>Project</dt>
            <dd><a [routerLink]="['/builder-portal/projects', handover().projectId]">{{ handover().projectName }}</a></dd>
          </div>
        </dl>
      </div>

      <div class="handover-info-panel">
        <h3 class="handover-info-panel__title">Unit summary</h3>
        <dl class="handover-info-panel__list">
          <div class="handover-info-panel__row"><dt>Unit</dt><dd><a [routerLink]="['/builder-portal/projects', handover().projectId, 'units', handover().unitId]">{{ handover().unitNumber }}</a></dd></div>
          <div class="handover-info-panel__row"><dt>Tower</dt><dd>{{ handover().towerName }}</dd></div>
        </dl>
      </div>

      <div class="handover-info-panel">
        <h3 class="handover-info-panel__title">Owner summary</h3>
        <dl class="handover-info-panel__list">
          <div class="handover-info-panel__row">
            <dt>Owner</dt>
            <dd><a [routerLink]="['/builder-portal/owners', handover().ownerId]">{{ handover().ownerName }}</a></dd>
          </div>
        </dl>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverOverviewComponent {
  readonly handover = input.required<Handover>();
}
