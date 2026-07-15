import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ApprovalStatus } from '../../models/approval.model';

@Component({
  selector: 'app-approval-status-badge',
  template: `<span class="approval-status-badge" [class]="'approval-status-badge--' + status()"><i [class]="icon()" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalStatusBadgeComponent {
  readonly status = input.required<ApprovalStatus>();

  readonly label = computed(() => {
    const map: Record<ApprovalStatus, string> = {
      'ready-for-signature': 'Ready for signature',
      'owner-signed': 'Owner signed',
      'builder-signed': 'Builder signed',
      'pending-approval': 'Pending approval',
      approved: 'Approved',
      rejected: 'Rejected',
      cancelled: 'Cancelled',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<ApprovalStatus, string> = {
      'ready-for-signature': 'pi pi-file-edit',
      'owner-signed': 'pi pi-user',
      'builder-signed': 'pi pi-building',
      'pending-approval': 'pi pi-hourglass',
      approved: 'pi pi-check-circle',
      rejected: 'pi pi-times-circle',
      cancelled: 'pi pi-ban',
    };
    return map[this.status()];
  });
}
