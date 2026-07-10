import { ThemeDefinition } from '../models';
import {
  PLATFORM_BRAND,
  PLATFORM_DARK_TOKENS,
  PLATFORM_DESIGN_TOKENS,
} from './platform-theme.config';
import { createInheritedTheme, mergeDesignTokens } from '../utils/theme.utils';

const createPlaceholderBrand = (
  id: string,
  type: ThemeDefinition['type'],
  name: string,
  shortName: string,
): ThemeDefinition['brand'] => ({
  ...PLATFORM_BRAND,
  id,
  type: type === 'platform-default' ? 'platform' : type,
  name,
  shortName,
});

export const PLATFORM_DEFAULT_THEME: ThemeDefinition = {
  id: 'platform-default',
  name: 'Platform Default',
  type: 'platform-default',
  mode: 'system',
  tokens: PLATFORM_DESIGN_TOKENS,
  brand: PLATFORM_BRAND,
  metadata: {
    version: '1.0.0',
    lastUpdated: '2026-07-10',
    source: 'platform',
  },
};

export const PLATFORM_DARK_THEME: ThemeDefinition = {
  id: 'platform-dark',
  name: 'Platform Dark',
  type: 'platform-default',
  extends: 'platform-default',
  mode: 'dark',
  tokens: mergeDesignTokens(PLATFORM_DESIGN_TOKENS, PLATFORM_DARK_TOKENS),
  brand: PLATFORM_BRAND,
};

export const ORGANIZATION_THEME_TEMPLATE: ThemeDefinition = createInheritedTheme(
  PLATFORM_DEFAULT_THEME,
  {
    id: 'organization-template',
    name: 'Organization Theme',
    type: 'organization',
    brand: createPlaceholderBrand('organization-template', 'organization', 'Organization', 'ORG'),
  },
);

export const BUILDER_THEME_TEMPLATE: ThemeDefinition = createInheritedTheme(
  PLATFORM_DEFAULT_THEME,
  {
    id: 'builder-template',
    name: 'Builder Theme',
    type: 'builder',
    brand: createPlaceholderBrand('builder-template', 'builder', 'Builder', 'BLD'),
  },
);

export const PARTNER_THEME_TEMPLATE: ThemeDefinition = createInheritedTheme(
  PLATFORM_DEFAULT_THEME,
  {
    id: 'partner-template',
    name: 'Partner Theme',
    type: 'partner',
    brand: createPlaceholderBrand('partner-template', 'partner', 'Partner', 'PTR'),
  },
);

export const MARKETPLACE_THEME_TEMPLATE: ThemeDefinition = createInheritedTheme(
  PLATFORM_DEFAULT_THEME,
  {
    id: 'marketplace-template',
    name: 'Marketplace Theme',
    type: 'marketplace',
    brand: createPlaceholderBrand('marketplace-template', 'marketplace', 'Marketplace', 'MKT'),
  },
);

export const THEME_PACKAGE_DEFINITIONS: readonly ThemeDefinition[] = [
  PLATFORM_DEFAULT_THEME,
  PLATFORM_DARK_THEME,
  ORGANIZATION_THEME_TEMPLATE,
  BUILDER_THEME_TEMPLATE,
  PARTNER_THEME_TEMPLATE,
  MARKETPLACE_THEME_TEMPLATE,
];
