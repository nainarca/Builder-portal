import { Injectable, computed, inject, signal } from '@angular/core';

import { THEME_ENGINE_CONFIG } from '../config';
import { BrandConfiguration, ThemeContext, ThemeDefinition, ThemeModePreference } from '../models';
import { ThemeRegistry } from '../registry';
import { createInheritedTheme, resolveThemeMode } from '../utils';
import { ThemeLoaderService } from './theme-loader.service';
import { isSupportedThemeMode, ThemePersistenceService } from './theme-persistence.service';
import { ThemeValidatorService } from './theme-validator.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly registry = inject(ThemeRegistry);
  private readonly loader = inject(ThemeLoaderService);
  private readonly persistence = inject(ThemePersistenceService);
  private readonly validator = inject(ThemeValidatorService);

  private readonly themeIdSignal = signal(THEME_ENGINE_CONFIG.defaultThemeId);
  private readonly modePreferenceSignal = signal<ThemeModePreference>('system');
  private readonly organizationDefaultModeSignal = signal<ThemeModePreference>('system');
  private readonly contextSignal = signal<ThemeContext>({
    themeId: THEME_ENGINE_CONFIG.defaultThemeId,
    packageType: 'platform-default',
  });

  readonly themeId = this.themeIdSignal.asReadonly();
  readonly modePreference = this.modePreferenceSignal.asReadonly();
  readonly organizationDefaultMode = this.organizationDefaultModeSignal.asReadonly();
  readonly context = this.contextSignal.asReadonly();

  readonly currentTheme = computed(() => this.registry.get(this.themeIdSignal()));
  readonly resolvedMode = computed(() =>
    resolveThemeMode(this.modePreferenceSignal(), this.organizationDefaultModeSignal()),
  );

  constructor() {
    this.initializeFromPersistence();
    this.applyCurrentTheme();

    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.modePreferenceSignal() === 'system') {
          this.applyCurrentTheme();
        }
      });

      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
        this.applyAccessibilityPreferences();
      });

      window.matchMedia('(prefers-contrast: more)').addEventListener('change', () => {
        this.applyAccessibilityPreferences();
      });
    }

    this.applyAccessibilityPreferences();
  }

  setMode(mode: ThemeModePreference): void {
    this.modePreferenceSignal.set(mode);
    this.persistState();
    this.applyCurrentTheme();
  }

  setOrganizationDefaultMode(mode: ThemeModePreference): void {
    this.organizationDefaultModeSignal.set(mode);

    if (this.modePreferenceSignal() === 'auto') {
      this.applyCurrentTheme();
    }
  }

  loadTheme(themeId: string): void {
    const theme = this.registry.get(themeId);

    if (!theme) {
      return;
    }

    this.themeIdSignal.set(themeId);
    this.contextSignal.set({
      themeId,
      packageType: theme.type,
    });
    this.persistState();
    this.applyCurrentTheme();
  }

  applyOrganizationBrand(brand: BrandConfiguration): void {
    const validation = this.validator.validateBrand(brand);

    if (!validation.valid) {
      return;
    }

    const baseTheme = this.registry.get(THEME_ENGINE_CONFIG.defaultThemeId);

    if (!baseTheme) {
      return;
    }

    const organizationTheme = createInheritedTheme(baseTheme, {
      id: `organization-${brand.id}`,
      name: `${brand.name} Theme`,
      type: 'organization',
      brand,
      overrides: {
        cssVariables: brand.primaryColor
          ? { '--mpa-color-primary': brand.primaryColor }
          : undefined,
      },
    });

    this.registry.register(organizationTheme);
    this.loadTheme(organizationTheme.id);
  }

  applyBuilderBrand(brand: BrandConfiguration): void {
    this.registerRuntimeBrandTheme('builder', brand);
  }

  applyPartnerBrand(brand: BrandConfiguration): void {
    this.registerRuntimeBrandTheme('partner', brand);
  }

  applyMarketplaceBrand(brand: BrandConfiguration): void {
    this.registerRuntimeBrandTheme('marketplace', brand);
  }

  getTheme(themeId: string): ThemeDefinition | undefined {
    return this.registry.get(themeId);
  }

  private registerRuntimeBrandTheme(
    type: ThemeDefinition['type'],
    brand: BrandConfiguration,
  ): void {
    const validation = this.validator.validateBrand(brand);

    if (!validation.valid) {
      return;
    }

    const baseTheme = this.registry.get(THEME_ENGINE_CONFIG.defaultThemeId);

    if (!baseTheme) {
      return;
    }

    const runtimeTheme = createInheritedTheme(baseTheme, {
      id: `${type}-${brand.id}`,
      name: `${brand.name} Theme`,
      type,
      brand,
    });

    this.registry.register(runtimeTheme);
    this.loadTheme(runtimeTheme.id);
  }

  private initializeFromPersistence(): void {
    const persisted = this.persistence.load();

    if (!persisted) {
      return;
    }

    if (persisted.themeId && this.registry.get(persisted.themeId)) {
      this.themeIdSignal.set(persisted.themeId);
    }

    if (persisted.mode && isSupportedThemeMode(persisted.mode)) {
      this.modePreferenceSignal.set(persisted.mode);
    }
  }

  private persistState(): void {
    this.persistence.save({
      mode: this.modePreferenceSignal(),
      themeId: this.themeIdSignal(),
      userPreference: this.modePreferenceSignal(),
    });
  }

  private applyCurrentTheme(): void {
    const theme = this.currentTheme();
    const mode = this.resolvedMode();

    if (!theme) {
      return;
    }

    const themeForMode =
      mode === 'dark' && theme.id === THEME_ENGINE_CONFIG.defaultThemeId
        ? (this.registry.get('platform-dark') ?? theme)
        : theme;

    this.loader.loadTheme(themeForMode, mode);
  }

  private applyAccessibilityPreferences(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle(
      'mpa-reduced-motion',
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    root.classList.toggle(
      'mpa-high-contrast',
      window.matchMedia('(prefers-contrast: more)').matches,
    );
  }
}
