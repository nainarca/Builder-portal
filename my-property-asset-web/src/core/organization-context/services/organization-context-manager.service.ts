import { Injectable, inject } from '@angular/core';

import { AuthContextService } from '@core/auth';
import { ApplicationEventBusService } from '@infrastructure/events';
import { FeatureFlagService } from '@infrastructure/feature-flags';
import { NotificationService } from '@infrastructure/notification';
import { NavigationService } from '@navigation/services';
import { PlatformRole } from '@core/rbac/models/permission.model';
import { normalizeRole } from '@core/rbac/utils/permission.utils';
import { ORGANIZATION_EVENT_TYPES } from '../constants/organization.constants';
import { Organization, OrganizationMembership } from '../models/organization.model';
import { OrganizationBrandingService } from './organization-branding.service';
import { OrganizationCacheService } from './organization-cache.service';
import { OrganizationMembershipService } from './organization-membership.service';
import { OrganizationStoreService } from './organization-store.service';

@Injectable({ providedIn: 'root' })
export class OrganizationSwitchService {
  private readonly authContext = inject(AuthContextService);
  private readonly store = inject(OrganizationStoreService);
  private readonly cache = inject(OrganizationCacheService);
  private readonly branding = inject(OrganizationBrandingService);
  private readonly navigation = inject(NavigationService);
  private readonly featureFlags = inject(FeatureFlagService);
  private readonly notifications = inject(NotificationService);
  private readonly eventBus = inject(ApplicationEventBusService);

  async switchToOrganization(organizationId: string): Promise<boolean> {
    const user = this.authContext.user();
    if (!user) {
      return false;
    }

    const membership = this.store.memberships().find((item) => item.organizationId === organizationId);
    if (!membership) {
      this.eventBus.publish({
        type: ORGANIZATION_EVENT_TYPES.switchFailed,
        payload: { organizationId },
        timestamp: Date.now(),
      });
      this.notifications.warning(
        'Organization unavailable',
        'You do not have access to that organization.',
      );
      return false;
    }

    this.store.setSwitching(true);

    try {
      this.cache.persistLastUsedOrganization(user.id, organizationId);
      const organization = this.toOrganization(membership);
      this.store.applyActiveOrganization(organization);
      this.refreshDependentContexts(organization);

      this.eventBus.publish({
        type: ORGANIZATION_EVENT_TYPES.switched,
        payload: {
          organizationId: organization.id,
          organizationName: organization.name,
        },
        timestamp: Date.now(),
      });
      this.eventBus.publish({
        type: ORGANIZATION_EVENT_TYPES.contextChanged,
        payload: {
          organizationId: organization.id,
          organizationName: organization.name,
          organizationType: organization.type,
        },
        timestamp: Date.now(),
      });

      this.notifications.success(
        'Organization updated',
        `You are now working in ${organization.name}.`,
      );

      return true;
    } finally {
      this.store.setSwitching(false);
    }
  }

  private refreshDependentContexts(organization: Organization): void {
    this.branding.applyForOrganization(organization);
    this.featureFlags.initialize();
    this.navigation.refreshContext();
    // Authorization re-resolution is triggered reactively via ORGANIZATION_EVENT_TYPES.switched/
    // contextChanged, which AuthorizationService already subscribes to — see authorization.service.ts.
    // This keeps organization-context decoupled from rbac (rbac depends on organization-context,
    // never the reverse), avoiding the circular dependency that direct injection here caused.
  }

  private toOrganization(membership: OrganizationMembership): Organization {
    return {
      id: membership.organizationId,
      name: membership.organizationName,
      shortName: membership.branding?.shortName,
      type: membership.organizationType,
      membershipRole: membership.role,
      branding: membership.branding,
      logoUrl: membership.branding?.logo?.src,
      primaryColor: membership.branding?.primaryColor,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class OrganizationContextManagerService {
  private readonly authContext = inject(AuthContextService);
  private readonly store = inject(OrganizationStoreService);
  private readonly membershipService = inject(OrganizationMembershipService);
  private readonly cache = inject(OrganizationCacheService);
  private readonly branding = inject(OrganizationBrandingService);
  private readonly switchService = inject(OrganizationSwitchService);
  private readonly eventBus = inject(ApplicationEventBusService);

  initialize(): void {
    // Reserved for future cross-tab organization sync.
  }

  async resolve(): Promise<void> {
    if (!this.authContext.isAuthenticated()) {
      this.clear();
      return;
    }

    this.store.setLoading(true);

    try {
      const user = this.authContext.user();
      const metadata = user?.metadata ?? {};
      const role = normalizeRole(metadata['role'] ?? metadata['platformRole']) as PlatformRole | null;

      if (role === 'super-admin' || role === 'support-user') {
        this.store.applyPlatformContext();
        this.branding.applyPlatformBrand();
        this.publishResolved(null);
        return;
      }

      const memberships = this.membershipService.resolveMemberships();
      this.store.setMemberships(memberships);

      if (!memberships.length) {
        this.store.setError('Organization context is unavailable.');
        return;
      }

      const activeMembership = this.resolveActiveMembership(user!.id, memberships);
      const organization = this.toOrganization(activeMembership);
      this.store.applyActiveOrganization(organization);
      this.cache.persistLastUsedOrganization(user!.id, organization.id);
      this.branding.applyForOrganization(organization);
      this.publishResolved(organization);
    } catch {
      this.store.setError('Unable to resolve organization context.');
    } finally {
      this.store.setLoading(false);
    }
  }

  async switchOrganization(organizationId: string): Promise<boolean> {
    return this.switchService.switchToOrganization(organizationId);
  }

  clear(): void {
    const userId = this.authContext.user()?.id;
    this.cache.clear(userId);
    this.store.clear();
    this.branding.applyPlatformBrand();
    this.eventBus.publish({
      type: ORGANIZATION_EVENT_TYPES.contextCleared,
      timestamp: Date.now(),
    });
  }

  private resolveActiveMembership(
    userId: string,
    memberships: OrganizationMembership[],
  ): OrganizationMembership {
    const sessionOrganizationId = this.cache.getSessionOrganizationId(userId);
    const lastUsedOrganizationId = this.cache.getLastUsedOrganizationId(userId);

    const candidates = [sessionOrganizationId, lastUsedOrganizationId].filter(Boolean) as string[];

    for (const candidate of candidates) {
      const match = memberships.find((membership) => membership.organizationId === candidate);
      if (match) {
        return match;
      }
    }

    return memberships.find((membership) => membership.isDefault) ?? memberships[0];
  }

  private toOrganization(membership: OrganizationMembership): Organization {
    return {
      id: membership.organizationId,
      name: membership.organizationName,
      shortName: membership.branding?.shortName,
      type: membership.organizationType,
      membershipRole: membership.role,
      branding: membership.branding,
      logoUrl: membership.branding?.logo?.src,
      primaryColor: membership.branding?.primaryColor,
    };
  }

  private publishResolved(organization: Organization | null): void {
    this.eventBus.publish({
      type: ORGANIZATION_EVENT_TYPES.contextResolved,
      payload: organization
        ? {
            organizationId: organization.id,
            organizationName: organization.name,
            organizationType: organization.type,
          }
        : { platform: true },
      timestamp: Date.now(),
    });
    this.eventBus.publish({
      type: ORGANIZATION_EVENT_TYPES.contextChanged,
      payload: organization
        ? {
            organizationId: organization.id,
            organizationName: organization.name,
            organizationType: organization.type,
          }
        : { platform: true },
      timestamp: Date.now(),
    });
  }
}
