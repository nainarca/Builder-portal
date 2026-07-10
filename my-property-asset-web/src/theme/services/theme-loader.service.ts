import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import {
  BrandConfiguration,
  CssVariableMap,
  DesignTokens,
  ResolvedThemeMode,
  ThemeDefinition,
} from '../models';
import { brandToCssVariables, designTokensToCssVariables, mergeCssVariableMaps } from '../utils';

@Injectable({ providedIn: 'root' })
export class ThemeLoaderService {
  private readonly document = inject(DOCUMENT);

  loadTheme(theme: ThemeDefinition, resolvedMode: ResolvedThemeMode): void {
    const root = this.document.documentElement;
    const cssVariables = this.buildCssVariables(
      theme.tokens,
      theme.brand,
      theme.overrides?.cssVariables,
    );

    this.applyCssVariables(root, cssVariables);
    this.applyDocumentMetadata(theme.brand);
    this.applyModeAttributes(root, resolvedMode);
  }

  applyTokens(tokens: DesignTokens): void {
    this.applyCssVariables(this.document.documentElement, designTokensToCssVariables(tokens));
  }

  applyBrand(brand: BrandConfiguration): void {
    this.applyCssVariables(this.document.documentElement, brandToCssVariables(brand));
    this.applyDocumentMetadata(brand);
  }

  applyMode(resolvedMode: ResolvedThemeMode): void {
    this.applyModeAttributes(this.document.documentElement, resolvedMode);
  }

  private buildCssVariables(
    tokens: DesignTokens,
    brand: BrandConfiguration,
    overrides?: CssVariableMap,
  ): CssVariableMap {
    return mergeCssVariableMaps(
      designTokensToCssVariables(tokens),
      brandToCssVariables(brand),
      overrides,
    );
  }

  private applyCssVariables(element: HTMLElement, variables: CssVariableMap): void {
    for (const [name, value] of Object.entries(variables)) {
      element.style.setProperty(name, value);
    }
  }

  private applyModeAttributes(root: HTMLElement, resolvedMode: ResolvedThemeMode): void {
    root.setAttribute('data-theme-mode', resolvedMode);
    root.setAttribute('data-theme-resolved', resolvedMode);
    root.classList.toggle('mpa-theme-dark', resolvedMode === 'dark');
    root.classList.toggle('mpa-theme-light', resolvedMode === 'light');
  }

  private applyDocumentMetadata(brand: BrandConfiguration): void {
    const head = this.document.head;
    this.setMetaContent('theme-color', brand.browserThemeColor ?? brand.primaryColor ?? '#1e3a5f');
    this.setMetaContent('application-name', brand.name);

    if (brand.favicon) {
      this.setLinkHref('icon', brand.favicon);
    }

    if (brand.manifest) {
      this.setMetaContent('apple-mobile-web-app-title', brand.manifest.shortName);
    }

    if (!head.querySelector('title')) {
      return;
    }
  }

  private setMetaContent(name: string, content: string): void {
    let element = this.document.querySelector(`meta[name="${name}"]`);

    if (!element) {
      element = this.document.createElement('meta');
      element.setAttribute('name', name);
      this.document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  }

  private setLinkHref(rel: string, href: string): void {
    let element = this.document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

    if (!element) {
      element = this.document.createElement('link');
      element.rel = rel;
      this.document.head.appendChild(element);
    }

    element.href = href;
  }
}
