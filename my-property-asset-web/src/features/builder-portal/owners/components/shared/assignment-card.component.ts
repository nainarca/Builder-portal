import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OwnerAssignment } from '../../models/owner.model';
import { InvitationBadgeComponent } from './invitation-badge.component';

@Component({
  selector: 'app-assignment-card',
  imports: [RouterLink, InvitationBadgeComponent],
  template: `
    <a class="assignment-card" [routerLink]="['/builder-portal/owners', assignment().ownerId]">
      <div class="assignment-card__main">
        <div>
          <p class="assignment-card__name">{{ assignment().ownerName }}</p>
          <p class="assignment-card__meta">{{ assignment().unitNumber }} · {{ assignment().projectName }}</p>
        </div>
      </div>
      <div class="assignment-card__aside">
        <app-invitation-badge [status]="assignment().invitation.status" />
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentCardComponent {
  readonly assignment = input.required<OwnerAssignment>();
}
