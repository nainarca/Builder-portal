import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { ROLE_REGISTRY } from '@core/rbac/registry/permission-matrix.registry';

import { PermissionMatrixRow } from '../../models/permission-admin.model';
import { IamPermissionBadgeComponent } from '../shared';

@Component({
  selector: 'app-iam-permission-matrix-viewer',
  imports: [IamPermissionBadgeComponent],
  template: `
    <div class="iam-matrix" role="table" aria-label="Permission matrix">
      <div class="iam-matrix__header" role="row">
        <span class="iam-matrix__resource-col" role="columnheader">Resource</span>
        @for (role of displayRoles(); track role) {
          <span class="iam-matrix__role-col" role="columnheader" [title]="roleLabel(role)">{{ shortLabel(role) }}</span>
        }
      </div>
      @for (row of rows(); track row.resource) {
        <div class="iam-matrix__row" role="row">
          <span class="iam-matrix__resource-col" role="cell">
            <strong>{{ row.resourceLabel }}</strong>
            <small>{{ row.category }}</small>
          </span>
          @for (role of displayRoles(); track role) {
            <span class="iam-matrix__role-col" role="cell">
              @if (row.levels[role]; as level) {
                <app-iam-permission-badge [level]="level" />
              } @else {
                <span class="iam-matrix__none">—</span>
              }
            </span>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamPermissionMatrixViewerComponent {
  readonly rows = input.required<readonly PermissionMatrixRow[]>();
  readonly roles = input<readonly PlatformRole[]>([]);

  readonly displayRoles = computed(() => {
    const r = this.roles();
    return r.length ? r : (Object.keys(ROLE_REGISTRY) as PlatformRole[]).filter((x) => x !== 'public-visitor');
  });

  roleLabel(r: PlatformRole): string { return ROLE_REGISTRY[r]?.label ?? r; }
  shortLabel(r: PlatformRole): string {
    const parts = r.split('-');
    return parts[parts.length - 1]?.slice(0, 8) ?? r;
  }
}
