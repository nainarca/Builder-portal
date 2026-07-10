export interface Environment {
  production: boolean;
  environmentName: 'development' | 'qa' | 'uat' | 'staging' | 'production';
  appTitle: string;
  appVersion?: string;
  runtimeConfigUrl?: string;
  featureFlagDefaults?: Record<string, boolean>;
  supabase: {
    url: string;
    anonKey: string;
  };
}
