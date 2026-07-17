import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { PermissionService } from '@core/rbac';
import {
  EnterpriseEntityHeroComponent,
  OutlineButtonComponent,
  PrimaryButtonComponent,
  type EnterpriseDetailAction,
  type EnterpriseDetailFact,
} from '@shared/ui';

import { OrganizationAdminRecord } from '../../models/organization-admin.model';
import { OrganizationAvatarComponent } from './organization-avatar.component';

@Component({
  selector: 'app-org-header',
  imports: [
    EnterpriseEntityHeroComponent,
    PrimaryButtonComponent,
    OrganizationAvatarComponent,
  ],
  template: `
    <app-enterprise-entity-hero
      [eyebrow]="eyebrow()"
      [title]="org().name"
      [subtitle]="subtitle()"
      [identifier]="org().id"
      [statusLabel]="statusLabel()"
      [statusSeverity]="statusSeverity()"
      [statusIcon]="statusIcon()"
      [facts]="heroFacts()"
      [overflowActions]="overflowActions()"
      ariaLabel="Organization header"
      (overflowAction)="onOverflow($event)"
    >
      <app-org-avatar
        entityHeroLeading
        [name]="org().name"
        [logoUrl]="org().logoUrl"
        [primaryColor]="org().primaryColor ?? '#1B4D89'"
        size="lg"
      />
      @if (org().status !== 'archived' && canEdit()) {
        <app-primary-button
          entityHeroPrimary
          label="Edit"
          icon="pi pi-pencil"
          (clicked)="goToEdit()"
        />
      }
    </app-enterprise-entity-hero>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationHeaderComponent {
  private readonly router = inject(Router);
  private readonly permissions = inject(PermissionService);

  readonly org = input.required<OrganizationAdminRecord>();

  readonly eyebrow = computed(() => {
    const type = this.org().type;
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    return `${label} organization`;
  });

  readonly subtitle = computed(() => {
    const org = this.org();
    const parts = [org.shortName, org.slug, org.region].filter(Boolean);
    return parts.length ? parts.join(' · ') : 'Organization profile';
  });

  readonly statusLabel = computed(() => {
    const map: Record<OrganizationAdminRecord['status'], string> = {
      active: 'Active',
      inactive: 'Inactive',
      archived: 'Archived',
      pending: 'Pending',
    };
    return map[this.org().status];
  });

  readonly statusSeverity = computed(() => {
    const map: Record<
      OrganizationAdminRecord['status'],
      'success' | 'warn' | 'danger' | 'info' | 'secondary'
    > = {
      active: 'success',
      inactive: 'secondary',
      archived: 'danger',
      pending: 'warn',
    };
    return map[this.org().status];
  });

  readonly statusIcon = computed(() => {
    const map: Record<OrganizationAdminRecord['status'], string> = {
      active: 'pi pi-check-circle',
      inactive: 'pi pi-minus-circle',
      archived: 'pi pi-archive',
      pending: 'pi pi-clock',
    };
    return map[this.org().status];
  });

  readonly heroFacts = computed((): readonly EnterpriseDetailFact[] => {
    const org = this.org();
    return [
      { label: 'Plan', value: org.plan ?? '—' },
      { label: 'Members', value: String(org.memberCount) },
      { label: 'Updated', value: new Date(org.updatedAt).toLocaleString() },
    ];
  });

  readonly overflowActions = computed((): readonly EnterpriseDetailAction[] => [
    { id: 'back', label: 'Back to list', icon: 'pi pi-arrow-left' },
  ]);

  canEdit(): boolean {
    return this.permissions.hasPermission('id-03-organization-tenancy:operate');
  }

  onOverflow(actionId: string): void {
    if (actionId === 'back') {
      this.goToList();
    }
  }

  goToList(): void {
    void this.router.navigate(['/super-admin/organizations']);
  }

  goToEdit(): void {
    void this.router.navigate(['/super-admin/organizations', this.org().id, 'edit']);
  }
}
