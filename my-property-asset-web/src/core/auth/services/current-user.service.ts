import { Injectable, inject } from '@angular/core';
import type { Session } from '@supabase/supabase-js';

import { AuthContextService } from './auth-context.service';
import { AuthUser } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly authContext = inject(AuthContextService);

  readonly user = this.authContext.user;
  readonly isAuthenticated = this.authContext.isAuthenticated;

  getUserId(): string | null {
    return this.authContext.user()?.id ?? null;
  }

  getEmail(): string | null {
    return this.authContext.user()?.email ?? null;
  }

  snapshot(): AuthUser | null {
    return this.authContext.user();
  }

  applySession(session: Session | null): void {
    this.authContext.applySession(session);
  }
}
