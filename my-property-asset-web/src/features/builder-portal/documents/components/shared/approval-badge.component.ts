import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ApprovalStatus } from '../../models/document.model';

@Component({
  selector: 'app-approval-badge',
  template: `<span class="approval-badge" [class]="'approval-badge--' + status()"><i [class]="icon()" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalBadgeComponent {
  readonly status = input.required<ApprovalStatus>();

  readonly label = computed(() => {
    const map: Record<ApprovalStatus, string> = {
      draft: 'Draft',
      'pending-review': 'Pending review',
      approved: 'Approved',
      rejected: 'Rejected',
      archived: 'Archived',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<ApprovalStatus, string> = {
      draft: 'pi pi-file-edit',
      'pending-review': 'pi pi-clock',
      approved: 'pi pi-check-circle',
      rejected: 'pi pi-times-circle',
      archived: 'pi pi-inbox',
    };
    return map[this.status()];
  });
}
