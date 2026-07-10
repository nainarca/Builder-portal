export interface RuntimeConfiguration {
  apiBaseUrl?: string;
  supabase?: {
    url?: string;
    anonKey?: string;
  };
  featureFlags?: Record<string, boolean>;
  maintenanceMode?: boolean;
  announcements?: {
    enabled?: boolean;
  };
}

export interface AppConfiguration {
  production: boolean;
  environmentName: EnvironmentName;
  appTitle: string;
  appVersion: string;
  apiBaseUrl: string;
  supabase: {
    url: string;
    anonKey: string;
  };
  featureFlagDefaults: Record<string, boolean>;
  runtimeLoaded: boolean;
}

export type EnvironmentName = 'development' | 'qa' | 'uat' | 'staging' | 'production';

export interface ConfigurationValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ConfigurationValidationResult {
  valid: boolean;
  issues: ConfigurationValidationIssue[];
}
