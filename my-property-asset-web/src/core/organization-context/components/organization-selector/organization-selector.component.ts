import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { CurrentUserService } from '@core/auth';
import { OrganizationMembership, OrganizationType } from '@core/organization-context/models/organization.model';
import { OrganizationCacheService } from '@core/organization-context/services/organization-cache.service';
import { IconComponent, StatusBadgeComponent } from '@shared/ui';

import { CurrentOrganizationService } from '../../services/organization-store.service';
import { OrganizationContextService } from '../../services/organization-context.service';
import { OrganizationStoreService } from '../../services/organization-store.service';

export type OrganizationSelectorVariant = 'header' | 'sidebar';

@Component({
  selector: 'app-organization-selector',
  imports: [TitleCasePipe, IconComponent, StatusBadgeComponent],
  templateUrl: './organization-selector.component.html',
  styleUrl: './organization-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'organization-selector-host',
    '[class.organization-selector-host--sidebar]': 'variant() === "sidebar"',
    '[class.organization-selector-host--compact]': 'compact()',
  },
})
export class OrganizationSelectorComponent {
  private readonly organizationContext = inject(OrganizationContextService);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly store = inject(OrganizationStoreService);
  private readonly cache = inject(OrganizationCacheService);
  private readonly currentUser = inject(CurrentUserService);

  /** Visual placement — header chrome vs sidebar workspace control (UI-REBIRTH §2). */
  readonly variant = input<OrganizationSelectorVariant>('header');
  /** Icon-only trigger (sidebar rail). */
  readonly compact = input(false);

  readonly panelOpen = signal(false);
  readonly switching = this.store.switching;

  readonly activeOrganization = this.currentOrganization.activeOrganization;
  readonly memberships = this.currentOrganization.memberships;
  readonly canSwitch = this.currentOrganization.canSwitch;

  readonly displayName = computed(() => {
    const organization = this.activeOrganization();
    if (organization) {
      return organization.name;
    }

    const context = this.store.context();
    return context.organizationName ?? 'MyPropertyAsset';
  });

  readonly displayType = computed(() => {
    const organization = this.activeOrganization();
    if (organization) {
      return organization.type;
    }

    return this.store.context().organizationType ?? 'platform';
  });

  readonly initials = computed(() => {
    const name = this.displayName();
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  });

  readonly recentMemberships = computed(() => {
    const activeId = this.currentOrganization.organizationId();
    const all = this.memberships();
    const userId = this.currentUser.getUserId();
    const lastUsedId = userId ? this.cache.getLastUsedOrganizationId(userId) : null;

    const recentIds = new Set<string>();
    const recent: OrganizationMembership[] = [];

    if (lastUsedId && lastUsedId !== activeId) {
      const match = all.find((m) => m.organizationId === lastUsedId);
      if (match) {
        recent.push(match);
        recentIds.add(match.organizationId);
      }
    }

    for (const membership of all) {
      if (recent.length >= 3) {
        break;
      }
      if (membership.organizationId === activeId || recentIds.has(membership.organizationId)) {
        continue;
      }
      recent.push(membership);
      recentIds.add(membership.organizationId);
    }

    return recent;
  });

  readonly otherMemberships = computed(() => {
    const activeId = this.currentOrganization.organizationId();
    const recentIds = new Set(this.recentMemberships().map((m) => m.organizationId));
    return this.memberships().filter(
      (m) => m.organizationId !== activeId && !recentIds.has(m.organizationId),
    );
  });

  togglePanel(): void {
    if (!this.canSwitch()) {
      return;
    }

    this.panelOpen.update((open) => !open);
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }

  async selectOrganization(organizationId: string): Promise<void> {
    if (organizationId === this.currentOrganization.organizationId()) {
      this.closePanel();
      return;
    }

    const switched = await this.organizationContext.switchOrganization(organizationId);
    if (switched) {
      this.closePanel();
    }
  }

  isActive(organizationId: string): boolean {
    return this.currentOrganization.organizationId() === organizationId;
  }

  typeSeverity(type: OrganizationType): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (type) {
      case 'builder':
        return 'info';
      case 'owner':
        return 'success';
      case 'partner':
        return 'warn';
      case 'marketplace':
        return 'contrast';
      default:
        return 'secondary';
    }
  }
}
