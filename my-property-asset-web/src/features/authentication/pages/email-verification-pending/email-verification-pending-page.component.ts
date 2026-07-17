import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AUTH_ROUTE_SEGMENTS } from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import { FeedbackStateComponent } from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';
import { AuthPageComponent } from '../../components/layout';

@Component({
  selector: 'app-email-verification-pending-page',
  imports: [AuthPageComponent, AuthFormCardComponent, FeedbackStateComponent],
  template: `
    <app-auth-page>
      <app-auth-form-card
        eyebrow="Account setup"
        title="Verify your email"
        subtitle="We sent a verification link to complete your account setup."
        [showTrustFooter]="false"
      >
        <app-feedback-state
          icon="envelope"
          title="Check your inbox"
          [description]="description()"
          actionLabel="Return to sign in"
          (action)="goToLogin()"
        />
      </app-auth-form-card>
    </app-auth-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailVerificationPendingPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly description = computed(() => {
    const email = this.route.snapshot.queryParamMap.get('email');
    return email
      ? `Open the verification email sent to ${email} before signing in.`
      : 'Open the verification email we sent to your address before signing in.';
  });

  goToLogin(): void {
    void this.router.navigate(['/', APP_ROUTES.authentication, AUTH_ROUTE_SEGMENTS.login]);
  }
}
