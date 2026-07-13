import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { THEME_PACKAGE_OPTIONS } from '../../config/branding.config';
import { BrandThemePreferences } from '../../models/brand-admin.model';
import { BrandStudioStateService } from '../../services/brand-studio-state.service';

type ThemeMode = BrandThemePreferences['mode'];

@Component({
  selector: 'app-wl-themes-panel',
  template: `
    @if (studio.draftModel(); as model) {
      <section class="wl-themes-panel" aria-label="Theme configuration">
        <div class="wl-themes-panel__controls">
          <label class="wl-themes-panel__field">
            <span class="wl-themes-panel__label">Theme package</span>
            <select
              class="wl-themes-panel__select"
              [value]="model.theme.themePackage"
              (change)="onPackage($event)"
            >
              @for (option of packages; track option.id) {
                <option [value]="option.id">{{ option.label }}</option>
              }
            </select>
          </label>

          <label class="wl-themes-panel__field">
            <span class="wl-themes-panel__label">Default mode</span>
            <select
              class="wl-themes-panel__select"
              [value]="model.theme.mode"
              (change)="onMode($event)"
            >
              @for (mode of modes; track mode) {
                <option [value]="mode">{{ mode }}</option>
              }
            </select>
          </label>
        </div>

        <div class="wl-themes-panel__inheritance">
          <span class="wl-themes-panel__label">Inheritance</span>
          <div class="wl-themes-panel__chain">
            <span class="wl-themes-panel__chip">{{ model.theme.inheritFrom }}</span>
            <i class="pi pi-arrow-right" aria-hidden="true"></i>
            <span class="wl-themes-panel__chip wl-themes-panel__chip--current">{{ model.theme.themePackage }}</span>
          </div>
          <p class="wl-themes-panel__note">
            This brand inherits base tokens from
            <strong>{{ model.theme.inheritFrom }}</strong> and applies its own overrides on top.
          </p>
        </div>
      </section>
    }
  `,
  styles: `
    .wl-themes-panel { display: flex; flex-direction: column; gap: 1.5rem; }
    .wl-themes-panel__controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .wl-themes-panel__field { display: flex; flex-direction: column; gap: 0.35rem; }
    .wl-themes-panel__label {
      font-size: var(--mpa-font-size-sm, 0.875rem);
      font-weight: 500;
      color: var(--mpa-color-text);
    }
    .wl-themes-panel__select {
      padding: 0.5rem 0.65rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      text-transform: capitalize;
    }
    .wl-themes-panel__inheritance {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-themes-panel__chain { display: flex; align-items: center; gap: 0.6rem; color: var(--mpa-color-text-muted); }
    .wl-themes-panel__chip {
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      border: 1px solid var(--mpa-color-border);
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text);
    }
    .wl-themes-panel__chip--current {
      border-color: var(--mpa-color-primary);
      color: var(--mpa-color-primary);
      font-weight: 600;
    }
    .wl-themes-panel__note {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlThemesPanelComponent {
  readonly studio = inject(BrandStudioStateService);

  readonly packages = THEME_PACKAGE_OPTIONS;
  readonly modes: readonly ThemeMode[] = ['light', 'dark', 'auto', 'system'];

  onPackage(event: Event): void {
    this.patchTheme({ themePackage: (event.target as HTMLSelectElement).value });
  }

  onMode(event: Event): void {
    this.patchTheme({ mode: (event.target as HTMLSelectElement).value as ThemeMode });
  }

  private patchTheme(partial: Partial<BrandThemePreferences>): void {
    const model = this.studio.draftModel();
    if (!model) return;
    this.studio.patchDraft({ theme: { ...model.theme, ...partial } });
  }
}
