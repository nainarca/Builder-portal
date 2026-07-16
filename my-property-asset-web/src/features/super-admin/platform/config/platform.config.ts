import {
  PlatformAnalyticsModel,
  PlatformAuditEvent,
  SupportTicket,
} from '../models/platform.model';

export const PLATFORM_SUPPORT_HEADER = {
  eyebrow: 'Support Center',
  title: 'Builder support queue',
  description: 'Track builder tickets, contact builders, and capture internal notes. CRM integrations are placeholders for later.',
};

export const PLATFORM_ANALYTICS_HEADER = {
  eyebrow: 'Analytics',
  title: 'Platform analytics',
  description: 'Growth, usage, and commercial signals across builders. Revenue charts are placeholders until billing settlement is live.',
};

export const PLATFORM_BRANDING_OVERSIGHT_HEADER = {
  eyebrow: 'White label',
  title: 'Branding oversight',
  description: 'Review builder branding status, reset, disable, or restore platform defaults.',
};

export const MOCK_AUDIT_EVENTS: readonly PlatformAuditEvent[] = [
  {
    id: 'aud-001',
    organizationId: 'org-builder-demo',
    actorLabel: 'super-admin@mypropertyasset.com',
    category: 'subscription',
    action: 'plan_assigned',
    entityType: 'subscription',
    entityId: 'sub-demo-001',
    summary: 'Professional plan assigned to demo builder',
    createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'aud-002',
    organizationId: 'org-builder-demo',
    actorLabel: 'owner@horizon.test',
    category: 'builder_login',
    action: 'login_success',
    summary: 'Builder owner signed in',
    createdAt: '2026-07-15T09:12:00Z',
  },
  {
    id: 'aud-003',
    organizationId: 'org-builder-demo',
    actorLabel: 'admin@horizon.test',
    category: 'branding',
    action: 'branding_updated',
    summary: 'Primary brand color updated',
    createdAt: '2026-07-15T10:05:00Z',
  },
  {
    id: 'aud-004',
    organizationId: 'org-builder-demo',
    actorLabel: 'admin@horizon.test',
    category: 'project',
    action: 'project_created',
    entityType: 'project',
    summary: 'New project created',
    createdAt: '2026-07-15T11:20:00Z',
  },
  {
    id: 'aud-005',
    actorLabel: 'system',
    category: 'system',
    action: 'health_check',
    summary: 'Platform health check completed',
    createdAt: '2026-07-16T06:00:00Z',
  },
];

export const MOCK_SUPPORT_TICKETS: readonly SupportTicket[] = [
  {
    id: 'tkt-001',
    organizationId: 'org-builder-demo',
    builderCompanyName: 'Horizon Builders',
    subject: 'Trial extension request',
    description: 'Need 7 more days to complete onboarding.',
    status: 'open',
    priority: 'high',
    contactEmail: 'owner@horizon.test',
    assignedTo: undefined,
    internalNotes: 'Eligible for trial extension via billing admin.',
    createdAt: '2026-07-14T10:00:00Z',
    updatedAt: '2026-07-14T10:00:00Z',
  },
  {
    id: 'tkt-002',
    organizationId: 'org-skyline',
    builderCompanyName: 'Skyline Residences',
    subject: 'White-label logo upload issue',
    description: 'Logo preview not refreshing after save.',
    status: 'in_progress',
    priority: 'normal',
    contactEmail: 'ops@skyline.test',
    assignedTo: 'Support Desk',
    internalNotes: 'Reproduced in staging. Branding reset workaround shared.',
    createdAt: '2026-07-13T08:30:00Z',
    updatedAt: '2026-07-15T12:00:00Z',
  },
];

export const MOCK_ANALYTICS: PlatformAnalyticsModel = {
  builderGrowth: [
    { label: 'Feb', value: 38 },
    { label: 'Mar', value: 42 },
    { label: 'Apr', value: 47 },
    { label: 'May', value: 51 },
    { label: 'Jun', value: 54 },
    { label: 'Jul', value: 58 },
  ],
  subscriptionRevenuePlaceholder: [
    { label: 'Feb', value: 12.4 },
    { label: 'Mar', value: 13.1 },
    { label: 'Apr', value: 14.8 },
    { label: 'May', value: 15.2 },
    { label: 'Jun', value: 16.0 },
    { label: 'Jul', value: 17.5 },
  ],
  projectGrowth: [
    { label: 'Feb', value: 210 },
    { label: 'Mar', value: 228 },
    { label: 'Apr', value: 241 },
    { label: 'May', value: 255 },
    { label: 'Jun', value: 268 },
    { label: 'Jul', value: 280 },
  ],
  ownerGrowth: [
    { label: 'Feb', value: 4200 },
    { label: 'Mar', value: 4480 },
    { label: 'Apr', value: 4710 },
    { label: 'May', value: 5020 },
    { label: 'Jun', value: 5310 },
    { label: 'Jul', value: 5600 },
  ],
  handoverTrends: [
    { label: 'Feb', value: 88 },
    { label: 'Mar', value: 96 },
    { label: 'Apr', value: 104 },
    { label: 'May', value: 112 },
    { label: 'Jun', value: 121 },
    { label: 'Jul', value: 130 },
  ],
  storageUsageGb: 1840,
  communicationActivity: 126,
  systemUsageScore: 92,
};
