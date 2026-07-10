import { Injectable } from '@angular/core';

import { BrandConfiguration, BrandValidationIssue, BrandValidationResult } from '../models';
import { getContrastRatio } from '../utils';

const HEX_COLOR_PATTERN = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

@Injectable({ providedIn: 'root' })
export class ThemeValidatorService {
  validateBrand(brand: BrandConfiguration): BrandValidationResult {
    const issues: BrandValidationIssue[] = [];

    if (!brand.name.trim()) {
      issues.push({
        field: 'name',
        message: 'Brand name is required.',
        severity: 'error',
      });
    }

    if (!brand.shortName.trim()) {
      issues.push({
        field: 'shortName',
        message: 'Brand short name is required.',
        severity: 'error',
      });
    }

    this.validateColorField(issues, 'primaryColor', brand.primaryColor, '#ffffff');
    this.validateColorField(issues, 'secondaryColor', brand.secondaryColor, '#ffffff');
    this.validateColorField(issues, 'accentColor', brand.accentColor, '#ffffff');

    if (brand.logo && !brand.logo.src.trim()) {
      issues.push({
        field: 'logo.src',
        message: 'Logo source is required when a logo is defined.',
        severity: 'error',
      });
    }

    return {
      valid: issues.every((issue) => issue.severity !== 'error'),
      issues,
    };
  }

  private validateColorField(
    issues: BrandValidationIssue[],
    field: string,
    color: string | undefined,
    contrastAgainst: string,
  ): void {
    if (!color) {
      return;
    }

    if (!HEX_COLOR_PATTERN.test(color)) {
      issues.push({
        field,
        message: `${field} must be a valid hex color.`,
        severity: 'error',
      });
      return;
    }

    const ratio = getContrastRatio(color, contrastAgainst);

    if (ratio < 4.5) {
      issues.push({
        field,
        message: `${field} does not meet WCAG AA contrast requirements (${ratio.toFixed(2)}:1).`,
        severity: 'warning',
      });
    }
  }
}
