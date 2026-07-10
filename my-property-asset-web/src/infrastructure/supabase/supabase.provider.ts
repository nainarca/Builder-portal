import { Provider } from '@angular/core';

import { environment } from '../../environments/environment';
import { ENVIRONMENT, SUPABASE_CLIENT } from '../tokens/injection.tokens';
import { createSupabaseClient } from './supabase.client';

export function provideEnvironmentConfig(config: typeof environment): Provider[] {
  return [
    {
      provide: ENVIRONMENT,
      useValue: config,
    },
  ];
}

export function provideSupabase(): Provider[] {
  return [
    {
      provide: SUPABASE_CLIENT,
      useFactory: (config: typeof environment) => createSupabaseClient(config),
      deps: [ENVIRONMENT],
    },
  ];
}

export function provideInfrastructure(config: typeof environment): Provider[] {
  return [...provideEnvironmentConfig(config), ...provideSupabase()];
}
