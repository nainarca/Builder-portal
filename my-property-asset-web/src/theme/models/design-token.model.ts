export interface ColorTokens {
  primary: string;
  primaryHover: string;
  primaryContrast: string;
  primarySubtle: string;
  secondary: string;
  secondaryHover: string;
  secondaryContrast: string;
  accent: string;
  accentHover: string;
  accentContrast: string;
  success: string;
  successContrast: string;
  warning: string;
  warningContrast: string;
  danger: string;
  dangerContrast: string;
  info: string;
  infoContrast: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  background: string;
  text: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  focus: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface OpacityTokens {
  disabled: number;
  muted: number;
  overlay: number;
  hover: number;
}

export interface SpacingTokens {
  unit: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface BorderRadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface TypographyTokens {
  fontFamily: string;
  fontFamilyMono: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  lineHeightTight: string;
  lineHeightNormal: string;
  lineHeightRelaxed: string;
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
}

export interface ElevationTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface AnimationTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  easingStandard: string;
  easingEmphasized: string;
}

export interface TransitionTokens {
  fast: string;
  normal: string;
  slow: string;
}

export interface ZIndexTokens {
  base: number;
  dropdown: number;
  sticky: number;
  overlay: number;
  drawer: number;
  modal: number;
  toast: number;
  tooltip: number;
}

export interface IconSizeTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface DesignTokens {
  colors: ColorTokens;
  shadows: ShadowTokens;
  opacity: OpacityTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  typography: TypographyTokens;
  elevation: ElevationTokens;
  animation: AnimationTokens;
  transition: TransitionTokens;
  zIndex: ZIndexTokens;
  iconSize: IconSizeTokens;
}

export type DesignTokenCategory = keyof DesignTokens;

export type CssVariableMap = Record<string, string>;
