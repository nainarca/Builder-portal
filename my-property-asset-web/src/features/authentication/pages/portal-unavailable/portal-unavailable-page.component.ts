import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  AUTH_PORTAL_UNAVAILABLE_MESSAGE,
  AUTH_ROUTE_SEGMENTS,
  AuthenticationService,
} from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import { ErrorStateComponent } from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';

@Component({
  selector: 'app-portal-unavailable-page',
  imports: [AuthFormCardComponent, ErrorStateComponent],
  templateUrl: './portal-unavailable-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalUnavailablePageComponent {
  private readonly router = inject(Router);
  private readonly authentication = inject(AuthenticationService);

  readonly message = AUTH_PORTAL_UNAVAILABLE_MESSAGE;

  goToPublicHome(): void {
    void this.router.navigateByUrl(`/${APP_ROUTES.publicWebsite}`);
  }

  async signOut(): Promise<void> {
    await this.authentication.signOut();
    await this.router.navigateByUrl(
      `/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.login}`,
    );
  }
}
