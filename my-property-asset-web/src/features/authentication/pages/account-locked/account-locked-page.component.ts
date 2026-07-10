import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AUTH_ROUTE_SEGMENTS } from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import { FeedbackStateComponent } from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';

@Component({
  selector: 'app-account-locked-page',
  imports: [AuthFormCardComponent, FeedbackStateComponent],
  template: `
    <app-auth-form-card
      title="Account temporarily locked"
      subtitle="Multiple unsuccessful sign-in attempts triggered a protective lock."
    >
      <app-feedback-state
        icon="lock"
        title="Security hold active"
        description="Please wait before trying again or contact your administrator to restore access. MFA and SSO recovery will be available in a future release."
        actionLabel="Return to sign in"
        (action)="goToLogin()"
      />
    </app-auth-form-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountLockedPageComponent {
  private readonly router = inject(Router);

  goToLogin(): void {
    void this.router.navigate(['/', APP_ROUTES.authentication, AUTH_ROUTE_SEGMENTS.login]);
  }
}
