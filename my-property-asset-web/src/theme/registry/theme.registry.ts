import { Injectable } from '@angular/core';

import { THEME_PACKAGE_DEFINITIONS } from '../config';
import { ThemeDefinition, ThemePackageType } from '../models';
import { mergeDesignTokens } from '../utils';

@Injectable({ providedIn: 'root' })
export class ThemeRegistry {
  private readonly themes = new Map<string, ThemeDefinition>();

  constructor() {
    for (const theme of THEME_PACKAGE_DEFINITIONS) {
      this.themes.set(theme.id, theme);
    }
  }

  register(theme: ThemeDefinition): void {
    this.themes.set(theme.id, theme);
  }

  get(themeId: string): ThemeDefinition | undefined {
    const theme = this.themes.get(themeId);

    if (!theme) {
      return undefined;
    }

    return this.resolveInheritance(theme);
  }

  getByType(type: ThemePackageType): ThemeDefinition[] {
    return [...this.themes.values()]
      .map((theme) => this.resolveInheritance(theme))
      .filter((theme) => theme.type === type);
  }

  list(): ThemeDefinition[] {
    return [...this.themes.values()].map((theme) => this.resolveInheritance(theme));
  }

  private resolveInheritance(theme: ThemeDefinition): ThemeDefinition {
    if (!theme.extends) {
      return theme;
    }

    const parent = this.themes.get(theme.extends);

    if (!parent) {
      return theme;
    }

    const resolvedParent = this.resolveInheritance(parent);

    return {
      ...resolvedParent,
      ...theme,
      tokens: mergeDesignTokens(resolvedParent.tokens, theme.tokens),
      brand: { ...resolvedParent.brand, ...theme.brand },
      overrides: {
        ...resolvedParent.overrides,
        ...theme.overrides,
        cssVariables: {
          ...resolvedParent.overrides?.cssVariables,
          ...theme.overrides?.cssVariables,
        },
      },
    };
  }
}
