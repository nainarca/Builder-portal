import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { EnterpriseDetailEmptyComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../../components/layout';
import { IamRoleAssignmentPanelComponent, IamRoleOverviewComponent } from '../../components/roles/detail';
import { IamRoleBadgeComponent, IamSectionNavComponent } from '../../components/shared';
import { RoleAdminStoreService } from '../../services/role-admin-store.service';

@Component({
  selector: 'app-iam-role-detail-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseDetailEmptyComponent,
    IamSectionNavComponent,
    IamRoleBadgeComponent,
    IamRoleOverviewComponent,
    IamRoleAssignmentPanelComponent,
  ],
  template: `
    <app-sa-page>
      @if (role(); as r) {
        <div class="iam-page iam-page--detail">
          <app-iam-section-nav />
          <header class="iam-header">
            <div class="iam-header__main">
              <app-iam-role-badge [role]="r.id" />
              <div>
                <span class="mpa-eyebrow">Platform role</span>
                <h1 class="ui-page-title">{{ r.label }}</h1>
                <p class="ui-page-subtitle">{{ r.scope }} scope · {{ r.isSystem ? 'System role' : 'Custom role' }}</p>
              </div>
            </div>
          </header>
          <div class="iam-detail-layout iam-detail-layout--single">
            <app-iam-role-overview [role]="r" />
            <app-iam-role-assignment-panel [assignments]="assignments()" />
          </div>
        </div>
      } @else {
        <app-enterprise-detail-empty
          variant="no-related"
          title="Role not found"
          description="The requested role does not exist or was removed."
        />
      }
    </app-sa-page>
  `,
  styleUrl: './iam-role-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamRoleDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RoleAdminStoreService);

  private readonly roleId = toSignal(
    this.route.paramMap.pipe(map((p) => (p.get('id') ?? '') as PlatformRole)),
    { initialValue: '' as PlatformRole },
  );

  readonly role = computed(() => this.store.getById(this.roleId()));
  readonly assignments = computed(() => {
    const r = this.role();
    return r ? this.store.getAssignments(r.id) : [];
  });
}
