import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BrandAdminStatus, BrandPreferences } from '../../models/brand-admin.model';
import { BrandStudioStateService } from '../../services/brand-studio-state.service';

@Component({
  selector: 'app-wl-preferences-panel',
  template: `
    @if (studio.draftModel(); as model) {
      <section class="wl-preferences-panel" aria-label="Brand preferences">
        <label class="wl-preferences-panel__field">
          <span class="wl-preferences-panel__label">Default language</span>
          <select class="wl-preferences-panel__select" [value]="model.preferences.defaultLanguage" (change)="onPreference('defaultLanguage', $event)">
            @for (option of languages; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </label>

        <label class="wl-preferences-panel__field">
          <span class="wl-preferences-panel__label">Default timezone</span>
          <select class="wl-preferences-panel__select" [value]="model.preferences.defaultTimezone" (change)="onPreference('defaultTimezone', $event)">
            @for (zone of timezones; track zone) {
              <option [value]="zone">{{ zone }}</option>
            }
          </select>
        </label>

        <label class="wl-preferences-panel__field">
          <span class="wl-preferences-panel__label">Default currency</span>
          <select class="wl-preferences-panel__select" [value]="model.preferences.defaultCurrency" (change)="onPreference('defaultCurrency', $event)">
            @for (currency of currencies; track currency) {
              <option [value]="currency">{{ currency }}</option>
            }
          </select>
        </label>

        <label class="wl-preferences-panel__field">
          <span class="wl-preferences-panel__label">Status</span>
          <select class="wl-preferences-panel__select" [value]="model.status" (change)="onStatus($event)">
            @for (status of statuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </label>
      </section>
    }
  `,
  styles: `
    .wl-preferences-panel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .wl-preferences-panel__field { display: flex; flex-direction: column; gap: 0.35rem; }
    .wl-preferences-panel__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 500;
      color: var(--mpa-color-text);
    }
    .wl-preferences-panel__select {
      padding: 0.5rem 0.65rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      text-transform: capitalize;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlPreferencesPanelComponent {
  readonly studio = inject(BrandStudioStateService);

  readonly languages: readonly { value: string; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
  ];

  readonly timezones: readonly string[] = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Kolkata',
    'Asia/Singapore',
  ];

  readonly currencies: readonly string[] = ['USD', 'EUR', 'GBP', 'INR', 'SGD', 'AUD'];
  readonly statuses: readonly BrandAdminStatus[] = ['draft', 'active', 'archived'];

  onPreference(key: keyof BrandPreferences, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const model = this.studio.draftModel();
    if (!model) return;
    this.studio.patchDraft({ preferences: { ...model.preferences, [key]: value } });
  }

  onStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as BrandAdminStatus;
    this.studio.patchDraft({ status });
  }
}
