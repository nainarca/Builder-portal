import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormSectionComponent } from '@shared/ui';

import { GeneralSettings } from '../../models/settings-admin.model';
import { SettingsSectionStateService } from '../../services/settings-section-state.service';

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-cfg-general-settings-panel',
  imports: [FormSectionComponent],
  template: `
    @if (general(); as model) {
      <div class="cfg-panel">
        <app-form-section
          title="Platform identity"
          description="Public-facing name, tagline, and support contact for the platform."
        >
          <div class="cfg-grid">
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-platform-name">Platform name</label>
              <input
                id="cfg-platform-name"
                class="cfg-field__input"
                type="text"
                [value]="model.platformName"
                (input)="patch('platformName', inputValue($event))"
              />
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-platform-tagline">Tagline</label>
              <input
                id="cfg-platform-tagline"
                class="cfg-field__input"
                type="text"
                [value]="model.platformTagline"
                (input)="patch('platformTagline', inputValue($event))"
              />
            </div>
            <div class="cfg-field cfg-field--full">
              <label class="cfg-field__label" for="cfg-support-email">Support email</label>
              <input
                id="cfg-support-email"
                class="cfg-field__input"
                type="email"
                autocomplete="email"
                [value]="model.supportEmail"
                (input)="patch('supportEmail', inputValue($event))"
              />
            </div>
          </div>
        </app-form-section>

        <app-form-section
          title="Regional defaults"
          description="Defaults applied to new tenants and users unless overridden."
        >
          <div class="cfg-grid">
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-language">Default language</label>
              <select
                id="cfg-language"
                class="cfg-field__input"
                [value]="model.defaultLanguage"
                (change)="patch('defaultLanguage', selectValue($event))"
              >
                @for (option of languageOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-timezone">Default timezone</label>
              <select
                id="cfg-timezone"
                class="cfg-field__input"
                [value]="model.defaultTimezone"
                (change)="patch('defaultTimezone', selectValue($event))"
              >
                @for (option of timezoneOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-currency">Default currency</label>
              <select
                id="cfg-currency"
                class="cfg-field__input"
                [value]="model.defaultCurrency"
                (change)="patch('defaultCurrency', selectValue($event))"
              >
                @for (option of currencyOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
          </div>
        </app-form-section>

        <app-form-section
          title="Display formats"
          description="How dates, times, and numbers are formatted across the platform."
        >
          <div class="cfg-grid">
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-date-format">Date format</label>
              <select
                id="cfg-date-format"
                class="cfg-field__input"
                [value]="model.dateFormat"
                (change)="patch('dateFormat', selectValue($event))"
              >
                @for (option of dateFormatOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-time-format">Time format</label>
              <select
                id="cfg-time-format"
                class="cfg-field__input"
                [value]="model.timeFormat"
                (change)="patch('timeFormat', selectValue($event))"
              >
                @for (option of timeFormatOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-number-format">Number format</label>
              <select
                id="cfg-number-format"
                class="cfg-field__input"
                [value]="model.numberFormat"
                (change)="patch('numberFormat', selectValue($event))"
              >
                @for (option of numberFormatOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
          </div>
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
    .cfg-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
      gap: 1rem;
      margin-top: 0.75rem;
    }
    .cfg-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .cfg-field--full {
      grid-column: 1 / -1;
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
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .cfg-field__input:focus {
      outline: none;
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mpa-color-primary) 18%, transparent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgGeneralSettingsPanelComponent {
  private readonly state = inject(SettingsSectionStateService);

  readonly general = computed<GeneralSettings | null>(() => this.state.draft()?.general ?? null);

  readonly languageOptions: readonly SelectOption[] = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'hi-IN', label: 'Hindi (India)' },
    { value: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
    { value: 'fr-FR', label: 'French (France)' },
  ];

  readonly timezoneOptions: readonly SelectOption[] = [
    { value: 'Asia/Kolkata', label: '(GMT+5:30) India Standard Time' },
    { value: 'UTC', label: '(GMT+0:00) Coordinated Universal Time' },
    { value: 'Europe/London', label: '(GMT+0:00) London' },
    { value: 'America/New_York', label: '(GMT-5:00) Eastern Time' },
    { value: 'Asia/Dubai', label: '(GMT+4:00) Gulf Standard Time' },
    { value: 'Asia/Singapore', label: '(GMT+8:00) Singapore Time' },
  ];

  readonly currencyOptions: readonly SelectOption[] = [
    { value: 'INR', label: 'Indian Rupee (INR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'AED', label: 'UAE Dirham (AED)' },
    { value: 'SGD', label: 'Singapore Dollar (SGD)' },
  ];

  readonly dateFormatOptions: readonly SelectOption[] = [
    { value: 'dd MMM yyyy', label: '31 Dec 2026' },
    { value: 'dd/MM/yyyy', label: '31/12/2026' },
    { value: 'MM/dd/yyyy', label: '12/31/2026' },
    { value: 'yyyy-MM-dd', label: '2026-12-31' },
  ];

  readonly timeFormatOptions: readonly SelectOption[] = [
    { value: 'HH:mm', label: '24-hour (14:30)' },
    { value: 'hh:mm a', label: '12-hour (02:30 PM)' },
  ];

  readonly numberFormatOptions: readonly SelectOption[] = [
    { value: 'en-IN', label: 'Indian (12,34,567.89)' },
    { value: 'en-US', label: 'US / International (1,234,567.89)' },
    { value: 'de-DE', label: 'European (1.234.567,89)' },
  ];

  patch<K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]): void {
    const current = this.state.draft()?.general;
    if (!current) return;
    this.state.patchDraft('general', { ...current, [key]: value });
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
