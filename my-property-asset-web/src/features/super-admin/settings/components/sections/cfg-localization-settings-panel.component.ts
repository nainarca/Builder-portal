import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormSectionComponent } from '@shared/ui';

import { LanguageSetting, LocalizationSettings } from '../../models/settings-admin.model';
import { SettingsSectionStateService } from '../../services/settings-section-state.service';

@Component({
  selector: 'app-cfg-localization-settings-panel',
  imports: [FormSectionComponent],
  template: `
    @if (localization(); as model) {
      <div class="cfg-panel">
        <app-form-section
          title="Languages"
          description="Manage available languages, translation completion, and RTL readiness."
        >
          <div class="cfg-table-wrap">
            <table class="cfg-table">
              <thead>
                <tr>
                  <th scope="col">Language</th>
                  <th scope="col">Enabled</th>
                  <th scope="col">Completion</th>
                  <th scope="col">RTL</th>
                </tr>
              </thead>
              <tbody>
                @for (language of model.languages; track language.code) {
                  <tr>
                    <td>
                      <div class="cfg-lang">
                        <span class="cfg-lang__label">{{ language.label }}</span>
                        <span class="cfg-lang__code">{{ language.code }}</span>
                      </div>
                    </td>
                    <td>
                      <label class="cfg-toggle">
                        <input
                          type="checkbox"
                          class="cfg-toggle__input"
                          [checked]="language.enabled"
                          [attr.aria-label]="'Toggle ' + language.label"
                          (change)="toggleLanguage(language.code, checkedValue($event))"
                        />
                        <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
                      </label>
                    </td>
                    <td>
                      <div class="cfg-completion">
                        <div class="cfg-completion__bar">
                          <span
                            class="cfg-completion__fill"
                            [class.cfg-completion__fill--low]="language.completionPercent < 60"
                            [class.cfg-completion__fill--mid]="language.completionPercent >= 60 && language.completionPercent < 100"
                            [style.width.%]="language.completionPercent"
                          ></span>
                        </div>
                        <span class="cfg-completion__value">{{ language.completionPercent }}%</span>
                      </div>
                    </td>
                    <td>
                      @if (language.rtlReady) {
                        <span class="cfg-rtl-badge cfg-rtl-badge--ready">
                          <i class="pi pi-check" aria-hidden="true"></i> Ready
                        </span>
                      } @else {
                        <span class="cfg-rtl-badge cfg-rtl-badge--na">LTR</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </app-form-section>

        <app-form-section
          title="Locale defaults"
          description="Primary and fallback locales used when a translation is unavailable."
        >
          <div class="cfg-grid">
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-default-locale">Default locale</label>
              <select
                id="cfg-default-locale"
                class="cfg-field__input"
                [value]="model.defaultLocale"
                (change)="patch('defaultLocale', selectValue($event))"
              >
                @for (language of enabledLanguages(); track language.code) {
                  <option [value]="language.code">{{ language.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-fallback-locale">Fallback locale</label>
              <select
                id="cfg-fallback-locale"
                class="cfg-field__input"
                [value]="model.fallbackLocale"
                (change)="patch('fallbackLocale', selectValue($event))"
              >
                @for (language of enabledLanguages(); track language.code) {
                  <option [value]="language.code">{{ language.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-regional-formats">Regional formats</label>
              <input
                id="cfg-regional-formats"
                class="cfg-field__input"
                type="text"
                [value]="model.regionalFormats"
                (input)="patch('regionalFormats', inputValue($event))"
              />
            </div>
          </div>
        </app-form-section>

        <app-form-section
          title="Right-to-left support"
          description="Enable RTL layout handling for languages that require it."
        >
          <label class="cfg-toggle-row">
            <span class="cfg-toggle-row__text">
              <strong>Enable RTL support</strong>
              <small>{{ rtlReadyCount() }} language(s) are RTL-ready.</small>
            </span>
            <span class="cfg-toggle">
              <input
                type="checkbox"
                class="cfg-toggle__input"
                [checked]="model.rtlSupportEnabled"
                (change)="patch('rtlSupportEnabled', checkedValue($event))"
              />
              <span class="cfg-toggle__track" aria-hidden="true"><span class="cfg-toggle__thumb"></span></span>
            </span>
          </label>
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
    .cfg-table-wrap {
      margin-top: 0.75rem;
      overflow-x: auto;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .cfg-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }
    .cfg-table th,
    .cfg-table td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--mpa-color-border);
      vertical-align: middle;
    }
    .cfg-table th {
      font-weight: 600;
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 6%, transparent);
    }
    .cfg-table tbody tr:last-child td {
      border-bottom: none;
    }
    .cfg-lang {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .cfg-lang__label {
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-lang__code {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
    }
    .cfg-completion {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      min-width: 8rem;
    }
    .cfg-completion__bar {
      flex: 1;
      height: 0.45rem;
      border-radius: 999px;
      background: var(--mpa-color-border);
      overflow: hidden;
    }
    .cfg-completion__fill {
      display: block;
      height: 100%;
      border-radius: 999px;
      background: var(--mpa-color-success, #16a34a);
    }
    .cfg-completion__fill--mid {
      background: var(--mpa-color-primary);
    }
    .cfg-completion__fill--low {
      background: var(--mpa-color-warning, #d97706);
    }
    .cfg-completion__value {
      font-weight: 600;
      color: var(--mpa-color-text);
      min-width: 2.5rem;
      text-align: right;
    }
    .cfg-rtl-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
    }
    .cfg-rtl-badge--ready {
      color: var(--mpa-color-success, #16a34a);
      background: color-mix(in srgb, var(--mpa-color-success, #16a34a) 14%, transparent);
    }
    .cfg-rtl-badge--na {
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 12%, transparent);
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
    .cfg-field__input:focus {
      outline: none;
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mpa-color-primary) 18%, transparent);
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
export class CfgLocalizationSettingsPanelComponent {
  private readonly state = inject(SettingsSectionStateService);

  readonly localization = computed<LocalizationSettings | null>(
    () => this.state.draft()?.localization ?? null,
  );

  readonly enabledLanguages = computed<LanguageSetting[]>(
    () => this.localization()?.languages.filter((language) => language.enabled) ?? [],
  );

  readonly rtlReadyCount = computed(
    () => this.localization()?.languages.filter((language) => language.rtlReady).length ?? 0,
  );

  patch<K extends keyof LocalizationSettings>(key: K, value: LocalizationSettings[K]): void {
    const current = this.localization();
    if (!current) return;
    this.state.patchDraft('localization', { ...current, [key]: value });
  }

  toggleLanguage(code: string, enabled: boolean): void {
    const current = this.localization();
    if (!current) return;
    const languages = current.languages.map((language) =>
      language.code === code ? { ...language, enabled } : language,
    );
    this.state.patchDraft('localization', { ...current, languages });
  }

  inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  checkedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
