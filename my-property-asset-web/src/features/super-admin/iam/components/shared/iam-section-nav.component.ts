import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-iam-section-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="iam-section-nav" aria-label="Identity and access sections">
      <a routerLink="/super-admin/iam/users" routerLinkActive="iam-section-nav__link--active" class="iam-section-nav__link">
        <i class="pi pi-users" aria-hidden="true"></i> Users
      </a>
      <a routerLink="/super-admin/iam/roles" routerLinkActive="iam-section-nav__link--active" class="iam-section-nav__link">
        <i class="pi pi-shield" aria-hidden="true"></i> Roles
      </a>
      <a routerLink="/super-admin/iam/permissions" routerLinkActive="iam-section-nav__link--active" class="iam-section-nav__link">
        <i class="pi pi-lock" aria-hidden="true"></i> Permissions
      </a>
      <a routerLink="/super-admin/iam/invitations" routerLinkActive="iam-section-nav__link--active" class="iam-section-nav__link">
        <i class="pi pi-envelope" aria-hidden="true"></i> Invitations
      </a>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamSectionNavComponent {
  readonly activeSection = input<string>('');
}
