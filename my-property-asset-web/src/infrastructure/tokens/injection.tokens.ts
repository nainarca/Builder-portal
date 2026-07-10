import { InjectionToken } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

import { AppConfiguration } from '../config/models/app-config.model';
import { Environment } from '../../environments/environment.model';

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT');
export const APP_CONFIGURATION = new InjectionToken<AppConfiguration>('APP_CONFIGURATION');
export const RUNTIME_CONFIG_URL = new InjectionToken<string | undefined>('RUNTIME_CONFIG_URL');
export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>('SUPABASE_CLIENT');
