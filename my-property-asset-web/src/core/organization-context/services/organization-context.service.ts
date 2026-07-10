import { Injectable, computed, inject } from '@angular/core';

import { OrganizationContextManagerService } from './organization-context-manager.service';
import { OrganizationStoreService } from './organization-store.service';

@Injectable({ providedIn: 'root' })
export class OrganizationContextService {
  private readonly manager = inject(OrganizationContextManagerService);
  private readonly store = inject(OrganizationStoreService);

  readonly context = this.store.context;
  readonly isResolved = this.store.isResolved;
  readonly organizationId = this.store.organizationId;
  readonly activeOrganization = this.store.activeOrganization;
  readonly canSwitch = computed(() => this.store.canSwitch());

  async resolve(): Promise<void> {
    await this.manager.resolve();
  }

  async switchOrganization(organizationId: string): Promise<boolean> {
    return this.manager.switchOrganization(organizationId);
  }

  clear(): void {
    this.manager.clear();
  }
}
