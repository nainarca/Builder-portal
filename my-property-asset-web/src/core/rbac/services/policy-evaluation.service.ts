import { Injectable, inject } from '@angular/core';

import { FeatureFlagService } from '@infrastructure/feature-flags';
import {
  AuthorizationResult,
  PermissionLevel,
  PermissionRequirement,
  PermissionSet,
} from '../models/permission.model';
import { parsePermissionKey, satisfiesPermissionLevel } from '../utils/permission.utils';

@Injectable({ providedIn: 'root' })
export class PolicyEvaluationService {
  private readonly featureFlags = inject(FeatureFlagService);

  evaluatePermission(
    permissions: PermissionSet,
    requirement: PermissionRequirement,
  ): AuthorizationResult {
    const actual = permissions[requirement.resource];

    const granted = satisfiesPermissionLevel(actual, requirement.level);

    return {
      granted,
      reason: granted ? 'permission' : 'denied',
      message: granted
        ? undefined
        : 'You do not have access to perform this action.',
    };
  }

  evaluatePermissions(
    permissions: PermissionSet,
    requirements: readonly string[],
    mode: 'all' | 'any' = 'all',
  ): AuthorizationResult {
    if (!requirements.length) {
      return { granted: true, reason: 'permission' };
    }

    const parsed = requirements
      .map((requirement) => parsePermissionKey(requirement))
      .filter((requirement): requirement is PermissionRequirement => requirement !== null);

    if (!parsed.length) {
      return { granted: true, reason: 'permission' };
    }

    const results = parsed.map((requirement) => this.evaluatePermission(permissions, requirement));
    const granted =
      mode === 'all' ? results.every((result) => result.granted) : results.some((result) => result.granted);

    return {
      granted,
      reason: granted ? 'permission' : 'denied',
      message: granted ? undefined : 'You do not have access to open this area.',
    };
  }

  evaluatePortal(permissions: PermissionSet, portalPermission: string): AuthorizationResult {
    const granted = satisfiesPermissionLevel(permissions[portalPermission] as PermissionLevel, 'read');

    return {
      granted,
      reason: granted ? 'portal' : 'denied',
      message: granted ? undefined : 'This workspace is not available for your account.',
    };
  }

  evaluateFeature(featureFlag?: string): AuthorizationResult {
    if (!featureFlag) {
      return { granted: true, reason: 'feature' };
    }

    const granted = this.featureFlags.isEnabled(featureFlag);
    return {
      granted,
      reason: granted ? 'feature' : 'denied',
      message: granted ? undefined : 'This feature is not currently available.',
    };
  }
}
