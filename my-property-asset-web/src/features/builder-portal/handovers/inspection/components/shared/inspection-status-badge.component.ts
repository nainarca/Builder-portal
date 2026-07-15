import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { InspectionResultStatus } from '../../models/inspection.model';

@Component({
  selector: 'app-inspection-status-badge',
  template: `<span class="insp-status-badge" [class]="'insp-status-badge--' + status()"><i [class]="icon()" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionStatusBadgeComponent {
  readonly status = input.required<InspectionResultStatus>();

  readonly label = computed(() => {
    const map: Record<InspectionResultStatus, string> = {
      pending: 'Pending',
      passed: 'Passed',
      'passed-with-remarks': 'Passed with remarks',
      failed: 'Failed',
      blocked: 'Blocked',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<InspectionResultStatus, string> = {
      pending: 'pi pi-hourglass',
      passed: 'pi pi-check-circle',
      'passed-with-remarks': 'pi pi-info-circle',
      failed: 'pi pi-times-circle',
      blocked: 'pi pi-ban',
    };
    return map[this.status()];
  });
}
