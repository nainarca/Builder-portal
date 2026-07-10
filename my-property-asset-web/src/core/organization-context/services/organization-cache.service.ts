import { Injectable, inject } from '@angular/core';

import { StorageService } from '@infrastructure/storage';
import { ORGANIZATION_STORAGE_KEYS } from '../constants/organization.constants';

interface PersistedOrganizationPreference {
  userId: string;
  organizationId: string;
  updatedAt: number;
}

@Injectable({ providedIn: 'root' })
export class OrganizationCacheService {
  private readonly storage = inject(StorageService);

  getLastUsedOrganizationId(userId: string): string | null {
    const value = this.storage.get<PersistedOrganizationPreference>(
      ORGANIZATION_STORAGE_KEYS.lastUsedOrganization,
    );

    if (!value || value.userId !== userId) {
      return null;
    }

    return value.organizationId;
  }

  persistLastUsedOrganization(userId: string, organizationId: string): void {
    const payload: PersistedOrganizationPreference = {
      userId,
      organizationId,
      updatedAt: Date.now(),
    };

    this.storage.set(ORGANIZATION_STORAGE_KEYS.lastUsedOrganization, payload);
    this.storage.set(ORGANIZATION_STORAGE_KEYS.activeOrganization, payload, { backend: 'session' });
  }

  getSessionOrganizationId(userId: string): string | null {
    const value = this.storage.get<PersistedOrganizationPreference>(
      ORGANIZATION_STORAGE_KEYS.activeOrganization,
      { backend: 'session' },
    );

    if (!value || value.userId !== userId) {
      return null;
    }

    return value.organizationId;
  }

  clear(userId?: string): void {
    if (!userId) {
      this.storage.remove(ORGANIZATION_STORAGE_KEYS.lastUsedOrganization);
      this.storage.remove(ORGANIZATION_STORAGE_KEYS.activeOrganization, 'session');
      return;
    }

    const lastUsed = this.storage.get<PersistedOrganizationPreference>(
      ORGANIZATION_STORAGE_KEYS.lastUsedOrganization,
    );
    if (lastUsed?.userId === userId) {
      this.storage.remove(ORGANIZATION_STORAGE_KEYS.lastUsedOrganization);
    }

    const active = this.storage.get<PersistedOrganizationPreference>(
      ORGANIZATION_STORAGE_KEYS.activeOrganization,
      { backend: 'session' },
    );
    if (active?.userId === userId) {
      this.storage.remove(ORGANIZATION_STORAGE_KEYS.activeOrganization, 'session');
    }
  }
}
