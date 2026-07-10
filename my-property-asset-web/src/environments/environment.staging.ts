import { Environment } from './environment.model';

const SHARED_FEATURE_FLAGS: Record<string, boolean> = {
  'maintenance-mode': false,
  'builder-portal': true,
  'super-admin': true,
  'public-website': true,
  authentication: true,
};

export const environment: Environment = {
  production: false,
  environmentName: 'staging',
  appTitle: 'MyPropertyAsset (Staging)',
  appVersion: '0.0.0-staging',
  featureFlagDefaults: SHARED_FEATURE_FLAGS,
  supabase: {
    url: '',
    anonKey: '',
  },
};
