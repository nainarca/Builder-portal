import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  AUTH_PORTAL_UNAVAILABLE_MESSAGE,
  AUTH_ROUTE_SEGMENTS,
  AuthenticationService,
} from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import { ErrorStateComponent, GhostButtonComponent } from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';
import { AuthPageComponent } from '../../components/layout';

@Component({
  selector: 'app-portal-unavailable-page',
  imports: [AuthPageComponent, AuthFormCardComponent, ErrorStateComponent, GhostButtonComponent],
  templateUrl: './portal-unavailable-page.component.html',
  styleUrl: '../../styles/auth-page.shared.scss',
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
