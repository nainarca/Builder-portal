import { Injectable, inject } from '@angular/core';

import { AuthContextService } from '@core/auth';
import { PlatformRole } from '@core/rbac/models/permission.model';
import { normalizeRole } from '@core/rbac/utils/permission.utils';
import { OrganizationMembership } from '../models/organization.model';
import { BuilderSessionBridgeService } from './builder-session-bridge.service';

@Injectable({ providedIn: 'root' })
export class OrganizationMembershipService {
  private readonly authContext = inject(AuthContextService);
  private readonly builderSession = inject(BuilderSessionBridgeService);

  resolveMemberships(): OrganizationMembership[] {
    const user = this.authContext.user();
    if (!user) {
      return [];
    }

    const metadata = user.metadata ?? {};
    const organizations = metadata['organizations'];

    let memberships: OrganizationMembership[] = [];

    if (Array.isArray(organizations) && organizations.length > 0) {
      memberships = organizations
        .map((entry) => this.mapMembership(entry))
        .filter((entry): entry is OrganizationMembership => entry !== null);
    } else {
      memberships = this.createFallbackMembership(metadata);
    }

    const bridged = this.builderSession.membership();
    if (bridged && !memberships.some((m) => m.organizationId === bridged.organizationId)) {
      memberships = [...memberships, bridged];
    }

    return memberships;
  }

  private mapMembership(entry: unknown): OrganizationMembership | null {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const record = entry as Record<string, unknown>;
    const organizationId = typeof record['id'] === 'string' ? record['id'] : null;
    const organizationName = typeof record['name'] === 'string' ? record['name'] : null;
    const organizationType = this.normalizeOrganizationType(record['type']);
    const role = normalizeRole(record['role']) as PlatformRole | null;

    if (!organizationId || !organizationName || !organizationType || !role) {
      return null;
    }

    return {
      organizationId,
      organizationName,
      organizationType,
      role,
      isDefault: Boolean(record['isDefault']),
      branding: this.readBranding(record['branding']),
    };
  }

  private createFallbackMembership(metadata: Record<string, unknown>): OrganizationMembership[] {
    const roleKey = normalizeRole(metadata['role'] ?? metadata['platformRole']);
    if (!roleKey || roleKey === 'public-visitor') {
      return [];
    }

    // Schema V2 personal/tenant — no Web portal membership (Flutter only)
    if (roleKey === 'owner' || roleKey === 'tenant') {
      return [];
    }

    if (roleKey === 'super-admin' || roleKey === 'support-user') {
      return [];
    }

    const role = roleKey as PlatformRole;
    const organizationId =
      typeof metadata['organizationId'] === 'string' ? metadata['organizationId'] : null;
    const organizationName =
      typeof metadata['organizationName'] === 'string'
        ? metadata['organizationName']
        : 'Organization';
    const organizationType =
      this.normalizeOrganizationType(metadata['organizationType']) ??
      (role.startsWith('builder-org-')
        ? 'builder'
        : role.startsWith('owner-')
          ? 'owner'
          : 'builder');

    return [
      {
        organizationId: organizationId ?? `${organizationType}-organization`,
        organizationName,
        organizationType,
        role,
        isDefault: true,
        branding: this.readBranding(metadata['branding']),
      },
    ];
  }

  private readBranding(value: unknown): OrganizationMembership['branding'] {
    if (!value || typeof value !== 'object') {
      return undefined;
    }

    const record = value as Record<string, unknown>;
    const logo = this.readLogo(record['logo']);

    return {
      id: typeof record['id'] === 'string' ? record['id'] : undefined,
      name: typeof record['name'] === 'string' ? record['name'] : undefined,
      shortName: typeof record['shortName'] === 'string' ? record['shortName'] : undefined,
      primaryColor: typeof record['primaryColor'] === 'string' ? record['primaryColor'] : undefined,
      logo,
    };
  }

  private readLogo(value: unknown): NonNullable<OrganizationMembership['branding']>['logo'] {
    if (!value || typeof value !== 'object') {
      return undefined;
    }

    const record = value as Record<string, unknown>;
    if (typeof record['src'] !== 'string') {
      return undefined;
    }

    return {
      src: record['src'],
      alt: typeof record['alt'] === 'string' ? record['alt'] : 'Organization logo',
      width: typeof record['width'] === 'number' ? record['width'] : undefined,
      height: typeof record['height'] === 'number' ? record['height'] : undefined,
    };
  }

  private normalizeOrganizationType(
    value: unknown,
  ): OrganizationMembership['organizationType'] | null {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.toLowerCase();
    if (
      normalized === 'platform' ||
      normalized === 'builder' ||
      normalized === 'owner' ||
      normalized === 'partner' ||
      normalized === 'marketplace' ||
      normalized === 'support'
    ) {
      return normalized;
    }

    return null;
  }
}
