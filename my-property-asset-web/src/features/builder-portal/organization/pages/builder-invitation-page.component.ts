import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { APP_ROUTES } from '@core/constants/app.constants';
import { AUTH_ROUTE_SEGMENTS } from '@core/auth';

/** Redirects to auth invitation accept flow (works before portal grant exists). */
@Component({
  selector: 'app-builder-invitation-page',
  template: `<p class="builder-invitation-redirect">Redirecting to invitation acceptance…</p>`,
  styles: [
    `
      .builder-invitation-redirect {
        padding: 1.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderInvitationPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const query = token ? `?token=${encodeURIComponent(token)}` : '';
    void this.router.navigateByUrl(
      `/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.builderInvitation}${query}`,
    );
  }
}
