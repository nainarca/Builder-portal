import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthContextService } from '../services/auth-context.service';
import { AuthRedirectService } from '../services/auth-session.service';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { AUTH_DEFAULT_REDIRECT } from '../constants/auth.constants';

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

  if (!authContext.isInitialized()) {
    await supabaseAuth.restoreSession();
  }

  if (!authContext.isAuthenticated()) {
    return true;
  }

  const returnUrl = route.queryParamMap.get('returnUrl');
  if (returnUrl) {
    return router.parseUrl(authRedirect.getSanitizedReturnUrl(returnUrl));
  }

  return router.parseUrl(AUTH_DEFAULT_REDIRECT);
};
