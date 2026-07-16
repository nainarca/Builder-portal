import { Routes } from '@angular/router';

import { guestGuard } from '@core/auth';
import {
  AUTH_ACCESS_DENIED_METADATA,
  AUTH_ACCOUNT_LOCKED_METADATA,
  AUTH_EMAIL_VERIFICATION_METADATA,
  AUTH_FORGOT_PASSWORD_METADATA,
  AUTH_LOGIN_METADATA,
  AUTH_PORTAL_UNAVAILABLE_METADATA,
  AUTH_RESET_PASSWORD_METADATA,
  AUTH_SESSION_EXPIRED_METADATA,
} from '@core/constants/route-metadata.constants';
import { AUTH_ROUTE_SEGMENTS } from '@core/auth/constants/auth.constants';
import { navigationResolver } from '@navigation/resolvers';
import { AuthLayoutComponent } from './layout/auth-layout.component';
import { AccessDeniedPageComponent } from './pages/access-denied/access-denied-page.component';
import { AccountLockedPageComponent } from './pages/account-locked/account-locked-page.component';
import { EmailVerificationPendingPageComponent } from './pages/email-verification-pending/email-verification-pending-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password/forgot-password-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { PortalUnavailablePageComponent } from './pages/portal-unavailable/portal-unavailable-page.component';
import { BuilderInvitationAcceptPageComponent } from './pages/builder-invitation-accept/builder-invitation-accept-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password/reset-password-page.component';
import { SessionExpiredPageComponent } from './pages/session-expired/session-expired-page.component';

export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'public',
      navigationContext: 'authentication',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: AUTH_ROUTE_SEGMENTS.login,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.login,
        component: LoginPageComponent,
        canActivate: [guestGuard],
        data: AUTH_LOGIN_METADATA,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.forgotPassword,
        component: ForgotPasswordPageComponent,
        canActivate: [guestGuard],
        data: AUTH_FORGOT_PASSWORD_METADATA,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.resetPassword,
        component: ResetPasswordPageComponent,
        canActivate: [guestGuard],
        data: AUTH_RESET_PASSWORD_METADATA,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.accessDenied,
        component: AccessDeniedPageComponent,
        data: AUTH_ACCESS_DENIED_METADATA,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.portalUnavailable,
        component: PortalUnavailablePageComponent,
        data: AUTH_PORTAL_UNAVAILABLE_METADATA,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.builderInvitation,
        component: BuilderInvitationAcceptPageComponent,
        data: {
          title: 'Builder Invitation',
          breadcrumb: 'Builder Invitation',
          layout: 'public',
          navigationContext: 'authentication',
          analyticsName: 'auth_builder_invitation',
          visible: false,
        },
      },
      {
        path: AUTH_ROUTE_SEGMENTS.sessionExpired,
        component: SessionExpiredPageComponent,
        data: AUTH_SESSION_EXPIRED_METADATA,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.emailVerification,
        component: EmailVerificationPendingPageComponent,
        data: AUTH_EMAIL_VERIFICATION_METADATA,
      },
      {
        path: AUTH_ROUTE_SEGMENTS.accountLocked,
        component: AccountLockedPageComponent,
        data: AUTH_ACCOUNT_LOCKED_METADATA,
      },
    ],
  },
];
