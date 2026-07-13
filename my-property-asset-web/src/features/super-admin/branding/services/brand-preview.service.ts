import { Injectable, inject } from '@angular/core';

import { PLATFORM_DARK_TOKENS, PLATFORM_DESIGN_TOKENS } from '@theme/config';
import { BrandConfiguration } from '@theme/models';
import { DesignTokens } from '@theme/models/design-token.model';
import { ThemeValidatorService } from '@theme/services';
import {
  brandToCssVariables,
  designTokensToCssVariables,
  getContrastRatio,
  mergeCssVariableMaps,
  mergeDesignTokens,
} from '@theme/utils';

import { BrandAdminRecord, BrandColorSet } from '../models/brand-admin.model';

@Injectable({ providedIn: 'root' })
export class BrandPreviewService {
  private readonly validator = inject(ThemeValidatorService);

  toBrandConfiguration(record: BrandAdminRecord): BrandConfiguration {
    const primary = record.logos.find((l) => l.key === 'primary');
    return {
      id: record.id,
      type: record.type,
      name: record.identity.applicationName,
      shortName: record.identity.shortName,
      primaryColor: record.colors.primary,
      secondaryColor: record.colors.secondary,
      accentColor: record.colors.accent,
      browserThemeColor: record.colors.primary,
      typography: { fontFamily: record.typography.fontFamily },
      logo: primary?.src ? { src: primary.src, alt: primary.alt } : undefined,
      favicon: record.logos.find((l) => l.key === 'favicon')?.src,
      manifest: {
        name: record.identity.applicationName,
        shortName: record.identity.shortName,
        themeColor: record.colors.primary,
        backgroundColor: record.colors.background,
      },
      emailBranding: {
        headerBackgroundColor: record.colors.primary,
        footerTextColor: record.colors.textMuted,
        logoUrl: primary?.src || undefined,
      },
    };
  }

  applyToElement(element: HTMLElement, record: BrandAdminRecord, mode: 'light' | 'dark'): void {
    const brand = this.toBrandConfiguration(record);
    const baseTokens =
      mode === 'dark'
        ? mergeDesignTokens(PLATFORM_DESIGN_TOKENS, PLATFORM_DARK_TOKENS)
        : PLATFORM_DESIGN_TOKENS;
    const tokens = this.mergeColorsIntoTokens(baseTokens, record.colors);
    const vars = mergeCssVariableMaps(
      designTokensToCssVariables(tokens),
      brandToCssVariables(brand),
      {
        '--mpa-color-primary': record.colors.primary,
        '--mpa-color-secondary': record.colors.secondary,
        '--mpa-color-accent': record.colors.accent,
        '--mpa-color-success': record.colors.success,
        '--mpa-color-warning': record.colors.warning,
        '--mpa-color-danger': record.colors.danger,
        '--mpa-color-info': record.colors.info,
        '--mpa-color-surface': record.colors.surface,
        '--mpa-color-surface-elevated': record.colors.surfaceElevated,
        '--mpa-color-background': record.colors.background,
        '--mpa-color-text': record.colors.text,
        '--mpa-color-text-muted': record.colors.textMuted,
        '--mpa-color-border': record.colors.border,
        '--mpa-font-family': record.typography.fontFamily,
      },
    );

    for (const [name, value] of Object.entries(vars)) {
      element.style.setProperty(name, value);
    }

    element.setAttribute('data-theme-mode', mode);
    element.classList.toggle('mpa-theme-dark', mode === 'dark');
    element.classList.toggle('mpa-theme-light', mode === 'light');
  }

  validate(record: BrandAdminRecord) {
    return this.validator.validateBrand(this.toBrandConfiguration(record));
  }

  getContrastRatio(foreground: string, background: string): number {
    return getContrastRatio(foreground, background);
  }

  generatePalette(baseColor: string): string[] {
    return [
      baseColor,
      this.adjustLightness(baseColor, 0.15),
      this.adjustLightness(baseColor, -0.15),
      this.adjustLightness(baseColor, 0.3),
      this.adjustLightness(baseColor, -0.3),
    ];
  }

  private mergeColorsIntoTokens(tokens: DesignTokens, colors: BrandColorSet): DesignTokens {
    return mergeDesignTokens(tokens, {
      colors: {
        ...tokens.colors,
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        info: colors.info,
        surface: colors.surface,
        surfaceElevated: colors.surfaceElevated,
        background: colors.background,
        text: colors.text,
        textMuted: colors.textMuted,
        border: colors.border,
      },
    });
  }

  private adjustLightness(hex: string, amount: number): string {
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return hex;
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const adjust = (c: number) => Math.max(0, Math.min(255, Math.round(c + amount * 255)));
    return `#${[adjust(r), adjust(g), adjust(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
  }
}
