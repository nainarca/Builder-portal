import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { IconComponent } from '@shared/ui';
import { CurrentOrganizationService } from '../../services/organization-store.service';
import { OrganizationContextService } from '../../services/organization-context.service';
import { OrganizationStoreService } from '../../services/organization-store.service';

@Component({
  selector: 'app-organization-selector',
  imports: [IconComponent],
  templateUrl: './organization-selector.component.html',
  styleUrl: './organization-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationSelectorComponent {
  private readonly organizationContext = inject(OrganizationContextService);
  private readonly currentOrganization = inject(CurrentOrganizationService);
  private readonly store = inject(OrganizationStoreService);

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
}
