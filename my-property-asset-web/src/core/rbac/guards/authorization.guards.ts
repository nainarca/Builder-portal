import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { OrganizationContextService } from '@core/organization-context';
import { readRouteMetadata } from '@navigation/utils';
import { AuthorizationService } from '../services/authorization.service';
import { AuthRedirectService } from '@core/auth';

function readAuthorizationMetadata(route: Parameters<CanActivateFn>[0]) {
  let snapshot = route;
  const merged: {
    permissions?: readonly string[];
    roles?: readonly string[];
    portal?: string;
    featureFlag?: string;
    organizationContext?: boolean;
  } = {};

  while (snapshot) {
    const metadata = readRouteMetadata(snapshot);
    merged.permissions = merged.permissions ?? metadata.permissions;
    merged.roles = merged.roles ?? (metadata as { roles?: readonly string[] }).roles;
    merged.portal = merged.portal ?? (metadata as { portal?: string }).portal;
    merged.featureFlag = merged.featureFlag ?? metadata.featureFlag;
    merged.organizationContext =
      merged.organizationContext ?? metadata.organizationContext;
    snapshot = snapshot.parent!;
  }

  return merged;
}

export const permissionGuard: CanActivateFn = (route) => {
  const authorization = inject(AuthorizationService);
  const authRedirect = inject(AuthRedirectService);
  const router = inject(Router);
  const metadata = readAuthorizationMetadata(route);

  const result = authorization.authorize({
    permissions: metadata.permissions,
    roles: metadata.roles,
    portal: metadata.portal,
    featureFlag: metadata.featureFlag,
    requireOrganizationContext: metadata.organizationContext,
  });

  if (result.granted) {
    return true;
  }

  return router.parseUrl(authRedirect.buildAccessDeniedUrl(result.reason));
};

export const roleGuard: CanActivateFn = (route) => {
  const authorization = inject(AuthorizationService);
  const authRedirect = inject(AuthRedirectService);
  const router = inject(Router);
  const metadata = readAuthorizationMetadata(route);
  const roles = metadata.roles ?? (route.data['roles'] as readonly string[] | undefined);

  const result = authorization.authorize({ roles });
  if (result.granted) {
    return true;
  }

  return router.parseUrl(authRedirect.buildAccessDeniedUrl(result.reason));
};

export const portalGuard: CanActivateFn = (route) => {
  const authorization = inject(AuthorizationService);
  const authRedirect = inject(AuthRedirectService);
  const router = inject(Router);
  const metadata = readAuthorizationMetadata(route);
  const portal = metadata.portal ?? (route.data['portal'] as string | undefined);

  const result = authorization.authorize({ portal });
  if (result.granted) {
    return true;
  }

  return router.parseUrl(authRedirect.buildAccessDeniedUrl(result.reason));
};

export const featureGuard: CanActivateFn = (route) => {
  const authorization = inject(AuthorizationService);
  const authRedirect = inject(AuthRedirectService);
  const router = inject(Router);
  const metadata = readAuthorizationMetadata(route);

  const result = authorization.authorize({ featureFlag: metadata.featureFlag });
  if (result.granted) {
    return true;
  }

  return router.parseUrl(authRedirect.buildAccessDeniedUrl(result.reason));
};

export const organizationContextGuard: CanActivateFn = () => {
  const organizationContext = inject(OrganizationContextService);
  const authRedirect = inject(AuthRedirectService);
  const router = inject(Router);

  if (organizationContext.isResolved()) {
    return true;
  }

  return router.parseUrl(authRedirect.buildAccessDeniedUrl('organization'));
};

export const authorizationGuard: CanActivateFn = (route, state) => permissionGuard(route, state);
