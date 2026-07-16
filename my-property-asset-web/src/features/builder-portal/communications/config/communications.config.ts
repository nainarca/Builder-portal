import {
  BuilderCommunication,
  CommunicationAuditEvent,
  CommunicationFormModel,
  CommunicationType,
} from '../models/communication.model';

export const COMMUNICATION_WORKSPACE_HEADER = {
  eyebrow: 'Communication Hub',
  title: 'Owner communications',
  description:
    'Create announcements, progress updates, and reminders for owners after digital handover.',
};

export const COMMUNICATION_TYPE_OPTIONS: readonly {
  value: CommunicationType;
  label: string;
}[] = [
  { value: 'construction-progress-update', label: 'Construction Progress Update' },
  { value: 'project-completion-update', label: 'Project Completion Update' },
  { value: 'new-project-launch', label: 'New Project Launch' },
  { value: 'new-project-promotion', label: 'New Project Promotion' },
  { value: 'festival-greetings', label: 'Festival Greetings' },
  { value: 'maintenance-notice', label: 'Maintenance Notice' },
  { value: 'emergency-notice', label: 'Emergency Notice' },
  { value: 'general-announcement', label: 'General Announcement' },
  { value: 'offer-promotion', label: 'Offer / Promotion' },
  { value: 'payment-reminder', label: 'Payment Reminder' },
  { value: 'subscription-reminder', label: 'Subscription Reminder' },
  { value: 'document-reminder', label: 'Document Reminder' },
  { value: 'welcome-message', label: 'Welcome Message' },
  { value: 'custom-message', label: 'Custom Message' },
];

export const COMMUNICATION_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
] as const;

export const COMMUNICATION_AUDIENCE_OPTIONS = [
  { value: 'all_owners', label: 'All Owners' },
  { value: 'by_project', label: 'Owners by Project' },
  { value: 'by_building', label: 'Owners by Building' },
  { value: 'by_unit', label: 'Owners by Unit' },
  { value: 'selected_owners', label: 'Selected Owners' },
  { value: 'by_property_type', label: 'Owners by Property Type' },
] as const;

export const COMMUNICATION_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
  { value: 'expired', label: 'Expired' },
  { value: 'archived', label: 'Archived' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export const DEFAULT_COMMUNICATION_FORM: CommunicationFormModel = {
  communicationType: 'general-announcement',
  title: '',
  shortDescription: '',
  detailedContent: '',
  bannerImageUrl: '',
  attachmentUrl: '',
  ctaLabel: '',
  ctaExternalUrl: '',
  ctaInternalRoute: '',
  priority: 'normal',
  audienceType: 'all_owners',
  audienceConfig: {},
  publishAt: '',
  startAt: '',
  expiresAt: '',
};

export const MOCK_COMMUNICATIONS: readonly BuilderCommunication[] = [
  {
    id: 'comm-001',
    organizationId: 'org-builder-demo',
    communicationType: 'construction-progress-update',
    title: 'Tower A — Floor 12 slab complete',
    shortDescription: 'Construction milestone reached at Horizon Towers.',
    detailedContent:
      '<p>We are pleased to share that the floor 12 slab casting for Tower A has been completed ahead of schedule.</p>',
    bannerImageUrl: '',
    attachmentUrl: '',
    cta: { label: 'View progress', internalRoute: '/owner/projects/horizon-towers' },
    priority: 'normal',
    audienceType: 'by_project',
    audienceConfig: { projectId: 'proj-001' },
    status: 'published',
    publishAt: '2026-07-10T10:00:00Z',
    startAt: '2026-07-10T10:00:00Z',
    expiresAt: '2026-08-10T10:00:00Z',
    recipientCount: 42,
    deliveryStatus: 'delivered',
    moderated: false,
    disabledByPlatform: false,
    createdAt: '2026-07-09T08:00:00Z',
    updatedAt: '2026-07-10T10:05:00Z',
    publishedAt: '2026-07-10T10:05:00Z',
    createdBy: 'Marcus Rivera',
    publishedBy: 'Marcus Rivera',
  },
  {
    id: 'comm-002',
    organizationId: 'org-builder-demo',
    communicationType: 'festival-greetings',
    title: 'Happy Diwali from Horizon Builders',
    shortDescription: 'Seasonal greetings to all homeowners.',
    detailedContent: '<p>Wishing you and your family a joyful and prosperous Diwali.</p>',
    cta: {},
    priority: 'low',
    audienceType: 'all_owners',
    audienceConfig: {},
    status: 'scheduled',
    publishAt: '2026-10-20T06:00:00Z',
    startAt: '2026-10-20T06:00:00Z',
    recipientCount: 86,
    deliveryStatus: 'prepared',
    moderated: false,
    disabledByPlatform: false,
    createdAt: '2026-07-12T11:00:00Z',
    updatedAt: '2026-07-12T11:00:00Z',
    createdBy: 'Builder Admin',
  },
  {
    id: 'comm-003',
    organizationId: 'org-builder-demo',
    communicationType: 'document-reminder',
    title: 'Pending registration documents',
    shortDescription: 'Reminder to upload outstanding handover documents.',
    detailedContent: '<p>Please review your pending document checklist in the owner app.</p>',
    cta: { label: 'Open documents', internalRoute: '/owner/documents' },
    priority: 'high',
    audienceType: 'selected_owners',
    audienceConfig: { ownerIds: ['owner-002', 'owner-003'] },
    status: 'draft',
    recipientCount: 2,
    deliveryStatus: 'prepared',
    moderated: false,
    disabledByPlatform: false,
    createdAt: '2026-07-14T09:30:00Z',
    updatedAt: '2026-07-14T09:30:00Z',
    createdBy: 'Builder Staff',
  },
];

export const MOCK_COMMUNICATION_AUDIT: readonly CommunicationAuditEvent[] = [
  {
    id: 'audit-comm-1',
    campaignId: 'comm-001',
    organizationId: 'org-builder-demo',
    action: 'created',
    actorLabel: 'Marcus Rivera',
    createdAt: '2026-07-09T08:00:00Z',
  },
  {
    id: 'audit-comm-2',
    campaignId: 'comm-001',
    organizationId: 'org-builder-demo',
    action: 'published',
    actorLabel: 'Marcus Rivera',
    detail: 'Delivered to 42 owners',
    createdAt: '2026-07-10T10:05:00Z',
  },
];
