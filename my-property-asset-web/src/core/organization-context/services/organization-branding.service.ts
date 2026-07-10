import { Injectable, inject } from '@angular/core';

import { ApplicationEventBusService } from '@infrastructure/events';
import { PLATFORM_BRAND } from '@theme/config';
import { BrandConfiguration } from '@theme/models';
import { ThemeService } from '@theme/services/theme.service';
import { Organization, OrganizationMembership } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationBrandingService {
  private readonly theme = inject(ThemeService);
  private readonly eventBus = inject(ApplicationEventBusService);

  applyForMembership(membership: OrganizationMembership | null): void {
    if (!membership) {
      this.applyPlatformBrand();
      return;
    }

    const brand = this.toBrandConfiguration(membership);
    if (membership.organizationType === 'builder') {
      this.theme.applyBuilderBrand(brand);
    } else {
      this.theme.applyOrganizationBrand(brand);
    }

    this.eventBus.publish({
      type: 'theme.brand.applied',
      payload: { organizationId: membership.organizationId, brandId: brand.id },
      timestamp: Date.now(),
    });
  }

  applyForOrganization(organization: Organization | null): void {
    if (!organization) {
      this.applyPlatformBrand();
      return;
    }

    this.applyForMembership({
      organizationId: organization.id,
      organizationName: organization.name,
      organizationType: organization.type,
      role: organization.membershipRole,
      branding: organization.branding,
    });
  }

  applyPlatformBrand(): void {
    this.theme.applyOrganizationBrand(PLATFORM_BRAND);
    this.eventBus.publish({
      type: 'theme.brand.applied',
      payload: { brandId: PLATFORM_BRAND.id },
      timestamp: Date.now(),
    });
  }

  private toBrandConfiguration(membership: OrganizationMembership): BrandConfiguration {
    const branding = membership.branding;

    return {
      id: branding?.id ?? membership.organizationId,
      type: membership.organizationType === 'builder' ? 'builder' : 'organization',
      name: branding?.name ?? membership.organizationName,
      shortName: branding?.shortName ?? membership.organizationName.slice(0, 3).toUpperCase(),
      primaryColor: branding?.primaryColor,
      logo: branding?.logo ?? {
        src: 'assets/branding/platform/logo-compact.svg',
        alt: membership.organizationName,
      },
      logoVariants: {
        light: {
          src: branding?.logo?.src ?? 'assets/branding/platform/logo-light.svg',
          alt: membership.organizationName,
        },
        dark: {
          src: branding?.logo?.src ?? 'assets/branding/platform/logo-dark.svg',
          alt: membership.organizationName,
        },
        compact: {
          src: branding?.logo?.src ?? 'assets/branding/platform/logo-compact.svg',
          alt: membership.organizationName,
        },
        loading: {
          src: 'assets/branding/platform/logo-loading.svg',
          alt: membership.organizationName,
        },
      },
    };
  }
}
