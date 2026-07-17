import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  AUTH_ROUTE_SEGMENTS,
  AUTH_VALIDATION,
  AuthenticationService,
} from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import {
  ButtonComponent,
  EnterpriseFormLayoutComponent,
  EnterpriseValidationSummaryComponent,
  ErrorAlertComponent,
  FormActionsComponent,
  SuccessStateComponent,
} from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';
import { AuthFormFieldComponent } from '../../components/auth-form-field/auth-form-field.component';
import { AuthPageComponent } from '../../components/layout';
import { collectValidationIssues } from '../../utils/auth-form.utils';

@Component({
  selector: 'app-forgot-password-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthPageComponent,
    AuthFormCardComponent,
    AuthFormFieldComponent,
    EnterpriseFormLayoutComponent,
    EnterpriseValidationSummaryComponent,
    ErrorAlertComponent,
    ButtonComponent,
    FormActionsComponent,
    SuccessStateComponent,
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: '../../styles/auth-page.shared.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private readonly authentication = inject(AuthenticationService);

  readonly authRoutes = AUTH_ROUTE_SEGMENTS;
  readonly appRoutes = APP_ROUTES;

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitted = signal(false);
  readonly validationIssues = signal<{ field: string; message: string }[]>([]);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(AUTH_VALIDATION.emailPattern)],
    }),
  });

  async onSubmit(): Promise<void> {
    this.submitError.set(null);
    this.validationIssues.set([]);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationIssues.set(collectValidationIssues(this.form, { email: 'Email' }));
      return;
    }

    this.submitting.set(true);

    try {
      await this.authentication.requestPasswordReset(this.form.controls.email.value);
      this.submitted.set(true);
    } catch (error) {
      this.submitError.set(
        error instanceof Error ? error.message : 'Unable to send reset instructions.',
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
