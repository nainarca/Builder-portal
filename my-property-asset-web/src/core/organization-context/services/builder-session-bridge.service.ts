import { Injectable, signal } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';
import { OrganizationMembership } from '../models/organization.model';

const STORAGE_KEY = 'mpa-builder-membership';

/**
 * P7 session bridge: holds accepted builder membership until JWT/org rows are live.
 * Lives in core to avoid feature → core reverse imports.
 */
@Injectable({ providedIn: 'root' })
export class BuilderSessionBridgeService {
  private readonly membershipSignal = signal<OrganizationMembership | null>(this.readStorage());

  readonly membership = this.membershipSignal.asReadonly();

  setMembership(membership: OrganizationMembership): void {
    this.membershipSignal.set(membership);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(membership));
  }

  clear(): void {
    this.membershipSignal.set(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private readStorage(): OrganizationMembership | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as OrganizationMembership;
      if (!parsed?.organizationId || !parsed?.role) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }
}

export type { PlatformRole };
