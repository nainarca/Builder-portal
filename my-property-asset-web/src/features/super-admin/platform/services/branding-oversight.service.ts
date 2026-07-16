import { Injectable, computed, inject, signal } from '@angular/core';

import { BuilderBrandingService } from '@features/builder-portal/branding/services/builder-branding.service';
import { BuilderAdminStoreService } from '../../builders/services/builder-admin-store.service';
import { BrandingOversightItem } from '../models/platform.model';
import { PlatformAuditService } from './platform-audit.service';

@Injectable({ providedIn: 'root' })
export class BrandingOversightService {
  private readonly builders = inject(BuilderAdminStoreService);
  private readonly branding = inject(BuilderBrandingService);
  private readonly audit = inject(PlatformAuditService);
  private readonly version = signal(0);

  readonly items = computed<readonly BrandingOversightItem[]>(() => {
    this.version();
    return this.builders.builders().map((builder) => {
      const organizationId = builder.organizationId ?? builder.id;
      const profile = this.branding.getBrandingForOrganization(organizationId);
      const completion = this.branding.getCompletionForOrganization(organizationId);
      return {
        organizationId,
        builderName: builder.companyName,
        enabled: profile.enabled && builder.whiteLabelEnabled,
        completionPercent: completion.completionPercent,
        statusLabel: completion.statusLabel,
        lastUpdatedAt: profile.lastUpdatedAt,
      };
    });
  });

  reset(organizationId: string): void {
    this.branding.resetForOrganization(organizationId);
    this.audit.record('branding', 'branding_reset', `Branding reset for ${organizationId}`, {
      organizationId,
      entityType: 'branding',
      entityId: organizationId,
    });
    this.version.update((v) => v + 1);
  }

  disable(organizationId: string): void {
    this.branding.disableForOrganization(organizationId);
    this.audit.record('branding', 'branding_disabled', `Branding disabled for ${organizationId}`, {
      organizationId,
      entityType: 'branding',
      entityId: organizationId,
    });
    this.version.update((v) => v + 1);
  }

  restoreDefault(organizationId: string): void {
    this.branding.restoreDefaultForOrganization(organizationId);
    this.audit.record(
      'branding',
      'branding_restored',
      `Default branding restored for ${organizationId}`,
      {
        organizationId,
        entityType: 'branding',
        entityId: organizationId,
      },
    );
    this.version.update((v) => v + 1);
  }
}
