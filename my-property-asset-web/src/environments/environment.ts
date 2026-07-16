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
    url: 'https://togszcwbaqzbyxqrlngb.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ3N6Y3diYXF6Ynl4cXJsbmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwMzQsImV4cCI6MjA5NjYzNDAzNH0.u-7Vw_c9Pt-tiOYPOBqgpomeXkNLo5_QQxDLCIu808I',
  },
};
