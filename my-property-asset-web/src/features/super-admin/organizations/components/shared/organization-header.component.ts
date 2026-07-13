import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { PermissionService } from '@core/rbac';
import { ButtonComponent } from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from './organization-avatar.component';
import { OrganizationStatusBadgeComponent } from './organization-status-badge.component';

@Component({
  selector: 'app-org-header',
  imports: [
    TitleCasePipe,
    ButtonComponent,
    OrganizationAvatarComponent,
    OrganizationStatusBadgeComponent,
  ],
  template: `
    <header class="org-header">
      <div class="org-header__main">
        <app-org-avatar
          [name]="org().name"
          [logoUrl]="org().logoUrl"
          [primaryColor]="org().primaryColor ?? '#1B4D89'"
          size="lg"
        />
        <div>
          <span class="mpa-eyebrow">{{ org().type | titlecase }} organization</span>
          <h1 class="ui-page-title">{{ org().name }}</h1>
          <p class="ui-page-subtitle">
            @if (org().shortName) {
              {{ org().shortName }} ·
            }
            {{ org().slug }}
          </p>
          <div class="org-header__badges">
            <app-org-status-badge [status]="org().status" />
          </div>
        </div>
      </div>
      <div class="org-header__actions">
        <app-button
          label="Back to list"
          icon="pi pi-arrow-left"
          [outlined]="true"
          (clicked)="goToList()"
        />
        @if (org().status !== 'archived' && canEdit()) {
          <app-button label="Edit" icon="pi pi-pencil" (clicked)="goToEdit()" />
        }
        <ng-content />
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHeaderComponent {
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);

  readonly org = input.required<OrganizationAdminRecord>();

  canEdit(): boolean {
    return this.permissions.hasPermission('id-03-organization-tenancy:operate');
  }

  goToList(): void {
    void this.router.navigate(['/super-admin/organizations']);
  }

  goToEdit(): void {
    void this.router.navigate(['/super-admin/organizations', this.org().id, 'edit']);
  }
}
