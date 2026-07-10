import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  environmentName: 'production',
  appTitle: 'MyPropertyAsset',
  appVersion: '0.0.0',
  featureFlagDefaults: {
    'maintenance-mode': false,
    'builder-portal': true,
    'super-admin': true,
    'public-website': true,
    'authentication': true,
  },
  supabase: {
    url: '',
    anonKey: '',
  },
};
