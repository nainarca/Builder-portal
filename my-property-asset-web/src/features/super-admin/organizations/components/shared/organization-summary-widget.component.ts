import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from './organization-avatar.component';
import { OrganizationStatusBadgeComponent } from './organization-status-badge.component';

@Component({
  selector: 'app-org-summary-widget',
  imports: [RouterLink, OrganizationAvatarComponent, OrganizationStatusBadgeComponent],
  template: `
    <article class="org-summary-widget">
      <app-org-avatar
        [name]="org().name"
        [logoUrl]="org().logoUrl"
        [primaryColor]="org().primaryColor ?? '#1B4D89'"
      />
      <div class="org-summary-widget__content">
        <h3 class="org-summary-widget__name">
          <a [routerLink]="['/super-admin/organizations', org().id]">{{ org().name }}</a>
        </h3>
        <p class="org-summary-widget__meta">{{ org().memberCount }} members</p>
        <app-org-status-badge [status]="org().status" />
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationSummaryWidgetComponent {
  readonly org = input.required<OrganizationAdminRecord>();
}
