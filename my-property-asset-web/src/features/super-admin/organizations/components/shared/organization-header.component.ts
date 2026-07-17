import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { PermissionService } from '@core/rbac';
import {
  EnterpriseFormPageHeaderComponent,
  OutlineButtonComponent,
  PrimaryButtonComponent,
} from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from './organization-avatar.component';
import { OrganizationStatusBadgeComponent } from './organization-status-badge.component';

@Component({
  selector: 'app-org-header',
  imports: [
    TitleCasePipe,
    DatePipe,
    EnterpriseFormPageHeaderComponent,
    OutlineButtonComponent,
    PrimaryButtonComponent,
    OrganizationAvatarComponent,
    OrganizationStatusBadgeComponent,
  ],
  template: `
    <div class="org-header">
      <app-org-avatar
        class="org-header__avatar"
        [name]="org().name"
        [logoUrl]="org().logoUrl"
        [primaryColor]="org().primaryColor ?? '#1B4D89'"
        size="lg"
      />

      <app-enterprise-form-page-header
        class="org-header__chrome"
        [eyebrow]="(org().type | titlecase) + ' organization'"
        [title]="org().name"
        [subtitle]="subtitle()"
        mode="view"
      >
        <app-org-status-badge formHeaderActions [status]="org().status" />
        <app-outline-button
          formHeaderActions
          label="Back to list"
          icon="pi pi-arrow-left"
          (clicked)="goToList()"
        />
        @if (org().status !== 'archived' && canEdit()) {
          <app-primary-button
            formHeaderActions
            label="Edit"
            icon="pi pi-pencil"
            (clicked)="goToEdit()"
          />
        }
        <ng-content />
      </app-enterprise-form-page-header>

      <p class="org-header__meta mpa-body-sm">
        Updated {{ org().updatedAt | date: 'medium' }}
      </p>
    </div>
  `,
  styles: `
    .org-header {
      display: grid;
      gap: var(--mpa-spacing-md);
    }

    .org-header__avatar {
      width: fit-content;
    }

    .org-header__chrome {
      margin-bottom: 0;
    }

    .org-header__meta {
      margin: 0;
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHeaderComponent {
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);

  readonly org = input.required<OrganizationAdminRecord>();

  readonly subtitle = computed(() => {
    const org = this.org();
    const parts = [org.shortName, org.slug, org.region].filter(Boolean);
    return parts.length ? parts.join(' · ') : 'Organization profile';
  });

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
