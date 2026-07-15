import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OwnerListItem } from '../../models/owner.model';
import { CustomerAvatarComponent } from './customer-avatar.component';
import { InvitationBadgeComponent } from './invitation-badge.component';
import { OwnerStatusBadgeComponent } from './owner-status-badge.component';

@Component({
  selector: 'app-owner-card',
  imports: [RouterLink, CustomerAvatarComponent, OwnerStatusBadgeComponent, InvitationBadgeComponent],
  template: `
    <article class="owner-card">
      <a class="owner-card__link" [routerLink]="['/builder-portal/owners', item().owner.id]">
        <div class="owner-card__header">
          <app-customer-avatar [name]="fullName()" />
          <div class="owner-card__title-group">
            <p class="owner-card__name">{{ fullName() }}</p>
            <p class="owner-card__meta">{{ item().owner.email }}</p>
          </div>
        </div>

        <div class="owner-card__badges">
          <app-owner-status-badge [status]="item().owner.activationStatus" />
          @if (item().assignment; as assignment) {
            <app-invitation-badge [status]="assignment.invitation.status" />
          }
        </div>

        @if (item().assignment; as assignment) {
          <p class="owner-card__unit">{{ assignment.unitNumber }} · {{ assignment.projectName }}</p>
        } @else {
          <p class="owner-card__unit">No unit assigned</p>
        }

        <div class="owner-card__footer">
          <span>{{ item().owner.phone }}</span>
          <span>{{ item().owner.city }}</span>
        </div>
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerCardComponent {
  readonly item = input.required<OwnerListItem>();

  readonly fullName = computed(() => `${this.item().owner.firstName} ${this.item().owner.lastName}`);
}
