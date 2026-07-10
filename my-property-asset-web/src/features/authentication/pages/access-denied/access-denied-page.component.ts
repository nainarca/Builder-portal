import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AUTH_ROUTE_SEGMENTS } from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import { ErrorStateComponent } from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';

@Component({
  selector: 'app-access-denied-page',
  imports: [AuthFormCardComponent, ErrorStateComponent],
  templateUrl: './access-denied-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly reason = computed(() => this.route.snapshot.queryParamMap.get('deniedReason') ?? 'denied');

  readonly subtitle = computed(() => {
    switch (this.reason()) {
      case 'organization':
        return 'We could not verify your organization access for this workspace.';
      case 'portal':
        return 'This workspace is not enabled for your account type.';
      case 'role':
        return 'Your account role does not include this workspace.';
      case 'feature':
        return 'This capability is not currently available for your account.';
      default:
        return 'You do not have permission to open the requested workspace.';
    }
  });

  readonly description = computed(() => {
    switch (this.reason()) {
      case 'organization':
        return 'Contact your organization administrator to confirm your membership and try again.';
      case 'portal':
        return 'Sign in with the appropriate workspace account or contact your platform administrator.';
      case 'role':
        return 'If your responsibilities changed recently, sign out and sign back in to refresh your access.';
      default:
        return 'Contact your organization administrator if you believe this is an error.';
    }
  });

  goToLogin(): void {
    void this.router.navigateByUrl(
      `/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.login}`,
    );
  }
}
