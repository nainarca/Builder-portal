import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { HasPermissionDirective } from '@core/rbac';
import { ButtonComponent } from '@shared/ui';

import { Owner, OwnerAssignment } from '../../models/owner.model';
import { CustomerAvatarComponent } from './customer-avatar.component';
import { InvitationBadgeComponent } from './invitation-badge.component';
import { OwnerStatusBadgeComponent } from './owner-status-badge.component';

@Component({
  selector: 'app-customer-header',
  imports: [ButtonComponent, HasPermissionDirective, CustomerAvatarComponent, OwnerStatusBadgeComponent, InvitationBadgeComponent],
  template: `
    <header class="owner-header">
      <div class="owner-header__main">
        <app-customer-avatar [name]="fullName()" size="lg" />
        <div>
          <span class="mpa-eyebrow">{{ owner().email }}</span>
          <h1 class="ui-page-title">{{ fullName() }}</h1>
          <p class="ui-page-subtitle">{{ owner().phone }}</p>
          <div class="owner-header__badges">
            <app-owner-status-badge [status]="owner().activationStatus" />
            @if (assignment(); as a) {
              <app-invitation-badge [status]="a.invitation.status" />
            }
          </div>
        </div>
      </div>
      <div class="owner-header__actions">
        <app-button label="Back to owners" icon="pi pi-arrow-left" [outlined]="true" (clicked)="goToList()" />
        @if (!owner().archived) {
          <app-button
            *appHasPermission="'id-08-owner-assignment-prospect:contribute'"
            label="Edit profile"
            icon="pi pi-pencil"
            (clicked)="goToEdit()"
          />
        }
        <ng-content />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerHeaderComponent {
  private readonly router = inject(Router);

  readonly owner = input.required<Owner>();
  readonly assignment = input<OwnerAssignment | undefined>(undefined);

  readonly fullName = computed(() => `${this.owner().firstName} ${this.owner().lastName}`);

  goToList(): void {
    void this.router.navigate(['/builder-portal/owners']);
  }

  goToEdit(): void {
    void this.router.navigate(['/builder-portal/owners', this.owner().id, 'edit']);
  }
}
