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
  environmentName: 'qa',
  appTitle: 'MyPropertyAsset (QA)',
  appVersion: '0.0.0-qa',
  featureFlagDefaults: SHARED_FEATURE_FLAGS,
  supabase: {
    url: '',
    anonKey: '',
  },
};
