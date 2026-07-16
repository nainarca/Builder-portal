import { PermissionLevel, PlatformRole, ResourceId } from '../models/permission.model';

export type PermissionMatrix = Readonly<Record<ResourceId, Readonly<Partial<Record<PlatformRole, PermissionLevel>>>>>;

export const PERMISSION_MATRIX: PermissionMatrix = {
  'id-01-marketing-leads': {
    'super-admin': 'read',
    'builder-org-owner': 'read',
    'builder-org-admin': 'read',
    'builder-org-member': 'read',
    'owner-org-owner': 'read',
    'public-visitor': 'read',
  },
  'id-02-builder-onboarding': {
    'super-admin': 'decide',
    'public-visitor': 'contribute',
    'builder-org-owner': 'read',
  },
  'id-03-organization-tenancy': {
    'super-admin': 'full',
    'builder-org-owner': 'full',
    'builder-org-admin': 'operate',
    'builder-org-member': 'read',
    'owner-org-owner': 'full',
  },
  'id-04-white-label-branding': {
    'super-admin': 'full',
    'builder-org-owner': 'full',
    'builder-org-admin': 'full',
    'builder-org-member': 'read',
  },
  'id-05-subscription-commercial': {
    'super-admin': 'full',
    'builder-org-owner': 'read',
    'builder-org-admin': 'read',
  },
  'id-06-platform-operations': {
    'super-admin': 'full',
  },
  'id-07-project-unit': {
    'super-admin': 'delegated',
    'builder-org-owner': 'full',
    'builder-org-admin': 'full',
    'builder-org-member': 'contribute',
  },
  'id-08-owner-assignment-prospect': {
    'super-admin': 'delegated',
    'builder-org-owner': 'full',
    'builder-org-admin': 'full',
    'builder-org-member': 'contribute',
  },
  'id-09-handover-document': {
    'super-admin': 'delegated',
    'builder-org-owner': 'full',
    'builder-org-admin': 'full',
    'builder-org-member': 'contribute',
    'owner-org-owner': 'full',
  },
  'id-10-invitation': {
    'super-admin': 'delegated',
    'builder-org-owner': 'full',
    'builder-org-admin': 'full',
    'builder-org-member': 'contribute',
    'owner-org-owner': 'decide',
  },
  'id-11-notification': {
    'super-admin': 'own-read',
    'builder-org-owner': 'own-read',
    'builder-org-admin': 'own-read',
    'builder-org-member': 'own-read',
    'owner-org-owner': 'own-read',
  },
  'id-12-reporting-analytics': {
    'super-admin': 'full',
    'builder-org-owner': 'read',
    'builder-org-admin': 'read',
    'builder-org-member': 'read',
  },
  'id-13-owner-financial-property': {
    'owner-org-owner': 'full',
  },
  'id-14-user-identity-access': {
    'super-admin': 'full',
    'builder-org-owner': 'operate',
    'builder-org-admin': 'operate',
    'builder-org-member': 'own-read',
    'owner-org-owner': 'own-read',
  },
  'id-15-future-tenant': {},
  portal: {
    'super-admin': 'full',
    'builder-org-owner': 'full',
    'builder-org-admin': 'full',
    'builder-org-member': 'full',
    'owner-org-owner': 'full',
    'owner-web-user': 'full',
    'tenant-portal-user': 'full',
    'support-user': 'read',
  },
};

export const ROLE_PORTAL_ACCESS: Readonly<Partial<Record<PlatformRole, readonly string[]>>> = {
  'super-admin': ['portal:super-admin'],
  'builder-org-owner': ['portal:builder-portal'],
  'builder-org-admin': ['portal:builder-portal'],
  'builder-org-member': ['portal:builder-portal'],
  'owner-org-owner': ['portal:owner-web'],
  'owner-web-user': ['portal:owner-web'],
  'tenant-portal-user': ['portal:tenant-portal'],
  'support-user': ['portal:super-admin', 'portal:builder-portal'],
};

export const ROLE_REGISTRY: Readonly<Record<PlatformRole, { label: string; scope: string }>> = {
  'public-visitor': { label: 'Public Visitor', scope: 'platform' },
  'super-admin': { label: 'Super Admin', scope: 'platform' },
  'builder-org-owner': { label: 'Builder Organization Owner', scope: 'organization' },
  'builder-org-admin': { label: 'Builder Organization Admin', scope: 'organization' },
  'builder-org-member': { label: 'Builder Organization Member', scope: 'organization' },
  'owner-org-owner': { label: 'Owner Organization Owner', scope: 'organization' },
  'owner-web-user': { label: 'Owner Web User', scope: 'organization' },
  'tenant-portal-user': { label: 'Tenant Portal User', scope: 'organization' },
  'support-user': { label: 'Support User', scope: 'platform' },
};
