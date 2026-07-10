import { PlatformRole } from '@core/rbac/models/permission.model';
import { BrandConfiguration } from '@theme/models';

export type OrganizationType = 'platform' | 'builder' | 'owner' | 'partner' | 'marketplace' | 'support';

export interface OrganizationSummary {
  id: string;
  name: string;
  shortName?: string;
  type: OrganizationType;
  logoUrl?: string;
  primaryColor?: string;
}

export interface OrganizationMembership {
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  role: PlatformRole;
  isDefault?: boolean;
  branding?: Partial<BrandConfiguration>;
}

export interface OrganizationPreferences {
  defaultOrganizationId?: string | null;
  lastUsedOrganizationId?: string | null;
}

export interface OrganizationSettings {
  whiteLabelEnabled?: boolean;
  supportAccessEnabled?: boolean;
}

export interface OrganizationMetadata {
  slug?: string;
  region?: string;
  plan?: string;
}

export interface Organization extends OrganizationSummary {
  membershipRole: PlatformRole;
  settings?: OrganizationSettings;
  metadata?: OrganizationMetadata;
  branding?: Partial<BrandConfiguration>;
}

export interface OrganizationContextState {
  resolved: boolean;
  loading: boolean;
  switching: boolean;
  organizationId: string | null;
  organizationName: string | null;
  organizationType: OrganizationType | null;
  activeOrganization: Organization | null;
  memberships: readonly OrganizationMembership[];
  canSwitch: boolean;
  error: string | null;
}

export interface ActiveOrganizationSnapshot {
  organizationId: string | null;
  organizationName: string | null;
  organizationType: OrganizationType | null;
  role: PlatformRole | null;
}
