import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserAdminRecord } from '../../models/user-admin.model';
import { IamRoleBadgeComponent } from './iam-role-badge.component';
import { IamUserAvatarComponent } from './iam-user-avatar.component';
import { IamUserStatusBadgeComponent } from './iam-user-status-badge.component';

@Component({
  selector: 'app-iam-user-card',
  imports: [RouterLink, IamUserAvatarComponent, IamUserStatusBadgeComponent, IamRoleBadgeComponent],
  template: `
    <article class="iam-card">
      <a class="iam-card__link" [routerLink]="['/super-admin/iam/users', user().id]">
        <app-iam-user-avatar [name]="user().displayName" [avatarUrl]="user().avatarUrl" size="sm" />
        <div class="iam-card__content">
          <h3 class="iam-card__name">{{ user().displayName }}</h3>
          <p class="iam-card__meta">{{ user().email }}</p>
          <div class="iam-card__badges">
            <app-iam-user-status-badge [status]="user().status" />
            <app-iam-role-badge [role]="user().primaryRole" />
          </div>
        </div>
      </a>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserCardComponent {
  readonly user = input.required<UserAdminRecord>();
}
