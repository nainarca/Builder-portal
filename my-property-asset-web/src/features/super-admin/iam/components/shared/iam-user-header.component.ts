import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { PermissionService } from '@core/rbac';
import { ButtonComponent } from '@shared/ui';

import { UserAdminRecord } from '../../models/user-admin.model';
import { IamRoleBadgeComponent } from './iam-role-badge.component';
import { IamUserAvatarComponent } from './iam-user-avatar.component';
import { IamUserStatusBadgeComponent } from './iam-user-status-badge.component';

@Component({
  selector: 'app-iam-user-header',
  imports: [ButtonComponent, IamUserAvatarComponent, IamUserStatusBadgeComponent, IamRoleBadgeComponent],
  template: `
    <header class="iam-header">
      <div class="iam-header__main">
        <app-iam-user-avatar [name]="user().displayName" [avatarUrl]="user().avatarUrl" size="lg" />
        <div>
          <span class="mpa-eyebrow">Platform user</span>
          <h1 class="ui-page-title">{{ user().displayName }}</h1>
          <p class="ui-page-subtitle">{{ user().email }}</p>
          <div class="iam-header__badges">
            <app-iam-user-status-badge [status]="user().status" />
            <app-iam-role-badge [role]="user().primaryRole" />
          </div>
        </div>
      </div>
      <div class="iam-header__actions">
        <app-button label="Back to users" icon="pi pi-arrow-left" [outlined]="true" (clicked)="goToList()" />
        @if (user().status !== 'archived' && canEdit()) {
          <app-button label="Edit" icon="pi pi-pencil" (clicked)="goToEdit()" />
        }
        <ng-content />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserHeaderComponent {
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);
  readonly user = input.required<UserAdminRecord>();

  canEdit(): boolean { return this.permissions.hasPermission('id-14-user-identity-access:operate'); }
  goToList(): void { void this.router.navigate(['/super-admin/iam/users']); }
  goToEdit(): void { void this.router.navigate(['/super-admin/iam/users', this.user().id, 'edit']); }
}
