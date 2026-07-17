import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthRedirectService } from '@core/auth';
import { ErrorStateComponent } from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';
import { AuthPageComponent } from '../../components/layout';

@Component({
  selector: 'app-session-expired-page',
  imports: [AuthPageComponent, AuthFormCardComponent, ErrorStateComponent],
  templateUrl: './session-expired-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionExpiredPageComponent {
  private readonly authRedirect = inject(AuthRedirectService);
  private readonly route = inject(ActivatedRoute);

  readonly reason = computed(
    () => this.route.snapshot.queryParamMap.get('reason') ?? 'token',
  );

  readonly subtitle = computed(() =>
    this.reason() === 'idle'
      ? 'For your security, we signed you out after a period of inactivity.'
      : 'Your secure session ended and needs to be renewed.',
  );

  readonly description = computed(() =>
    this.reason() === 'idle'
      ? 'Sign back in to return to your workspace and pick up where you left off.'
      : 'Sign in again to restore access to your workspace.',
  );

  signInAgain(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? undefined;
    void this.authRedirect.navigateToLogin(returnUrl);
  }
}
