import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthorizationService } from '../../rbac/services/authorization.service';
import { RoleService } from '../../rbac/services/role.service';
import { AuthContextService } from '../services/auth-context.service';
import { AuthRedirectService } from '../services/auth-session.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';

export const authenticatedGuard: CanActivateFn = async (_route, state) => {
  const authContext = inject(AuthContextService);
  const supabaseAuth = inject(SupabaseAuthService);
  const authRedirect = inject(AuthRedirectService);

  if (!authContext.isInitialized()) {
    await supabaseAuth.restoreSession();
  }

  if (authContext.isAuthenticated()) {
    return true;
  }

  return inject(Router).parseUrl(authRedirect.buildLoginUrl(state.url));
};

export const guestGuard: CanActivateFn = async (route) => {
  const authContext = inject(AuthContextService);
  const supabaseAuth = inject(SupabaseAuthService);
  const router = inject(Router);
  const authRedirect = inject(AuthRedirectService);
  const authorization = inject(AuthorizationService);
  const roleService = inject(RoleService);

  if (!authContext.isInitialized()) {
    await supabaseAuth.restoreSession();
  }

  if (!authContext.isAuthenticated()) {
    return true;
  }

  await authorization.resolveAuthorization();
  const portals = roleService.resolveUserContext().portals;
  const returnUrl = route.queryParamMap.get('returnUrl');
  return router.parseUrl(authRedirect.resolvePostLoginUrl(returnUrl, portals));
};
