import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { FormSectionComponent } from '@shared/ui';

import { SystemPreferences } from '../../models/settings-admin.model';
import { SettingsSectionStateService } from '../../services/settings-section-state.service';

interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface ThemeOption {
  readonly value: SystemPreferences['defaultTheme'];
  readonly label: string;
  readonly icon: string;
}

interface DensityOption {
  readonly value: SystemPreferences['navigationDensity'];
  readonly label: string;
  readonly icon: string;
}

@Component({
  selector: 'app-cfg-system-preferences-panel',
  imports: [FormSectionComponent],
  template: `
    @if (preferences(); as model) {
      <div class="cfg-panel">
        <app-form-section
          title="Appearance"
          description="Default theme applied to new users."
        >
          <div class="cfg-segmented" role="radiogroup" aria-label="Default theme">
            @for (option of themeOptions; track option.value) {
              <button
                type="button"
                class="cfg-segmented__option"
                role="radio"
                [attr.aria-checked]="model.defaultTheme === option.value"
                [class.cfg-segmented__option--active]="model.defaultTheme === option.value"
                (click)="patch('defaultTheme', option.value)"
              >
                <i [class]="option.icon" aria-hidden="true"></i>
                <span>{{ option.label }}</span>
              </button>
            }
          </div>
        </app-form-section>

        <app-form-section
          title="Layout defaults"
          description="Default dashboard, landing destination, and starting module."
        >
          <div class="cfg-grid">
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-dashboard-layout">Dashboard layout</label>
              <select
                id="cfg-dashboard-layout"
                class="cfg-field__input"
                [value]="model.defaultDashboardLayout"
                (change)="patch('defaultDashboardLayout', selectValue($event))"
              >
                @for (option of dashboardLayoutOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-landing-page">Landing page</label>
              <select
                id="cfg-landing-page"
                class="cfg-field__input"
                [value]="model.defaultLandingPage"
                (change)="patch('defaultLandingPage', selectValue($event))"
              >
                @for (option of landingPageOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
            <div class="cfg-field">
              <label class="cfg-field__label" for="cfg-module">Default module</label>
              <select
                id="cfg-module"
                class="cfg-field__input"
                [value]="model.defaultModule"
                (change)="patch('defaultModule', selectValue($event))"
              >
                @for (option of moduleOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
          </div>
        </app-form-section>

        <app-form-section
          title="Navigation"
          description="Density and default state of the primary navigation."
        >
          <div class="cfg-field cfg-field--stacked">
            <span class="cfg-field__label">Navigation density</span>
            <div class="cfg-segmented" role="radiogroup" aria-label="Navigation density">
              @for (option of densityOptions; track option.value) {
                <button
                  type="button"
                  class="cfg-segmented__option"
                  role="radio"
                  [attr.aria-checked]="model.navigationDensity === option.value"
                  [class.cfg-segmented__option--active]="model.navigationDensity === option.value"
                  (click)="patch('navigationDensity', option.value)"
                >
                  <i [class]="option.icon" aria-hidden="true"></i>
                  <span>{{ option.label }}</span>
                </button>
              }
            </div>
          </div>

          <label class="cfg-toggle-row">
            <span class="cfg-toggle-row__text">
              <strong>Collapse sidebar by default</strong>
              <small>Start users with a compact, icon-only sidebar.</small>
            </span>
            <span class="cfg-toggle">
              <input
                type="checkbox"
                class="cfg-toggle__input"
                [checked]="model.sidebarCollapsed"
                (change)="patch('sidebarCollapsed', checkedValue($event))"
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
    .cfg-segmented {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.75rem;
      padding: 0.3rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 5%, transparent);
    }
    .cfg-segmented__option {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: transparent;
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .cfg-segmented__option:hover {
      color: var(--mpa-color-text);
    }
    .cfg-segmented__option--active {
      background: var(--mpa-color-surface);
      color: var(--mpa-color-primary);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
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
    .cfg-field--stacked {
      margin-bottom: 0.5rem;
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
      margin-top: 1rem;
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
export class CfgSystemPreferencesPanelComponent {
  private readonly state = inject(SettingsSectionStateService);

  readonly preferences = computed<SystemPreferences | null>(
    () => this.state.draft()?.preferences ?? null,
  );

  readonly themeOptions: readonly ThemeOption[] = [
    { value: 'light', label: 'Light', icon: 'pi pi-sun' },
    { value: 'dark', label: 'Dark', icon: 'pi pi-moon' },
    { value: 'system', label: 'System', icon: 'pi pi-desktop' },
  ];

  readonly densityOptions: readonly DensityOption[] = [
    { value: 'comfortable', label: 'Comfortable', icon: 'pi pi-bars' },
    { value: 'compact', label: 'Compact', icon: 'pi pi-align-justify' },
  ];

  readonly dashboardLayoutOptions: readonly SelectOption[] = [
    { value: 'executive', label: 'Executive summary' },
    { value: 'operational', label: 'Operational' },
    { value: 'analytics', label: 'Analytics-focused' },
    { value: 'minimal', label: 'Minimal' },
  ];

  readonly landingPageOptions: readonly SelectOption[] = [
    { value: '/super-admin', label: 'Super Admin home' },
    { value: '/super-admin/settings', label: 'Platform settings' },
    { value: '/super-admin/dashboard', label: 'Dashboard' },
    { value: '/super-admin/organizations', label: 'Organizations' },
  ];

  readonly moduleOptions: readonly SelectOption[] = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'assets', label: 'Assets' },
    { value: 'organizations', label: 'Organizations' },
    { value: 'reports', label: 'Reports' },
  ];

  patch<K extends keyof SystemPreferences>(key: K, value: SystemPreferences[K]): void {
    const current = this.preferences();
    if (!current) return;
    this.state.patchDraft('preferences', { ...current, [key]: value });
  }

  selectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  checkedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
