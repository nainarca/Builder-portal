import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { ContentSectionComponent, SectionHeaderComponent } from '@shared/ui';

import { RoleAdminRecord } from '../../../models/role-admin.model';
import { RoleAdminStoreService } from '../../../services/role-admin-store.service';
import { IamPermissionBadgeComponent, IamStatisticsCardsComponent } from '../../shared';

@Component({
  selector: 'app-iam-role-overview',
  imports: [ContentSectionComponent, SectionHeaderComponent, IamStatisticsCardsComponent, IamPermissionBadgeComponent],
  template: `
    <div class="iam-role-overview">
      <app-iam-statistics-cards [stats]="stats()" />
      <p class="iam-role-overview__desc">{{ role().description }}</p>
      <app-content-section>
        <app-section-header title="Permissions" description="Resources granted to this role" />
        <div class="iam-role-perms">
          @for (p of permissions(); track p.resource) {
            <div class="iam-role-perms__item">
              <span>{{ p.resourceLabel }}</span>
              <app-iam-permission-badge [level]="p.level" />
            </div>
          }
        </div>
      </app-content-section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleOverviewComponent {
  private readonly store = inject(RoleAdminStoreService);
  readonly role = input.required<RoleAdminRecord>();

  readonly stats = computed(() => [
    { label: 'Users', value: String(this.role().userCount), icon: 'pi pi-users' },
    { label: 'Permissions', value: String(this.role().permissionCount), icon: 'pi pi-lock' },
    { label: 'Portals', value: String(this.role().portals.length), icon: 'pi pi-globe' },
    { label: 'Scope', value: this.role().scope, icon: 'pi pi-sitemap' },
  ]);

  readonly permissions = computed(() => this.store.getPermissions(this.role().id));
}
