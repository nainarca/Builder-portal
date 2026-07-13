import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from './organization-avatar.component';
import { OrganizationStatusBadgeComponent } from './organization-status-badge.component';

@Component({
  selector: 'app-org-card',
  imports: [RouterLink, TitleCasePipe, OrganizationAvatarComponent, OrganizationStatusBadgeComponent],
  template: `
    <article class="org-card">
      <a class="org-card__link" [routerLink]="['/super-admin/organizations', org().id]">
        <app-org-avatar
          [name]="org().name"
          [logoUrl]="org().logoUrl"
          [primaryColor]="org().primaryColor ?? '#1B4D89'"
          size="lg"
        />
        <div class="org-card__content">
          <h3 class="org-card__name">{{ org().name }}</h3>
          <p class="org-card__meta">{{ org().type | titlecase }} · {{ org().region }}</p>
          <p class="org-card__stats">{{ org().memberCount }} members · {{ org().projectCount }} projects</p>
        </div>
        <app-org-status-badge [status]="org().status" />
      </a>
      @if (selectable()) {
        <button type="button" class="org-card__action" (click)="selected.emit(org())">Select</button>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCardComponent {
  readonly org = input.required<OrganizationAdminRecord>();
  readonly selectable = input(false);

  readonly selected = output<OrganizationAdminRecord>();
}
