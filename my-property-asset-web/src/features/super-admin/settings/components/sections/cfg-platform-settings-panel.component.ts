import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormSectionComponent } from '@shared/ui';
import { ApplicationConfigurationService } from '@infrastructure/config/services/application-configuration.service';

import {
  FeatureFlagSetting,
  PlatformMessageSetting,
  PlatformSettings,
} from '../../models/settings-admin.model';
import { SettingsSectionStateService } from '../../services/settings-section-state.service';
import { CfgConfigurationBadgeComponent } from '../shared/cfg-configuration-badge.component';
import { CfgFeatureFlagCardComponent } from '../shared/cfg-feature-flag-card.component';

@Component({
  selector: 'app-cfg-platform-settings-panel',
  imports: [FormSectionComponent, CfgConfigurationBadgeComponent, CfgFeatureFlagCardComponent],
  template: `
    @if (platform(); as model) {
      <div class="cfg-panel">
        <app-form-section
          title="Configuration status"
          description="Overall health of the platform configuration."
        >
          <div class="cfg-status-row">
            <app-cfg-configuration-badge [status]="model.configurationStatus" />
            <span class="cfg-status-row__hint">
              {{ enabledFlagCount() }} of {{ model.featureFlags.length }} feature flags enabled
            </span>
          </div>
        </app-form-section>

        <app-form-section
          title="Maintenance mode"
          description="Temporarily take the platform offline for all non-admin users."
        >
          <label class="cfg-toggle-row">
            <span class="cfg-toggle-row__text">
              <strong>Enable maintenance mode</strong>
              <small>Users see a maintenance banner while enabled.</small>
            </span>
            <span class="cfg-toggle">
              <input
                type="checkbox"
                class="cfg-toggle__input"
                [checked]="model.maintenanceMode"
                (change)="patch('maintenanceMode', checkedValue($event))"
              />
              <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
            </span>
          </label>
          <div class="cfg-field cfg-field--stacked">
            <label class="cfg-field__label" for="cfg-maintenance-message">Maintenance message</label>
            <textarea
              id="cfg-maintenance-message"
              class="cfg-field__input cfg-field__textarea"
              rows="3"
              [value]="model.maintenanceMessage"
              (input)="patch('maintenanceMessage', inputValue($event))"
            ></textarea>
          </div>
        </app-form-section>

        <app-form-section
          title="Feature flags"
          description="Enable or disable platform capabilities per environment."
        >
          <div class="cfg-flag-list">
            @for (flag of model.featureFlags; track flag.id) {
              <app-cfg-feature-flag-card [flag]="flag" (toggled)="toggleFlag(flag.id, $event)" />
            }
          </div>
        </app-form-section>

        <app-form-section
          title="Platform messages"
          description="Broadcast banners shown across the platform."
        >
          <div class="cfg-message-list">
            @for (message of model.platformMessages; track message.id) {
              <div class="cfg-message" [class]="'cfg-message--' + message.severity">
                <div class="cfg-message__body">
                  <div class="cfg-message__title-row">
                    <span class="cfg-message__severity">{{ message.severity }}</span>
                    <span class="cfg-message__title">{{ message.title }}</span>
                  </div>
                  <p class="cfg-message__text">{{ message.message }}</p>
                </div>
                <label class="cfg-toggle">
                  <input
                    type="checkbox"
                    class="cfg-toggle__input"
                    [checked]="message.active"
                    [attr.aria-label]="'Toggle ' + message.title"
                    (change)="toggleMessage(message.id, checkedValue($event))"
                  />
                  <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                </label>
              </div>
            }
          </div>
        </app-form-section>

        <app-form-section
          title="Environment summary"
          description="Read-only runtime configuration resolved at startup."
        >
          <dl class="cfg-env">
            <div class="cfg-env__row">
              <dt>Application title</dt>
              <dd>{{ appConfig.appTitle() }}</dd>
            </div>
            <div class="cfg-env__row">
              <dt>Application version</dt>
              <dd>{{ appConfig.appVersion() }}</dd>
            </div>
            <div class="cfg-env__row">
              <dt>API base URL</dt>
              <dd class="cfg-env__mono">{{ appConfig.apiBaseUrl() }}</dd>
            </div>
            <div class="cfg-env__row">
              <dt>Runtime config</dt>
              <dd>
                <span
                  class="cfg-env__pill"
                  [class.cfg-env__pill--on]="appConfig.isRuntimeLoaded()"
                >
                  {{ appConfig.isRuntimeLoaded() ? 'Loaded' : 'Defaults' }}
                </span>
              </dd>
            </div>
          </dl>
        </app-form-section>
      </div>
    }
  `,
  styles: `
    .cfg-panel {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .cfg-status-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }
    .cfg-status-row__hint {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 0.75rem;
      cursor: pointer;
    }
    .cfg-toggle-row__text {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .cfg-toggle-row__text strong {
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .cfg-toggle-row__text small {
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-xs, 0.75rem);
    }
    .cfg-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .cfg-field--stacked {
      margin-top: 1rem;
    }
    .cfg-field__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-field__input {
      width: 100%;
      padding: 0.55rem 0.75rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
    }
    .cfg-field__textarea {
      resize: vertical;
      font-family: inherit;
    }
    .cfg-field__input:focus {
      outline: none;
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mpa-color-primary) 18%, transparent);
    }
    .cfg-flag-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    .cfg-message-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    .cfg-message {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.9rem 1.1rem;
      border: 1px solid var(--mpa-color-border);
      border-left-width: 4px;
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: var(--mpa-color-surface);
    }
    .cfg-message--info {
      border-left-color: var(--mpa-color-primary);
    }
    .cfg-message--warning {
      border-left-color: var(--mpa-color-warning, #d97706);
    }
    .cfg-message--critical {
      border-left-color: var(--mpa-color-danger, #dc2626);
    }
    .cfg-message__title-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .cfg-message__severity {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-weight: 700;
      color: var(--mpa-color-text-muted);
    }
    .cfg-message__title {
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-message__text {
      margin: 0.2rem 0 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-env {
      margin: 0.75rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .cfg-env__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.6rem 0;
      border-bottom: 1px solid var(--mpa-color-border);
    }
    .cfg-env__row:last-child {
      border-bottom: none;
    }
    .cfg-env dt {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-env dd {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--mpa-color-text);
      text-align: right;
      word-break: break-all;
    }
    .cfg-env__mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-weight: 500 !important;
    }
    .cfg-env__pill {
      display: inline-flex;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 14%, transparent);
    }
    .cfg-env__pill--on {
      color: var(--mpa-color-success, #16a34a);
      background: color-mix(in srgb, var(--mpa-color-success, #16a34a) 14%, transparent);
    }
    .cfg-toggle {
      position: relative;
      display: inline-flex;
      flex: none;
      cursor: pointer;
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgPlatformSettingsPanelComponent {
  private readonly state = inject(SettingsSectionStateService);
  readonly appConfig = inject(ApplicationConfigurationService);

  readonly platform = computed<PlatformSettings | null>(() => this.state.draft()?.platform ?? null);

  readonly enabledFlagCount = computed(
    () => this.platform()?.featureFlags.filter((flag) => flag.enabled).length ?? 0,
  );

  patch<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]): void {
    const current = this.platform();
    if (!current) return;
    this.state.patchDraft('platform', { ...current, [key]: value });
  }

  toggleFlag(id: string, enabled: boolean): void {
    const current = this.platform();
    if (!current) return;
    const featureFlags: FeatureFlagSetting[] = current.featureFlags.map((flag) =>
      flag.id === id ? { ...flag, enabled } : flag,
    );
    this.state.patchDraft('platform', { ...current, featureFlags });
  }

  toggleMessage(id: string, active: boolean): void {
    const current = this.platform();
    if (!current) return;
    const platformMessages: PlatformMessageSetting[] = current.platformMessages.map((message) =>
      message.id === id ? { ...message, active } : message,
    );
    this.state.patchDraft('platform', { ...current, platformMessages });
  }

  inputValue(event: Event): string {
    return (event.target as HTMLTextAreaElement).value;
  }

  checkedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
