import {
  BrandConfiguration,
  CssVariableMap,
  DesignTokens,
  ResolvedThemeMode,
  ThemeDefinition,
  ThemeModePreference,
} from '../models';

const CSS_VAR_PREFIX = '--mpa';

export function designTokensToCssVariables(tokens: DesignTokens): CssVariableMap {
  const {
    colors,
    shadows,
    opacity,
    spacing,
    borderRadius,
    typography,
    elevation,
    animation,
    transition,
    zIndex,
    iconSize,
  } = tokens;

  return {
    [`${CSS_VAR_PREFIX}-color-primary`]: colors.primary,
    [`${CSS_VAR_PREFIX}-color-primary-hover`]: colors.primaryHover,
    [`${CSS_VAR_PREFIX}-color-primary-contrast`]: colors.primaryContrast,
    [`${CSS_VAR_PREFIX}-color-primary-subtle`]: colors.primarySubtle,
    [`${CSS_VAR_PREFIX}-color-secondary`]: colors.secondary,
    [`${CSS_VAR_PREFIX}-color-secondary-hover`]: colors.secondaryHover,
    [`${CSS_VAR_PREFIX}-color-secondary-contrast`]: colors.secondaryContrast,
    [`${CSS_VAR_PREFIX}-color-accent`]: colors.accent,
    [`${CSS_VAR_PREFIX}-color-accent-hover`]: colors.accentHover,
    [`${CSS_VAR_PREFIX}-color-accent-contrast`]: colors.accentContrast,
    [`${CSS_VAR_PREFIX}-color-success`]: colors.success,
    [`${CSS_VAR_PREFIX}-color-success-contrast`]: colors.successContrast,
    [`${CSS_VAR_PREFIX}-color-warning`]: colors.warning,
    [`${CSS_VAR_PREFIX}-color-warning-contrast`]: colors.warningContrast,
    [`${CSS_VAR_PREFIX}-color-danger`]: colors.danger,
    [`${CSS_VAR_PREFIX}-color-danger-contrast`]: colors.dangerContrast,
    [`${CSS_VAR_PREFIX}-color-info`]: colors.info,
    [`${CSS_VAR_PREFIX}-color-info-contrast`]: colors.infoContrast,
    [`${CSS_VAR_PREFIX}-color-surface`]: colors.surface,
    [`${CSS_VAR_PREFIX}-color-surface-elevated`]: colors.surfaceElevated,
    [`${CSS_VAR_PREFIX}-color-surface-muted`]: colors.surfaceMuted,
    [`${CSS_VAR_PREFIX}-color-background`]: colors.background,
    [`${CSS_VAR_PREFIX}-color-text`]: colors.text,
    [`${CSS_VAR_PREFIX}-color-text-muted`]: colors.textMuted,
    [`${CSS_VAR_PREFIX}-color-border`]: colors.border,
    [`${CSS_VAR_PREFIX}-color-border-strong`]: colors.borderStrong,
    [`${CSS_VAR_PREFIX}-color-focus`]: colors.focus,
    [`${CSS_VAR_PREFIX}-shadow-sm`]: shadows.sm,
    [`${CSS_VAR_PREFIX}-shadow-md`]: shadows.md,
    [`${CSS_VAR_PREFIX}-shadow-lg`]: shadows.lg,
    [`${CSS_VAR_PREFIX}-shadow-xl`]: shadows.xl,
    [`${CSS_VAR_PREFIX}-opacity-disabled`]: String(opacity.disabled),
    [`${CSS_VAR_PREFIX}-opacity-muted`]: String(opacity.muted),
    [`${CSS_VAR_PREFIX}-opacity-overlay`]: String(opacity.overlay),
    [`${CSS_VAR_PREFIX}-opacity-hover`]: String(opacity.hover),
    [`${CSS_VAR_PREFIX}-spacing-unit`]: spacing.unit,
    [`${CSS_VAR_PREFIX}-spacing-xs`]: spacing.xs,
    [`${CSS_VAR_PREFIX}-spacing-sm`]: spacing.sm,
    [`${CSS_VAR_PREFIX}-spacing-md`]: spacing.md,
    [`${CSS_VAR_PREFIX}-spacing-lg`]: spacing.lg,
    [`${CSS_VAR_PREFIX}-spacing-xl`]: spacing.xl,
    [`${CSS_VAR_PREFIX}-spacing-2xl`]: spacing['2xl'],
    [`${CSS_VAR_PREFIX}-spacing-3xl`]: spacing['3xl'],
    [`${CSS_VAR_PREFIX}-radius-sm`]: borderRadius.sm,
    [`${CSS_VAR_PREFIX}-radius-md`]: borderRadius.md,
    [`${CSS_VAR_PREFIX}-radius-lg`]: borderRadius.lg,
    [`${CSS_VAR_PREFIX}-radius-xl`]: borderRadius.xl,
    [`${CSS_VAR_PREFIX}-radius-full`]: borderRadius.full,
    [`${CSS_VAR_PREFIX}-font-family`]: typography.fontFamily,
    [`${CSS_VAR_PREFIX}-font-family-mono`]: typography.fontFamilyMono,
    [`${CSS_VAR_PREFIX}-font-size-xs`]: typography.fontSizeXs,
    [`${CSS_VAR_PREFIX}-font-size-sm`]: typography.fontSizeSm,
    [`${CSS_VAR_PREFIX}-font-size-md`]: typography.fontSizeMd,
    [`${CSS_VAR_PREFIX}-font-size-lg`]: typography.fontSizeLg,
    [`${CSS_VAR_PREFIX}-font-size-xl`]: typography.fontSizeXl,
    [`${CSS_VAR_PREFIX}-font-size-2xl`]: typography.fontSize2xl,
    [`${CSS_VAR_PREFIX}-font-size-3xl`]: typography.fontSize3xl,
    [`${CSS_VAR_PREFIX}-line-height-tight`]: typography.lineHeightTight,
    [`${CSS_VAR_PREFIX}-line-height-normal`]: typography.lineHeightNormal,
    [`${CSS_VAR_PREFIX}-line-height-relaxed`]: typography.lineHeightRelaxed,
    [`${CSS_VAR_PREFIX}-font-weight-regular`]: String(typography.fontWeightRegular),
    [`${CSS_VAR_PREFIX}-font-weight-medium`]: String(typography.fontWeightMedium),
    [`${CSS_VAR_PREFIX}-font-weight-semibold`]: String(typography.fontWeightSemibold),
    [`${CSS_VAR_PREFIX}-font-weight-bold`]: String(typography.fontWeightBold),
    [`${CSS_VAR_PREFIX}-elevation-none`]: elevation.none,
    [`${CSS_VAR_PREFIX}-elevation-sm`]: elevation.sm,
    [`${CSS_VAR_PREFIX}-elevation-md`]: elevation.md,
    [`${CSS_VAR_PREFIX}-elevation-lg`]: elevation.lg,
    [`${CSS_VAR_PREFIX}-elevation-xl`]: elevation.xl,
    [`${CSS_VAR_PREFIX}-animation-duration-fast`]: animation.durationFast,
    [`${CSS_VAR_PREFIX}-animation-duration-normal`]: animation.durationNormal,
    [`${CSS_VAR_PREFIX}-animation-duration-slow`]: animation.durationSlow,
    [`${CSS_VAR_PREFIX}-animation-easing-standard`]: animation.easingStandard,
    [`${CSS_VAR_PREFIX}-animation-easing-emphasized`]: animation.easingEmphasized,
    [`${CSS_VAR_PREFIX}-transition-fast`]: transition.fast,
    [`${CSS_VAR_PREFIX}-transition-normal`]: transition.normal,
    [`${CSS_VAR_PREFIX}-transition-slow`]: transition.slow,
    [`${CSS_VAR_PREFIX}-z-index-base`]: String(zIndex.base),
    [`${CSS_VAR_PREFIX}-z-index-dropdown`]: String(zIndex.dropdown),
    [`${CSS_VAR_PREFIX}-z-index-sticky`]: String(zIndex.sticky),
    [`${CSS_VAR_PREFIX}-z-index-overlay`]: String(zIndex.overlay),
    [`${CSS_VAR_PREFIX}-z-index-drawer`]: String(zIndex.drawer),
    [`${CSS_VAR_PREFIX}-z-index-modal`]: String(zIndex.modal),
    [`${CSS_VAR_PREFIX}-z-index-toast`]: String(zIndex.toast),
    [`${CSS_VAR_PREFIX}-z-index-tooltip`]: String(zIndex.tooltip),
    [`${CSS_VAR_PREFIX}-icon-size-sm`]: iconSize.sm,
    [`${CSS_VAR_PREFIX}-icon-size-md`]: iconSize.md,
    [`${CSS_VAR_PREFIX}-icon-size-lg`]: iconSize.lg,
    [`${CSS_VAR_PREFIX}-icon-size-xl`]: iconSize.xl,
  };
}

export function brandToCssVariables(brand: BrandConfiguration): CssVariableMap {
  const variables: CssVariableMap = {
    [`${CSS_VAR_PREFIX}-brand-name`]: `"${brand.name}"`,
    [`${CSS_VAR_PREFIX}-brand-short-name`]: `"${brand.shortName}"`,
  };

  if (brand.primaryColor) {
    variables[`${CSS_VAR_PREFIX}-color-primary`] = brand.primaryColor;
  }

  if (brand.secondaryColor) {
    variables[`${CSS_VAR_PREFIX}-color-secondary`] = brand.secondaryColor;
  }

  if (brand.accentColor) {
    variables[`${CSS_VAR_PREFIX}-color-accent`] = brand.accentColor;
  }

  if (brand.browserThemeColor) {
    variables[`${CSS_VAR_PREFIX}-browser-theme-color`] = brand.browserThemeColor;
  }

  if (brand.logo?.src) {
    variables[`${CSS_VAR_PREFIX}-brand-logo-url`] = `url("${brand.logo.src}")`;
  }

  if (brand.loadingLogo?.src) {
    variables[`${CSS_VAR_PREFIX}-brand-loading-logo-url`] = `url("${brand.loadingLogo.src}")`;
  }

  return variables;
}

export function mergeDesignTokens(
  base: DesignTokens,
  overrides: Partial<DesignTokens>,
): DesignTokens {
  return {
    colors: { ...base.colors, ...overrides.colors },
    shadows: { ...base.shadows, ...overrides.shadows },
    opacity: { ...base.opacity, ...overrides.opacity },
    spacing: { ...base.spacing, ...overrides.spacing },
    borderRadius: { ...base.borderRadius, ...overrides.borderRadius },
    typography: { ...base.typography, ...overrides.typography },
    elevation: { ...base.elevation, ...overrides.elevation },
    animation: { ...base.animation, ...overrides.animation },
    transition: { ...base.transition, ...overrides.transition },
    zIndex: { ...base.zIndex, ...overrides.zIndex },
    iconSize: { ...base.iconSize, ...overrides.iconSize },
  };
}

export function createInheritedTheme(
  parent: ThemeDefinition,
  overrides: Partial<ThemeDefinition> & Pick<ThemeDefinition, 'id' | 'name' | 'type'>,
): ThemeDefinition {
  return {
    ...parent,
    ...overrides,
    extends: parent.id,
    tokens: mergeDesignTokens(parent.tokens, overrides.tokens ?? {}),
    brand: { ...parent.brand, ...overrides.brand },
    overrides: {
      ...parent.overrides,
      ...overrides.overrides,
      cssVariables: {
        ...parent.overrides?.cssVariables,
        ...overrides.overrides?.cssVariables,
      },
    },
  };
}

export function resolveThemeMode(
  preference: ThemeModePreference,
  organizationDefault: ThemeModePreference = 'system',
): ResolvedThemeMode {
  const effective =
    preference === 'auto' ? organizationDefault : preference === 'system' ? 'system' : preference;

  if (effective === 'light' || effective === 'dark') {
    return effective;
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function getRelativeLuminance(hex: string): number {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return 0;
  }

  const channels = [0, 2, 4].map((index) => {
    const value = Number.parseInt(normalized.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function getContrastRatio(colorA: string, colorB: string): number {
  const luminanceA = getRelativeLuminance(colorA);
  const luminanceB = getRelativeLuminance(colorB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);

  return (lighter + 0.05) / (darker + 0.05);
}

export function mergeCssVariableMaps(...maps: (CssVariableMap | undefined)[]): CssVariableMap {
  return maps.reduce<CssVariableMap>((accumulator, map) => ({ ...accumulator, ...map }), {});
}
