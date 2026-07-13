import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import {
  AUTH_CONFIG,
  AUTH_ROUTE_SEGMENTS,
  AUTH_VALIDATION,
  AuthRedirectService,
  AuthenticationService,
  RememberMeService,
} from '@core/auth';
import { APP_ROUTES } from '@core/constants/app.constants';
import { AUTH_ENTRY_EXPERIENCES } from '../../../public-website/config/conversion-entry.config';
import { AuthEntryIntent } from '../../../public-website/models/conversion.model';
import {
  ButtonComponent,
  FormActionsComponent,
  ValidationSummaryComponent,
} from '@shared/ui';
import { AuthFormCardComponent } from '../../components/auth-form-card/auth-form-card.component';
import { AuthFormFieldComponent } from '../../components/auth-form-field/auth-form-field.component';
import { AuthPasswordFieldComponent } from '../../components/auth-password-field/auth-password-field.component';
import { AuthRememberMeComponent } from '../../components/auth-remember-me/auth-remember-me.component';
import { collectValidationIssues } from '../../utils/auth-form.utils';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    AuthFormCardComponent,
    AuthFormFieldComponent,
    AuthPasswordFieldComponent,
    AuthRememberMeComponent,
    ButtonComponent,
    FormActionsComponent,
    ValidationSummaryComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  private readonly authentication = inject(AuthenticationService);
  private readonly rememberMe = inject(RememberMeService);
  private readonly authRedirect = inject(AuthRedirectService);
  private readonly route = inject(ActivatedRoute);

  readonly authRoutes = AUTH_ROUTE_SEGMENTS;
  readonly appRoutes = APP_ROUTES;

  private readonly intent = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => {
        const value = params.get('intent');
        return value === 'get-started' ? 'get-started' : 'signin';
      }),
    ),
    { initialValue: 'signin' as AuthEntryIntent },
  );

  readonly experience = computed(() => AUTH_ENTRY_EXPERIENCES[this.intent()]);

  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly validationIssues = signal<{ field: string; message: string }[]>([]);

  private lastSubmitAt = 0;

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(AUTH_VALIDATION.emailPattern)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(AUTH_VALIDATION.passwordMinLength)],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });

  ngOnInit(): void {
    const rememberedEmail = this.rememberMe.getRememberedEmail();
    if (rememberedEmail) {
      this.form.patchValue({ email: rememberedEmail, rememberMe: true });
    }
  }

  async onSubmit(): Promise<void> {
    this.submitError.set(null);
    this.validationIssues.set([]);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationIssues.set(
        collectValidationIssues(this.form, {
          email: 'Email',
          password: 'Password',
        }),
      );
      return;
    }

    if (Date.now() - this.lastSubmitAt < AUTH_CONFIG.preventDuplicateSubmitMs) {
      return;
    }

    this.lastSubmitAt = Date.now();
    this.submitting.set(true);

    try {
      const value = this.form.getRawValue();
      await this.authentication.signIn({
        email: value.email,
        password: value.password,
        rememberMe: value.rememberMe,
      });

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? undefined;
      await this.authRedirect.navigateAfterLogin(returnUrl ?? undefined);
    } catch (error) {
      this.submitError.set(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      this.submitting.set(false);
    }
  }
}
