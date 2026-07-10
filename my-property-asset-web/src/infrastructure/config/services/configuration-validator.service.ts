import { Injectable } from '@angular/core';

import {
  AppConfiguration,
  ConfigurationValidationIssue,
  ConfigurationValidationResult,
} from '../models/app-config.model';

@Injectable({ providedIn: 'root' })
export class ConfigurationValidatorService {
  validate(config: AppConfiguration): ConfigurationValidationResult {
    const issues: ConfigurationValidationIssue[] = [];

    if (!config.appTitle.trim()) {
      issues.push({
        field: 'appTitle',
        message: 'Application title is required.',
        severity: 'error',
      });
    }

    if (!config.appVersion.trim()) {
      issues.push({
        field: 'appVersion',
        message: 'Application version is required.',
        severity: 'warning',
      });
    }

    if (config.production && !config.supabase.url) {
      issues.push({
        field: 'supabase.url',
        message: 'Supabase URL should be configured in production.',
        severity: 'warning',
      });
    }

    return {
      valid: issues.every((issue) => issue.severity !== 'error'),
      issues,
    };
  }
}
