import { Injectable, inject } from '@angular/core';

import { AuthContextService } from '@core/auth';
import { CurrentOrganizationService } from '@core/organization-context';
import { PlatformRole, UserContext } from '../models/permission.model';
import { ROLE_PORTAL_ACCESS } from '../registry/permission-matrix.registry';
import { normalizeRole } from '../utils/permission.utils';
import { PlatformOperatorService } from './platform-operator.service';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly authContext = inject(AuthContextService);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly platformOperators = inject(PlatformOperatorService);

  resolveUserContext(): UserContext {
    const user = this.authContext.user();

    if (!user) {
      return {
        userId: null,
        email: null,
        role: 'public-visitor',
        portals: [],
      };
    }

    const metadata = user.metadata ?? {};

    // AUTH-01: platform_operators wins over personal org / JWT "owner" metadata
    if (this.platformOperators.isSuperAdmin()) {
      return {
        userId: user.id,
        email: user.email,
        role: 'super-admin',
        portals: ROLE_PORTAL_ACCESS['super-admin'] ?? [],
        supportAccessOrganizationId:
          typeof metadata['supportAccessOrganizationId'] === 'string'
            ? metadata['supportAccessOrganizationId']
            : null,
      };
    }

    const activeRole = this.currentOrganization.snapshot().role;
    const role = activeRole ?? this.resolveRole(metadata);
    const portals = ROLE_PORTAL_ACCESS[role] ?? [];

    return {
      userId: user.id,
      email: user.email,
      role,
      portals,
      supportAccessOrganizationId:
        typeof metadata['supportAccessOrganizationId'] === 'string'
          ? metadata['supportAccessOrganizationId']
          : null,
    };
  }

  hasRole(requiredRoles: readonly string[]): boolean {
    if (!requiredRoles.length) {
      return true;
    }

    const role = this.resolveUserContext().role;
    return requiredRoles.some((required) => normalizeRole(required) === role);
  }

  private resolveRole(metadata: Record<string, unknown>): PlatformRole {
    const explicitRole = normalizeRole(metadata['role'] ?? metadata['platformRole']);

    // Schema V2 Personal Workspace / tenant — no Web portal grant
    if (explicitRole === 'owner' || explicitRole === 'tenant') {
      return 'public-visitor';
    }

    if (explicitRole && this.isPlatformRole(explicitRole)) {
      return explicitRole;
    }

    const portal = normalizeRole(metadata['portal']);
    if (portal === 'super-admin') {
      return 'super-admin';
    }

    if (portal === 'builder-portal') {
      return 'builder-org-admin';
    }

    if (portal === 'owner-web') {
      return 'owner-org-owner';
    }

    if (portal === 'tenant-portal') {
      return 'tenant-portal-user';
    }

    return 'public-visitor';
  }

  private isPlatformRole(value: string): value is PlatformRole {
    return [
      'public-visitor',
      'super-admin',
      'builder-org-owner',
      'builder-org-admin',
      'builder-org-member',
      'owner-org-owner',
      'owner-web-user',
      'tenant-portal-user',
      'support-user',
    ].includes(value);
  }
}
