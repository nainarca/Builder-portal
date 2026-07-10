import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  AUTH_ROUTE_SEGMENTS,
  AUTH_VALIDATION,
  AuthenticationService,
} from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import {
  ButtonComponent,
  FormActionsComponent,
  SuccessStateComponent,
  ValidationSummaryComponent,
} from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';
import { AuthPasswordFieldComponent } from '../../components/auth-password-field/auth-password-field.component';
import { collectValidationIssues } from '../../utils/auth-form.utils';

@Component({
  selector: 'app-reset-password-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthFormCardComponent,
    AuthPasswordFieldComponent,
    ButtonComponent,
    FormActionsComponent,
    ValidationSummaryComponent,
    SuccessStateComponent,
  ],
  templateUrl: './reset-password-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent implements OnInit {
  private readonly authentication = inject(AuthenticationService);
  private readonly router = inject(Router);

  readonly authRoutes = AUTH_ROUTE_SEGMENTS;
  readonly appRoutes = APP_ROUTES;

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly completed = signal(false);
  readonly validationIssues = signal<{ field: string; message: string }[]>([]);

  readonly form = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(AUTH_VALIDATION.passwordMinLength)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.form.addValidators(() => {
      const password = this.form.controls.password.value;
      const confirm = this.form.controls.confirmPassword.value;
      return password === confirm ? null : { passwordMismatch: true };
    });
  }

  async onSubmit(): Promise<void> {
    this.submitError.set(null);
    this.validationIssues.set([]);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const issues = collectValidationIssues(this.form, {
        password: 'Password',
        confirmPassword: 'Confirm password',
      });

      if (this.form.hasError('passwordMismatch')) {
        issues.push({
          field: 'confirmPassword',
          message: 'Passwords do not match.',
        });
      }

      this.validationIssues.set(issues);
      return;
    }

    this.submitting.set(true);

    try {
      await this.authentication.updatePassword(this.form.controls.password.value);
      this.completed.set(true);
      setTimeout(() => {
        void this.router.navigate(['/', this.appRoutes.authentication, this.authRoutes.login]);
      }, 1200);
    } catch (error) {
      this.submitError.set(error instanceof Error ? error.message : 'Unable to update password.');
    } finally {
      this.submitting.set(false);
    }
  }
}
