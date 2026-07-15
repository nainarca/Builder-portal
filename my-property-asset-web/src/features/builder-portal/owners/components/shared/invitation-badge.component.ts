import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { InvitationStatus } from '../../models/owner.model';

@Component({
  selector: 'app-invitation-badge',
  template: `<span class="invitation-badge" [class]="'invitation-badge--' + status()"><i [class]="icon()" aria-hidden="true"></i> {{ label() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationBadgeComponent {
  readonly status = input.required<InvitationStatus>();

  readonly label = computed(() => {
    const map: Record<InvitationStatus, string> = {
      'not-sent': 'Not sent',
      pending: 'Pending',
      accepted: 'Accepted',
      expired: 'Expired',
      cancelled: 'Cancelled',
    };
    return map[this.status()];
  });

  readonly icon = computed(() => {
    const map: Record<InvitationStatus, string> = {
      'not-sent': 'pi pi-envelope',
      pending: 'pi pi-clock',
      accepted: 'pi pi-check-circle',
      expired: 'pi pi-exclamation-triangle',
      cancelled: 'pi pi-times-circle',
    };
    return map[this.status()];
  });
}
