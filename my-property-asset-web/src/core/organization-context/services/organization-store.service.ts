import { Injectable, computed, inject, signal } from '@angular/core';

import {
  Organization,
  OrganizationContextState,
  OrganizationMembership,
} from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationStoreService {
  private readonly state = signal<OrganizationContextState>({
    resolved: false,
    loading: false,
    switching: false,
    organizationId: null,
    organizationName: null,
    organizationType: null,
    activeOrganization: null,
    memberships: [],
    canSwitch: false,
    error: null,
  });

  readonly context = this.state.asReadonly();
  readonly activeOrganization = computed(() => this.state().activeOrganization);
  readonly memberships = computed(() => this.state().memberships);
  readonly canSwitch = computed(() => this.state().canSwitch);
  readonly isResolved = computed(() => this.state().resolved);
  readonly organizationId = computed(() => this.state().organizationId);
  readonly switching = computed(() => this.state().switching);

  setLoading(loading: boolean): void {
    this.state.update((current) => ({ ...current, loading }));
  }

  setSwitching(switching: boolean): void {
    this.state.update((current) => ({ ...current, switching }));
  }

  setMemberships(memberships: readonly OrganizationMembership[]): void {
    this.state.update((current) => ({
      ...current,
      memberships,
      canSwitch: memberships.length > 1,
    }));
  }

  applyActiveOrganization(organization: Organization | null): void {
    if (!organization) {
      this.state.update((current) => ({
        ...current,
        resolved: false,
        organizationId: null,
        organizationName: null,
        organizationType: null,
        activeOrganization: null,
        error: 'Organization context is unavailable.',
      }));
      return;
    }

    this.state.update((current) => ({
      ...current,
      resolved: true,
      organizationId: organization.id,
      organizationName: organization.name,
      organizationType: organization.type,
      activeOrganization: organization,
      error: null,
    }));
  }

  applyPlatformContext(): void {
    this.state.update((current) => ({
      ...current,
      resolved: true,
      loading: false,
      switching: false,
      organizationId: null,
      organizationName: 'Platform',
      organizationType: 'platform',
      activeOrganization: null,
      memberships: [],
      canSwitch: false,
      error: null,
    }));
  }

  setError(error: string): void {
    this.state.update((current) => ({
      ...current,
      resolved: false,
      loading: false,
      switching: false,
      error,
    }));
  }

  clear(): void {
    this.state.set({
      resolved: false,
      loading: false,
      switching: false,
      organizationId: null,
      organizationName: null,
      organizationType: null,
      activeOrganization: null,
      memberships: [],
      canSwitch: false,
      error: null,
    });
  }
}

@Injectable({ providedIn: 'root' })
export class CurrentOrganizationService {
  private readonly store = inject(OrganizationStoreService);

  readonly activeOrganization = this.store.activeOrganization;
  readonly organizationId = this.store.organizationId;
  readonly organizationName = computed(() => this.store.context().organizationName);
  readonly organizationType = computed(() => this.store.context().organizationType);
  readonly memberships = this.store.memberships;
  readonly canSwitch = this.store.canSwitch;

  snapshot() {
    const organization = this.store.activeOrganization();
    return {
      organizationId: organization?.id ?? null,
      organizationName: organization?.name ?? null,
      organizationType: organization?.type ?? null,
      role: organization?.membershipRole ?? null,
    };
  }
}
