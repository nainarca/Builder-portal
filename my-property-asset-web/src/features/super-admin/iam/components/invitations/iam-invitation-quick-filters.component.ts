import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { InvitationStatus } from '../../models/invitation-admin.model';

@Component({
  selector: 'app-iam-invitation-quick-filters',
  template: `
    <div class="iam-quick-filters" role="group" aria-label="Invitation filters">
      @for (f of filters; track f.value) {
        <button type="button" class="iam-quick-filters__chip"
          [class.iam-quick-filters__chip--active]="selected() === f.value"
          (click)="selectedChange.emit(f.value)">{{ f.label }}</button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamInvitationQuickFiltersComponent {
  readonly selected = input<InvitationStatus | 'all'>('all');
  readonly selectedChange = output<InvitationStatus | 'all'>();

  readonly filters = [
    { label: 'All', value: 'all' as const },
    { label: 'Pending', value: 'pending' as const },
    { label: 'Accepted', value: 'accepted' as const },
    { label: 'Expired', value: 'expired' as const },
    { label: 'Cancelled', value: 'cancelled' as const },
  ];
}
