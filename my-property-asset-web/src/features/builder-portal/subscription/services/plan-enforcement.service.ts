import { Injectable, computed, inject } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';
import { OwnerStoreService } from '../../owners/services/owner-store.service';
import { InMemoryBuilderBuildingRepository } from '../../projects/buildings/repositories/in-memory-builder-building.repository';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import { UnitStoreService } from '../../projects/units/services/unit-store.service';
import {
  EnforceableAction,
  LimitCheckResult,
  PlanLimits,
  UsageSnapshot,
} from '../models/subscription.model';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Injectable({ providedIn: 'root' })
export class PlanEnforcementService {
  private readonly repository = inject(SubscriptionRepository);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly projects = inject(ProjectStoreService);
  private readonly units = inject(UnitStoreService);
  private readonly owners = inject(OwnerStoreService);
  private readonly buildings = inject(InMemoryBuilderBuildingRepository);

  readonly usage = computed<UsageSnapshot>(() => this.collectUsage());

  check(action: EnforceableAction): LimitCheckResult {
    const organizationId = this.currentOrganization.organizationId() ?? 'org-builder-demo';
    const subscription =
      this.repository.getActiveSubscription(organizationId) ??
      this.repository
        .listSubscriptions(organizationId)
        .find((item) => item.status === 'suspended' || item.status === 'expired');

    if (!subscription) {
      return {
        allowed: false,
        action,
        reason: 'No active subscription. Start a trial or choose a plan.',
        upgradeRequired: true,
      };
    }
    if (subscription.status === 'suspended' || subscription.status === 'expired') {
      return {
        allowed: false,
        action,
        reason: `Subscription is ${subscription.status}. Renew or reactivate to continue.`,
        upgradeRequired: true,
      };
    }

    const plan = this.repository.getPlanById(subscription.planId);
    if (!plan) {
      return {
        allowed: false,
        action,
        reason: 'Subscription plan is missing.',
        upgradeRequired: true,
      };
    }

    const usage = this.collectUsage();
    const limits = plan.limits;
    const mapping = this.mapAction(action, usage, limits);
    if (!mapping) {
      return { allowed: true, action, upgradeRequired: false };
    }

    if (mapping.currentUsage >= mapping.limit) {
      return {
        allowed: false,
        action,
        reason: `${mapping.label} limit reached (${mapping.currentUsage}/${mapping.limit}). Upgrade your plan to continue.`,
        upgradeRequired: true,
        currentUsage: mapping.currentUsage,
        limit: mapping.limit,
      };
    }

    return {
      allowed: true,
      action,
      upgradeRequired: false,
      currentUsage: mapping.currentUsage,
      limit: mapping.limit,
    };
  }

  remainingLimits(): Partial<Record<keyof PlanLimits, number | boolean>> {
    const organizationId = this.currentOrganization.organizationId() ?? 'org-builder-demo';
    const subscription = this.repository.getActiveSubscription(organizationId);
    const plan = subscription ? this.repository.getPlanById(subscription.planId) : undefined;
    const usage = this.collectUsage();
    if (!plan) {
      return {};
    }
    const limits = plan.limits;
    return {
      projects: Math.max(0, limits.projects - usage.projects),
      buildings: Math.max(0, limits.buildings - usage.buildings),
      units: Math.max(0, limits.units - usage.units),
      owners: Math.max(0, limits.owners - usage.owners),
      staff: Math.max(0, limits.staff - usage.staff),
      storageGb: Math.max(0, limits.storageGb - usage.storageGb),
      monthlyNotifications: Math.max(0, limits.monthlyNotifications - usage.monthlyNotifications),
      whiteLabel: limits.whiteLabel,
      advancedReports: limits.advancedReports,
      prioritySupport: limits.prioritySupport,
      apiAccess: limits.apiAccess,
      customDomain: limits.customDomain,
    };
  }

  private collectUsage(): UsageSnapshot {
    const projects = this.projects.projects().filter((p) => !p.archived).length;
    const units = this.units.units().filter((u) => !u.archived).length;
    const owners = this.owners.owners().filter((o) => !o.archived).length;
    const buildings = this.buildings.getAll().filter((b) => !b.archived).length;
    return {
      projects,
      buildings,
      units,
      owners,
      staff: 5,
      storageGb: 12,
      monthlyNotifications: 18,
    };
  }

  private mapAction(
    action: EnforceableAction,
    usage: UsageSnapshot,
    limits: PlanLimits,
  ): { label: string; currentUsage: number; limit: number } | null {
    switch (action) {
      case 'create_project':
        return { label: 'Projects', currentUsage: usage.projects, limit: limits.projects };
      case 'create_unit':
        return { label: 'Units', currentUsage: usage.units, limit: limits.units };
      case 'invite_staff':
        return { label: 'Builder staff', currentUsage: usage.staff, limit: limits.staff };
      case 'upload_document':
        return { label: 'Storage (GB)', currentUsage: usage.storageGb, limit: limits.storageGb };
      case 'send_communication':
        return {
          label: 'Monthly notifications',
          currentUsage: usage.monthlyNotifications,
          limit: limits.monthlyNotifications,
        };
      default:
        return null;
    }
  }
}
