import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AUTH_ROUTE_SEGMENTS,
  AuthRedirectService,
  AuthenticationService,
} from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import { BuilderSessionBridgeService } from '@core/organization-context';
import { AuthorizationService } from '@core/rbac';
import {
  ButtonComponent,
  EnterpriseFormLayoutComponent,
  EnterpriseValidationSummaryComponent,
  ErrorAlertComponent,
  FormActionsComponent,
  SuccessAlertComponent,
} from '@shared/ui';
import { BuilderOrganizationService } from '../../../builder-portal/organization/services/builder-organization.service';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';
import { AuthFormFieldComponent } from '../../components/auth-form-field/auth-form-field.component';
import { AuthPageComponent } from '../../components/layout';
import { collectValidationIssues } from '../../utils/auth-form.utils';

@Component({
  selector: 'app-builder-invitation-accept-page',
  imports: [
    ReactiveFormsModule,
    AuthPageComponent,
    AuthFormCardComponent,
    AuthFormFieldComponent,
    EnterpriseFormLayoutComponent,
    EnterpriseValidationSummaryComponent,
    ErrorAlertComponent,
    SuccessAlertComponent,
    ButtonComponent,
    FormActionsComponent,
  ],
  templateUrl: './builder-invitation-accept-page.component.html',
  styleUrl: '../../styles/auth-page.shared.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderInvitationAcceptPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly organizationService = inject(BuilderOrganizationService);
  private readonly authentication = inject(AuthenticationService);
  private readonly authorization = inject(AuthorizationService);
  private readonly authRedirect = inject(AuthRedirectService);
  private readonly builderSession = inject(BuilderSessionBridgeService);

  readonly message = signal<string | null>(null);
  readonly error = signal<string | null>(null);
  readonly accepting = signal(false);
  readonly validationIssues = signal<{ field: string; message: string }[]>([]);

  readonly form = new FormGroup({
    token: new FormControl(this.route.snapshot.queryParamMap.get('token') ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  async accept(): Promise<void> {
    this.error.set(null);
    this.message.set(null);
    this.validationIssues.set([]);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationIssues.set(collectValidationIssues(this.form, { token: 'Invitation token' }));
      return;
    }

    const token = this.form.controls.token.value;

    if (!this.authentication.isAuthenticated()) {
      await this.authRedirect.navigateToLogin(
        `/${APP_ROUTES.authentication}/${AUTH_ROUTE_SEGMENTS.builderInvitation}?token=${encodeURIComponent(token)}`,
      );
      return;
    }

    this.accepting.set(true);
    try {
      const accepted = this.organizationService.acceptInvitation(token);
      if (!accepted) {
        this.error.set('Invitation is invalid, expired, or already used.');
        return;
      }

      const roleMap = {
        builder_owner: 'builder-org-owner',
        builder_admin: 'builder-org-admin',
        builder_staff: 'builder-org-member',
      } as const;

      const company = this.organizationService.getCompanyByOrganizationId(accepted.organizationId);
      this.builderSession.setMembership({
        organizationId: accepted.organizationId,
        organizationName: company?.legalName ?? 'Builder Organization',
        organizationType: 'builder',
        role: roleMap[accepted.invitedRole],
        isDefault: true,
      });

      await this.authorization.resolveAuthorization();
      this.message.set('Invitation accepted. Opening Builder Dashboard…');
      await this.router.navigateByUrl(`/${APP_ROUTES.builderPortal}`);
    } finally {
      this.accepting.set(false);
    }
  }
}
