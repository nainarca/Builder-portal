import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HandoverOverallStatus } from '../../models/handover.model';

@Component({
  selector: 'app-handover-status-badge',
  template: `<span class="handover-status-badge" [class]="'handover-status-badge--' + status()"><i [class]="icon()" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverStatusBadgeComponent {
  readonly status = input.required<HandoverOverallStatus>();

  readonly label = computed(() => {
    const map: Record<HandoverOverallStatus, string> = {
      pending: 'Pending',
      'in-progress': 'In progress',
      completed: 'Completed',
      delayed: 'Delayed',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<HandoverOverallStatus, string> = {
      pending: 'pi pi-hourglass',
      'in-progress': 'pi pi-sync',
      completed: 'pi pi-check-circle',
      delayed: 'pi pi-exclamation-triangle',
    };
    return map[this.status()];
  });
}
