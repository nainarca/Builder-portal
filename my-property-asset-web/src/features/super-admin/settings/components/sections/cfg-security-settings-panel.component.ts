import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormSectionComponent } from '@shared/ui';

import {
  AuthenticationPolicySettings,
  LoginRestrictionSettings,
  PasswordPolicySettings,
  SecuritySettings,
  SessionPolicySettings,
} from '../../models/settings-admin.model';
import { SettingsSectionStateService } from '../../services/settings-section-state.service';
import { CfgPreviewPanelComponent } from '../shared/cfg-preview-panel.component';

interface SecurityOverview {
  readonly strengthLabel: string;
  readonly strengthPercent: number;
  readonly complexityRules: number;
  readonly mfa: boolean;
  readonly idleTimeout: number;
  readonly lockout: string;
}

@Component({
  selector: 'app-cfg-security-settings-panel',
  imports: [FormSectionComponent, CfgPreviewPanelComponent],
  template: `
    @if (security(); as model) {
      <div class="cfg-panel">
        <div class="cfg-panel__main">
          <app-form-section
            title="Password policy"
            description="Complexity and rotation requirements for account passwords."
          >
            <div class="cfg-stack">
              <div class="cfg-slider">
                <div class="cfg-slider__header">
                  <label class="cfg-field__label" for="cfg-pw-length">Minimum length</label>
                  <span class="cfg-slider__value">{{ model.passwordPolicy.minLength }} chars</span>
                </div>
                <input
                  id="cfg-pw-length"
                  type="range"
                  class="cfg-slider__input"
                  min="6"
                  max="32"
                  step="1"
                  [value]="model.passwordPolicy.minLength"
                  (input)="patchPassword('minLength', numberValue($event))"
                />
              </div>
              <div class="cfg-slider">
                <div class="cfg-slider__header">
                  <label class="cfg-field__label" for="cfg-pw-expiry">Password expiry</label>
                  <span class="cfg-slider__value">
                    {{ model.passwordPolicy.expiryDays === 0 ? 'Never' : model.passwordPolicy.expiryDays + ' days' }}
                  </span>
                </div>
                <input
                  id="cfg-pw-expiry"
                  type="range"
                  class="cfg-slider__input"
                  min="0"
                  max="365"
                  step="15"
                  [value]="model.passwordPolicy.expiryDays"
                  (input)="patchPassword('expiryDays', numberValue($event))"
                />
              </div>
              <div class="cfg-toggle-list">
                <label class="cfg-toggle-row">
                  <span class="cfg-toggle-row__text">Require uppercase letters</span>
                  <span class="cfg-toggle">
                    <input
                      type="checkbox"
                      class="cfg-toggle__input"
                      [checked]="model.passwordPolicy.requireUppercase"
                      (change)="patchPassword('requireUppercase', checkedValue($event))"
                    />
                    <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                  </span>
                </label>
                <label class="cfg-toggle-row">
                  <span class="cfg-toggle-row__text">Require lowercase letters</span>
                  <span class="cfg-toggle">
                    <input
                      type="checkbox"
                      class="cfg-toggle__input"
                      [checked]="model.passwordPolicy.requireLowercase"
                      (change)="patchPassword('requireLowercase', checkedValue($event))"
                    />
                    <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                  </span>
                </label>
                <label class="cfg-toggle-row">
                  <span class="cfg-toggle-row__text">Require numbers</span>
                  <span class="cfg-toggle">
                    <input
                      type="checkbox"
                      class="cfg-toggle__input"
                      [checked]="model.passwordPolicy.requireNumbers"
                      (change)="patchPassword('requireNumbers', checkedValue($event))"
                    />
                    <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                  </span>
                </label>
                <label class="cfg-toggle-row">
                  <span class="cfg-toggle-row__text">Require symbols</span>
                  <span class="cfg-toggle">
                    <input
                      type="checkbox"
                      class="cfg-toggle__input"
                      [checked]="model.passwordPolicy.requireSymbols"
                      (change)="patchPassword('requireSymbols', checkedValue($event))"
                    />
                    <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                  </span>
                </label>
              </div>
            </div>
          </app-form-section>

          <app-form-section
            title="Session policy"
            description="How long sessions remain active before re-authentication is required."
          >
            <div class="cfg-stack">
              <div class="cfg-slider">
                <div class="cfg-slider__header">
                  <label class="cfg-field__label" for="cfg-idle">Idle timeout</label>
                  <span class="cfg-slider__value">{{ model.sessionPolicy.idleTimeoutMinutes }} min</span>
                </div>
                <input
                  id="cfg-idle"
                  type="range"
                  class="cfg-slider__input"
                  min="5"
                  max="120"
                  step="5"
                  [value]="model.sessionPolicy.idleTimeoutMinutes"
                  (input)="patchSession('idleTimeoutMinutes', numberValue($event))"
                />
              </div>
              <div class="cfg-slider">
                <div class="cfg-slider__header">
                  <label class="cfg-field__label" for="cfg-absolute">Absolute timeout</label>
                  <span class="cfg-slider__value">{{ model.sessionPolicy.absoluteTimeoutHours }} h</span>
                </div>
                <input
                  id="cfg-absolute"
                  type="range"
                  class="cfg-slider__input"
                  min="1"
                  max="48"
                  step="1"
                  [value]="model.sessionPolicy.absoluteTimeoutHours"
                  (input)="patchSession('absoluteTimeoutHours', numberValue($event))"
                />
              </div>
              <div class="cfg-slider">
                <div class="cfg-slider__header">
                  <label class="cfg-field__label" for="cfg-remember">Remember me duration</label>
                  <span class="cfg-slider__value">{{ model.sessionPolicy.rememberMeDays }} days</span>
                </div>
                <input
                  id="cfg-remember"
                  type="range"
                  class="cfg-slider__input"
                  min="0"
                  max="90"
                  step="1"
                  [value]="model.sessionPolicy.rememberMeDays"
                  (input)="patchSession('rememberMeDays', numberValue($event))"
                />
              </div>
              <label class="cfg-toggle-row">
                <span class="cfg-toggle-row__text">Single session only (sign out other devices)</span>
                <span class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="model.sessionPolicy.singleSessionOnly"
                    (change)="patchSession('singleSessionOnly', checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </span>
              </label>
            </div>
          </app-form-section>

          <app-form-section
            title="Authentication"
            description="Multi-factor and federated sign-in options."
          >
            <div class="cfg-toggle-list">
              <label class="cfg-toggle-row">
                <span class="cfg-toggle-row__text">Require multi-factor authentication (MFA)</span>
                <span class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="model.authenticationPolicy.mfaRequired"
                    (change)="patchAuth('mfaRequired', checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </span>
              </label>
              <label class="cfg-toggle-row">
                <span class="cfg-toggle-row__text">Enable single sign-on (SSO)</span>
                <span class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="model.authenticationPolicy.ssoEnabled"
                    (change)="patchAuth('ssoEnabled', checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </span>
              </label>
              <label class="cfg-toggle-row">
                <span class="cfg-toggle-row__text">Allow social login</span>
                <span class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="model.authenticationPolicy.socialLoginEnabled"
                    (change)="patchAuth('socialLoginEnabled', checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </span>
              </label>
              <label class="cfg-toggle-row">
                <span class="cfg-toggle-row__text">Allow passwordless sign-in</span>
                <span class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="model.authenticationPolicy.passwordlessEnabled"
                    (change)="patchAuth('passwordlessEnabled', checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </span>
              </label>
            </div>
          </app-form-section>

          <app-form-section
            title="Login restrictions"
            description="Lockout thresholds and network-based access controls."
          >
            <div class="cfg-stack">
              <div class="cfg-slider">
                <div class="cfg-slider__header">
                  <label class="cfg-field__label" for="cfg-attempts">Max failed attempts</label>
                  <span class="cfg-slider__value">{{ model.loginRestrictions.maxFailedAttempts }}</span>
                </div>
                <input
                  id="cfg-attempts"
                  type="range"
                  class="cfg-slider__input"
                  min="3"
                  max="10"
                  step="1"
                  [value]="model.loginRestrictions.maxFailedAttempts"
                  (input)="patchLogin('maxFailedAttempts', numberValue($event))"
                />
              </div>
              <div class="cfg-slider">
                <div class="cfg-slider__header">
                  <label class="cfg-field__label" for="cfg-lockout">Lockout duration</label>
                  <span class="cfg-slider__value">{{ model.loginRestrictions.lockoutMinutes }} min</span>
                </div>
                <input
                  id="cfg-lockout"
                  type="range"
                  class="cfg-slider__input"
                  min="5"
                  max="60"
                  step="5"
                  [value]="model.loginRestrictions.lockoutMinutes"
                  (input)="patchLogin('lockoutMinutes', numberValue($event))"
                />
              </div>
              <label class="cfg-toggle-row">
                <span class="cfg-toggle-row__text">Enable IP allowlist</span>
                <span class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="model.loginRestrictions.ipAllowlistEnabled"
                    (change)="patchLogin('ipAllowlistEnabled', checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </span>
              </label>
              <label class="cfg-toggle-row">
                <span class="cfg-toggle-row__text">Enable geographic restrictions</span>
                <span class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="model.loginRestrictions.geoRestrictionEnabled"
                    (change)="patchLogin('geoRestrictionEnabled', checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </span>
              </label>
            </div>
          </app-form-section>
        </div>

        <div class="cfg-panel__aside">
          <app-cfg-preview-panel
            title="Security overview"
            subtitle="Live summary of the current policy draft"
            icon="pi pi-shield"
          >
            <div class="cfg-overview">
              <div class="cfg-overview__strength">
                <div class="cfg-overview__strength-head">
                  <span>Policy strength</span>
                  <strong>{{ overview().strengthLabel }}</strong>
                </div>
                <div class="cfg-overview__bar" role="presentation">
                  <span class="cfg-overview__bar-fill" [style.width.%]="overview().strengthPercent"></span>
                </div>
              </div>
              <ul class="cfg-overview__list">
                <li>
                  <span>Complexity rules</span>
                  <strong>{{ overview().complexityRules }} / 4 active</strong>
                </li>
                <li>
                  <span>Multi-factor auth</span>
                  <strong [class.cfg-overview__ok]="overview().mfa" [class.cfg-overview__warn]="!overview().mfa">
                    {{ overview().mfa ? 'Required' : 'Optional' }}
                  </strong>
                </li>
                <li>
                  <span>Idle timeout</span>
                  <strong>{{ overview().idleTimeout }} min</strong>
                </li>
                <li>
                  <span>Account lockout</span>
                  <strong>{{ overview().lockout }}</strong>
                </li>
              </ul>
            </div>
          </app-cfg-preview-panel>
        </div>
      </div>
    }
  `,
  styles: `
    .cfg-panel {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 20rem;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 60rem) {
      .cfg-panel {
        grid-template-columns: 1fr;
      }
    }
    .cfg-panel__main {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      min-width: 0;
    }
    .cfg-panel__aside {
      position: sticky;
      top: 1rem;
    }
    .cfg-stack {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      margin-top: 0.75rem;
    }
    .cfg-field__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-slider__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.35rem;
    }
    .cfg-slider__value {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--mpa-color-primary);
    }
    .cfg-slider__input {
      width: 100%;
      accent-color: var(--mpa-color-primary);
    }
    .cfg-toggle-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.75rem;
    }
    .cfg-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.65rem 0;
      border-bottom: 1px solid var(--mpa-color-border);
      cursor: pointer;
    }
    .cfg-toggle-row:last-child {
      border-bottom: none;
    }
    .cfg-toggle-row__text {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }
    .cfg-toggle {
      position: relative;
      display: inline-flex;
      flex: none;
    }
    .cfg-toggle__input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
    }
    .cfg-toggle__track {
      display: inline-flex;
      align-items: center;
      width: 2.6rem;
      height: 1.5rem;
      padding: 0.15rem;
      border-radius: 999px;
      background: var(--mpa-color-border);
      transition: background 0.15s ease;
    }
    .cfg-toggle__thumb {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform 0.15s ease;
    }
    .cfg-toggle__input:checked + .cfg-toggle__track {
      background: var(--mpa-color-primary);
    }
    .cfg-toggle__input:checked + .cfg-toggle__track .cfg-toggle__thumb {
      transform: translateX(1.1rem);
    }
    .cfg-toggle__input:focus-visible + .cfg-toggle__track {
      outline: 2px solid var(--mpa-color-primary);
      outline-offset: 2px;
    }
    .cfg-overview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .cfg-overview__strength-head {
      display: flex;
      justify-content: space-between;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      margin-bottom: 0.4rem;
      color: var(--mpa-color-text-muted);
    }
    .cfg-overview__strength-head strong {
      color: var(--mpa-color-text);
    }
    .cfg-overview__bar {
      width: 100%;
      height: 0.5rem;
      border-radius: 999px;
      background: var(--mpa-color-border);
      overflow: hidden;
    }
    .cfg-overview__bar-fill {
      display: block;
      height: 100%;
      border-radius: 999px;
      background: var(--mpa-color-primary);
      transition: width 0.25s ease;
    }
    .cfg-overview__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .cfg-overview__list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--mpa-color-border);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-overview__list li:last-child {
      border-bottom: none;
    }
    .cfg-overview__list strong {
      color: var(--mpa-color-text);
    }
    .cfg-overview__ok {
      color: var(--mpa-color-success, #16a34a) !important;
    }
    .cfg-overview__warn {
      color: var(--mpa-color-warning, #d97706) !important;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSecuritySettingsPanelComponent {
  private readonly state = inject(SettingsSectionStateService);

  readonly security = computed<SecuritySettings | null>(() => this.state.draft()?.security ?? null);

  readonly overview = computed<SecurityOverview>(() => {
    const model = this.security();
    if (!model) {
      return { strengthLabel: 'Unknown', strengthPercent: 0, complexityRules: 0, mfa: false, idleTimeout: 0, lockout: 'n/a' };
    }
    const pw = model.passwordPolicy;
    const complexityRules =
      Number(pw.requireUppercase) +
      Number(pw.requireLowercase) +
      Number(pw.requireNumbers) +
      Number(pw.requireSymbols);

    let score = 0;
    score += Math.min(35, (pw.minLength / 32) * 35);
    score += complexityRules * 8;
    score += model.authenticationPolicy.mfaRequired ? 18 : 0;
    score += pw.expiryDays > 0 && pw.expiryDays <= 180 ? 8 : 0;
    score += model.loginRestrictions.maxFailedAttempts <= 5 ? 7 : 0;
    const strengthPercent = Math.max(0, Math.min(100, Math.round(score)));

    let strengthLabel = 'Weak';
    if (strengthPercent >= 80) strengthLabel = 'Strong';
    else if (strengthPercent >= 55) strengthLabel = 'Moderate';

    return {
      strengthLabel,
      strengthPercent,
      complexityRules,
      mfa: model.authenticationPolicy.mfaRequired,
      idleTimeout: model.sessionPolicy.idleTimeoutMinutes,
      lockout: `${model.loginRestrictions.maxFailedAttempts} tries · ${model.loginRestrictions.lockoutMinutes} min`,
    };
  });

  patchPassword<K extends keyof PasswordPolicySettings>(key: K, value: PasswordPolicySettings[K]): void {
    const current = this.security();
    if (!current) return;
    this.state.patchDraft('security', {
      ...current,
      passwordPolicy: { ...current.passwordPolicy, [key]: value },
    });
  }

  patchSession<K extends keyof SessionPolicySettings>(key: K, value: SessionPolicySettings[K]): void {
    const current = this.security();
    if (!current) return;
    this.state.patchDraft('security', {
      ...current,
      sessionPolicy: { ...current.sessionPolicy, [key]: value },
    });
  }

  patchAuth<K extends keyof AuthenticationPolicySettings>(key: K, value: AuthenticationPolicySettings[K]): void {
    const current = this.security();
    if (!current) return;
    this.state.patchDraft('security', {
      ...current,
      authenticationPolicy: { ...current.authenticationPolicy, [key]: value },
    });
  }

  patchLogin<K extends keyof LoginRestrictionSettings>(key: K, value: LoginRestrictionSettings[K]): void {
    const current = this.security();
    if (!current) return;
    this.state.patchDraft('security', {
      ...current,
      loginRestrictions: { ...current.loginRestrictions, [key]: value },
    });
  }

  numberValue(event: Event): number {
    return Number((event.target as HTMLInputElement).value);
  }

  checkedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
