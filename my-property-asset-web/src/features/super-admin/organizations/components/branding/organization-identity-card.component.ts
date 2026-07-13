import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from '../shared/organization-avatar.component';
import { OrganizationStatusBadgeComponent } from '../shared/organization-status-badge.component';

@Component({
  selector: 'app-org-identity-card',
  imports: [TitleCasePipe, OrganizationAvatarComponent, OrganizationStatusBadgeComponent],
  template: `
    <article class="org-identity-card">
      <app-org-avatar [name]="org().name" [logoUrl]="org().logoUrl" [primaryColor]="org().primaryColor ?? '#1B4D89'" size="lg" />
      <div>
        <h3 class="org-identity-card__name">{{ org().name }}</h3>
        <p class="org-identity-card__type">{{ org().type | titlecase }} · {{ org().plan }}</p>
        <app-org-status-badge [status]="org().status" />
        <p class="org-identity-card__color">
          Primary: <span [style.color]="org().primaryColor">{{ org().primaryColor }}</span>
        </p>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationIdentityCardComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
