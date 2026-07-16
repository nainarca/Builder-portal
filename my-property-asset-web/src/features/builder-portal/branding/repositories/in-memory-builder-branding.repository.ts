import { Injectable } from '@angular/core';

import {
  DEFAULT_BUILDER_BRANDING,
  createBrandingProfile,
} from '../config/builder-branding.config';
import {
  BuilderBrandingFormModel,
  BuilderBrandingProfile,
} from '../models/builder-branding.model';
import { BuilderBrandingRepository } from './builder-branding.repository';

@Injectable({ providedIn: 'root' })
export class InMemoryBuilderBrandingRepository extends BuilderBrandingRepository {
  private readonly records = new Map<string, BuilderBrandingProfile>([
    ['org-builder-demo', createBrandingProfile('org-builder-demo')],
    ['org-001', createBrandingProfile('org-001', { displayName: 'Horizon Builders', shortName: 'Horizon' })],
  ]);

  getByOrganizationId(organizationId: string): BuilderBrandingProfile | undefined {
    return this.records.get(organizationId);
  }

  upsert(organizationId: string, model: BuilderBrandingFormModel): BuilderBrandingProfile {
    const updated: BuilderBrandingProfile = {
      organizationId,
      ...model,
      lastUpdatedAt: new Date().toISOString(),
    };
    this.records.set(organizationId, updated);
    return updated;
  }

  reset(organizationId: string): BuilderBrandingProfile {
    const record = createBrandingProfile(organizationId);
    this.records.set(organizationId, record);
    return record;
  }

  disable(organizationId: string): BuilderBrandingProfile | undefined {
    const current = this.records.get(organizationId);
    if (!current) {
      return undefined;
    }
    const updated = { ...current, enabled: false, lastUpdatedAt: new Date().toISOString() };
    this.records.set(organizationId, updated);
    return updated;
  }

  restoreDefault(organizationId: string): BuilderBrandingProfile {
    return this.upsert(organizationId, {
      ...DEFAULT_BUILDER_BRANDING,
      socialLinks: { ...DEFAULT_BUILDER_BRANDING.socialLinks },
      media: { ...DEFAULT_BUILDER_BRANDING.media },
      theme: { ...DEFAULT_BUILDER_BRANDING.theme },
    });
  }
}
