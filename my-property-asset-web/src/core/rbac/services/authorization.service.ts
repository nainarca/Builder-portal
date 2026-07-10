import { Injectable, inject } from '@angular/core';

import { NotificationService } from '@infrastructure/notification';
import { ApplicationEventBusService } from '@infrastructure/events';
import { OrganizationContextService } from '@core/organization-context';
import { CurrentOrganizationService } from '@core/organization-context';
import { ORGANIZATION_EVENT_TYPES } from '@core/organization-context/constants/organization.constants';
import { AUTH_EVENT_TYPES } from '@core/auth/constants/auth.constants';
import { AuthorizationResult } from '../models/permission.model';
import { RBAC_EVENT_TYPES } from '../constants/rbac.constants';
import { AuthorizationContextService } from './authorization-context.service';
import { PermissionResolverService } from './permission-resolver.service';
import { PolicyEvaluationService } from './policy-evaluation.service';
import { RoleService } from './role.service';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly authorizationContext = inject(AuthorizationContextService);
  private readonly policyEvaluation = inject(PolicyEvaluationService);

  readonly permissions = this.authorizationContext.permissions;

  hasPermission(requirement: string): boolean {
    return this.policyEvaluation.evaluatePermissions(this.permissions(), [requirement]).granted;
  }

  hasAnyPermission(requirements: readonly string[]): boolean {
    return this.policyEvaluation
      .evaluatePermissions(this.permissions(), requirements, 'any')
      .granted;
  }

  hasAllPermissions(requirements: readonly string[]): boolean {
    return this.policyEvaluation
      .evaluatePermissions(this.permissions(), requirements, 'all')
      .granted;
  }

  canAccessPortal(portalPermission: string): boolean {
    return this.policyEvaluation.evaluatePortal(this.permissions(), portalPermission).granted;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly authorizationContext = inject(AuthorizationContextService);
  private readonly permissionService = inject(PermissionService);
  private readonly roleService = inject(RoleService);
  private readonly permissionResolver = inject(PermissionResolverService);
  private readonly policyEvaluation = inject(PolicyEvaluationService);
  private readonly organizationContext = inject(OrganizationContextService);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly eventBus = inject(ApplicationEventBusService);
  private readonly notifications = inject(NotificationService);

  readonly state = this.authorizationContext.authorizationState;
  readonly permissions = this.authorizationContext.permissions;
  readonly role = this.authorizationContext.role;

  initialize(): void {
    this.eventBus.on(AUTH_EVENT_TYPES.signedIn, () => {
      void this.resolveAuthorization();
    });

    this.eventBus.on(AUTH_EVENT_TYPES.signedOut, () => {
      this.clear();
    });

    this.eventBus.on(AUTH_EVENT_TYPES.sessionRefreshed, () => {
      void this.resolveAuthorization();
    });

    this.eventBus.on(ORGANIZATION_EVENT_TYPES.contextChanged, () => {
      void this.resolveAuthorization();
    });

    this.eventBus.on(ORGANIZATION_EVENT_TYPES.switched, () => {
      void this.resolveAuthorization();
    });
  }

  async resolveAuthorization(): Promise<void> {
    this.authorizationContext.setLoading(true);
    this.permissionResolver.invalidate();

    try {
      await this.organizationContext.resolve();
      const userContext = this.roleService.resolveUserContext();
      const organizationId = this.currentOrganization.organizationId();
      const permissions = this.permissionResolver.resolvePermissionSet({
        role: userContext.role,
        supportAccessOrganizationId: userContext.supportAccessOrganizationId,
        organizationId,
      });

      this.authorizationContext.applyResolvedState({
        role: userContext.role,
        permissions,
      });

      this.eventBus.publish({
        type: RBAC_EVENT_TYPES.contextChanged,
        payload: { role: userContext.role },
        timestamp: Date.now(),
      });
      this.eventBus.publish({
        type: RBAC_EVENT_TYPES.permissionChanged,
        timestamp: Date.now(),
      });
    } catch {
      this.authorizationContext.applyResolvedState({
        role: null,
        permissions: {},
        error: 'Unable to resolve access permissions.',
      });
    }
  }

  clear(): void {
    this.authorizationContext.clear();
    this.organizationContext.clear();
  }

  hasPermission(requirement: string): boolean {
    return this.permissionService.hasPermission(requirement);
  }

  hasRole(requiredRoles: readonly string[]): boolean {
    return this.roleService.hasRole(requiredRoles);
  }

  authorize(input: {
    permissions?: readonly string[];
    roles?: readonly string[];
    portal?: string;
    featureFlag?: string;
    requireOrganizationContext?: boolean;
  }): AuthorizationResult {
    if (input.requireOrganizationContext && !this.organizationContext.isResolved()) {
      const result: AuthorizationResult = {
        granted: false,
        reason: 'organization',
        message: 'Your organization context could not be verified.',
      };
      this.publishFailure(result);
      return result;
    }

    if (input.roles?.length && !this.hasRole(input.roles)) {
      const result: AuthorizationResult = {
        granted: false,
        reason: 'role',
        message: 'This workspace is not available for your account type.',
      };
      this.publishFailure(result);
      return result;
    }

    if (input.portal) {
      const portalResult = this.policyEvaluation.evaluatePortal(this.permissions(), input.portal);
      if (!portalResult.granted) {
        this.publishFailure(portalResult);
        return portalResult;
      }
    }

    const featureResult = this.policyEvaluation.evaluateFeature(input.featureFlag);
    if (!featureResult.granted) {
      this.publishFailure(featureResult);
      return featureResult;
    }

    if (input.permissions?.length) {
      const permissionResult = this.policyEvaluation.evaluatePermissions(
        this.permissions(),
        input.permissions,
      );
      if (!permissionResult.granted) {
        this.publishFailure(permissionResult);
        return permissionResult;
      }
    }

    const granted: AuthorizationResult = { granted: true, reason: 'authenticated' };
    this.eventBus.publish({
      type: RBAC_EVENT_TYPES.authorizationGranted,
      timestamp: Date.now(),
    });
    return granted;
  }

  private publishFailure(result: AuthorizationResult): void {
    this.eventBus.publish({
      type: RBAC_EVENT_TYPES.authorizationFailed,
      payload: { reason: result.reason, message: result.message },
      timestamp: Date.now(),
    });

    if (result.message) {
      this.notifications.warning('Access limited', result.message);
    }
  }
}
