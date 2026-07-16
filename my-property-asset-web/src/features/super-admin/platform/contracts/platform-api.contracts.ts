/**
 * P16 Super Admin Platform — API contracts
 */

export const PLATFORM_API_ROUTES = {
  dashboard: 'GET /api/v1/platform/dashboard',
  builders: 'GET /api/v1/platform/builders',
  builderLifecycle: 'POST /api/v1/platform/builders/:id/{activate|deactivate|suspend|reactivate|soft-delete}',
  subscriptions: 'GET /api/v1/platform/subscriptions',
  brandingOversight: 'GET /api/v1/platform/branding',
  brandingAction: 'POST /api/v1/platform/branding/:orgId/{reset|disable|restore}',
  communications: 'GET /api/v1/platform/communications',
  communicationModerate: 'POST /api/v1/platform/communications/:id/{disable|archive}',
  analytics: 'GET /api/v1/platform/analytics',
  audit: 'GET /api/v1/platform/audit',
  settings: 'GET|PATCH /api/v1/platform/settings',
  supportTickets: 'GET|POST /api/v1/platform/support/tickets',
  supportTicketUpdate: 'PATCH /api/v1/platform/support/tickets/:id',
} as const;

export interface PlatformDashboardResponse {
  metrics: {
    totalBuilders: number;
    activeBuilders: number;
    trialBuilders: number;
    expiredBuilders: number;
    totalProjects: number;
    totalUnits: number;
    totalActiveOwners: number;
    totalDigitalHandovers: number;
    storageUsageGb: number;
    monthlyGrowthPercent: number;
    platformHealth: string;
  };
  recentActivity: Array<{ id: string; summary: string; createdAt: string }>;
}
