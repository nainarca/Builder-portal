import {
  Owner,
  OwnerAssignment,
  OwnerSavedView,
  OwnerTableColumn,
} from '../models/owner.model';

export const OWNER_WORKSPACE_HEADER = {
  eyebrow: 'Customer management',
  title: 'Owners & assignments',
  description: 'Track prospective owners, unit assignments, and invitation status across every project.',
};

export const OWNER_TABLE_COLUMNS: readonly OwnerTableColumn[] = [
  { id: 'name', label: 'Owner', sortable: true, defaultVisible: true },
  { id: 'contact', label: 'Contact', sortable: false, defaultVisible: true },
  { id: 'unit', label: 'Assigned unit', sortable: false, defaultVisible: true },
  { id: 'activation', label: 'Activation', sortable: true, defaultVisible: true },
  { id: 'invitation', label: 'Invitation', sortable: false, defaultVisible: true },
  { id: 'updatedAt', label: 'Last updated', sortable: true, defaultVisible: false },
];

export const OWNER_SAVED_VIEWS: readonly OwnerSavedView[] = [
  { id: 'all', name: 'All owners', activationFilter: 'all', invitationFilter: 'all', isDefault: true },
  { id: 'pending', name: 'Pending invitations', activationFilter: 'all', invitationFilter: 'pending' },
  { id: 'activated', name: 'Activated owners', activationFilter: 'activated', invitationFilter: 'all' },
  { id: 'prospects', name: 'Prospects (unassigned)', activationFilter: 'not-invited', invitationFilter: 'all' },
];

export const OWNER_ACTIVATION_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Not invited', value: 'not-invited' },
  { label: 'Invited', value: 'invited' },
  { label: 'Activated', value: 'activated' },
] as const;

export const OWNER_INVITATION_OPTIONS = [
  { label: 'All invitations', value: 'all' },
  { label: 'Not sent', value: 'not-sent' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Expired', value: 'expired' },
  { label: 'Cancelled', value: 'cancelled' },
] as const;

export const OWNER_SORT_OPTIONS = [
  { label: 'Name A–Z', value: 'name:asc' },
  { label: 'Name Z–A', value: 'name:desc' },
  { label: 'Recently updated', value: 'updatedAt:desc' },
  { label: 'Recently created', value: 'createdAt:desc' },
] as const;

export const MOCK_OWNERS: readonly Owner[] = [
  {
    id: 'owner-001', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@example.com',
    phone: '+91 98200 11122', city: 'Gurugram', state: 'Haryana', country: 'India',
    activationStatus: 'activated', archived: false,
    createdAt: '2026-02-10T09:00:00Z', updatedAt: '2026-07-10T09:00:00Z',
  },
  {
    id: 'owner-002', firstName: 'Rohan', lastName: 'Mehta', email: 'rohan.mehta@example.com',
    phone: '+91 98200 22233', city: 'Gurugram', state: 'Haryana', country: 'India',
    activationStatus: 'activated', archived: false,
    createdAt: '2026-01-20T09:00:00Z', updatedAt: '2026-04-15T09:00:00Z',
  },
  {
    id: 'owner-003', firstName: 'Ananya', lastName: 'Iyer', email: 'ananya.iyer@example.com',
    phone: '+91 98200 33344', city: 'Gurugram', state: 'Haryana', country: 'India',
    activationStatus: 'invited', archived: false,
    createdAt: '2026-05-01T09:00:00Z', updatedAt: '2026-07-09T09:00:00Z',
  },
  {
    id: 'owner-004', firstName: 'Vikram', lastName: 'Nair', email: 'vikram.nair@example.com',
    phone: '+91 98200 44455', city: 'Gurugram', state: 'Haryana', country: 'India',
    activationStatus: 'invited', archived: false,
    createdAt: '2026-05-15T09:00:00Z', updatedAt: '2026-07-08T09:00:00Z',
  },
  {
    id: 'owner-005', firstName: 'Sanjay', lastName: 'Gupta', email: 'sanjay.gupta@example.com',
    phone: '+91 98200 55566', city: 'Pune', state: 'Maharashtra', country: 'India',
    activationStatus: 'activated', archived: false,
    createdAt: '2025-11-01T09:00:00Z', updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'owner-006', firstName: 'Meera', lastName: 'Pillai', email: 'meera.pillai@example.com',
    phone: '+91 98200 66677', city: 'Pune', state: 'Maharashtra', country: 'India',
    activationStatus: 'invited', archived: false,
    createdAt: '2025-12-01T09:00:00Z', updatedAt: '2026-02-05T09:00:00Z',
  },
  {
    id: 'owner-007', firstName: 'Arjun', lastName: 'Malhotra', email: 'arjun.malhotra@example.com',
    phone: '+91 98200 77788', city: 'Pune', state: 'Maharashtra', country: 'India',
    activationStatus: 'invited', archived: false,
    createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
  {
    id: 'owner-008', firstName: 'Divya', lastName: 'Krishnan', email: 'divya.krishnan@example.com',
    phone: '+91 98200 88899', city: 'Gurugram', state: 'Haryana', country: 'India',
    activationStatus: 'not-invited', archived: false,
    createdAt: '2026-06-10T09:00:00Z', updatedAt: '2026-07-05T09:00:00Z',
  },
  {
    id: 'owner-009', firstName: 'Kavita', lastName: 'Reddy', email: 'kavita.reddy@example.com',
    phone: '+91 98200 99900', city: 'Bengaluru', state: 'Karnataka', country: 'India',
    activationStatus: 'not-invited', archived: false,
    createdAt: '2026-07-01T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  {
    id: 'owner-010', firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@example.com',
    phone: '+91 98200 10011', city: 'Mumbai', state: 'Maharashtra', country: 'India',
    activationStatus: 'not-invited', archived: false,
    createdAt: '2026-07-05T09:00:00Z', updatedAt: '2026-07-05T09:00:00Z',
  },
];

export const MOCK_ASSIGNMENTS: readonly OwnerAssignment[] = [
  {
    id: 'assign-001', ownerId: 'owner-001', ownerName: 'Priya Sharma',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-002', unitNumber: 'A-204', towerName: 'Tower A',
    status: 'active', assignedAt: '2026-02-12T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-001', status: 'accepted', sentAt: '2026-02-13T09:00:00Z', expiresAt: '2026-02-20T09:00:00Z',
      acceptedAt: '2026-02-16T09:00:00Z', resendCount: 0, remindersSent: 0,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit A-204', description: 'Assigned by Builder Admin', timestamp: '2026-02-12T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Invitation sent', description: 'Sent to priya.sharma@example.com', timestamp: '2026-02-13T09:00:00Z', icon: 'pi pi-send', tone: 'info' },
      { id: 'a3', title: 'Invitation accepted', description: 'Owner accepted the invitation', timestamp: '2026-02-16T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' },
    ],
  },
  {
    id: 'assign-002', ownerId: 'owner-002', ownerName: 'Rohan Mehta',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-001', unitNumber: 'A-101', towerName: 'Tower A',
    status: 'active', assignedAt: '2026-01-22T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-002', status: 'accepted', sentAt: '2026-01-23T09:00:00Z', expiresAt: '2026-01-30T09:00:00Z',
      acceptedAt: '2026-01-25T09:00:00Z', resendCount: 0, remindersSent: 0,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit A-101', description: 'Assigned by Builder Admin', timestamp: '2026-01-22T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Invitation accepted', description: 'Owner accepted the invitation', timestamp: '2026-01-25T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' },
      { id: 'a3', title: 'Handover completed', description: 'Unit handed over to owner', timestamp: '2026-04-15T09:00:00Z', icon: 'pi pi-key', tone: 'success' },
    ],
  },
  {
    id: 'assign-003', ownerId: 'owner-003', ownerName: 'Ananya Iyer',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-003', unitNumber: 'A-305', towerName: 'Tower A',
    status: 'active', assignedAt: '2026-05-02T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-003', status: 'pending', sentAt: '2026-07-09T09:00:00Z', expiresAt: '2026-07-16T09:00:00Z',
      resendCount: 0, remindersSent: 0,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit A-305', description: 'Assigned by Builder Admin', timestamp: '2026-05-02T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Invitation sent', description: 'Sent to ananya.iyer@example.com', timestamp: '2026-07-09T09:00:00Z', icon: 'pi pi-send', tone: 'info' },
    ],
  },
  {
    id: 'assign-004', ownerId: 'owner-004', ownerName: 'Vikram Nair',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-007', unitNumber: 'B-202', towerName: 'Tower B',
    status: 'active', assignedAt: '2026-05-16T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-004', status: 'pending', sentAt: '2026-07-08T09:00:00Z', expiresAt: '2026-07-15T09:00:00Z',
      resendCount: 1, remindersSent: 1,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit B-202', description: 'Assigned by Builder Admin', timestamp: '2026-05-16T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Reminder sent', description: 'Follow-up reminder sent', timestamp: '2026-07-08T09:00:00Z', icon: 'pi pi-bell', tone: 'warning' },
    ],
  },
  {
    id: 'assign-005', ownerId: 'owner-005', ownerName: 'Sanjay Gupta',
    projectId: 'proj-002', projectName: 'Skyline Residences', unitId: 'unit-010', unitNumber: '1-01', towerName: 'Tower 1',
    status: 'active', assignedAt: '2025-11-05T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-005', status: 'accepted', sentAt: '2025-11-06T09:00:00Z', expiresAt: '2025-11-13T09:00:00Z',
      acceptedAt: '2025-11-08T09:00:00Z', resendCount: 0, remindersSent: 0,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit 1-01', description: 'Assigned by Builder Admin', timestamp: '2025-11-05T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Handover completed', description: 'Unit handed over to owner', timestamp: '2026-01-15T09:00:00Z', icon: 'pi pi-key', tone: 'success' },
    ],
  },
  {
    id: 'assign-006', ownerId: 'owner-006', ownerName: 'Meera Pillai',
    projectId: 'proj-002', projectName: 'Skyline Residences', unitId: 'unit-011', unitNumber: '1-505', towerName: 'Tower 1',
    status: 'active', assignedAt: '2025-12-03T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-006', status: 'expired', sentAt: '2025-12-04T09:00:00Z', expiresAt: '2025-12-11T09:00:00Z',
      resendCount: 0, remindersSent: 1,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit 1-505', description: 'Assigned by Builder Admin', timestamp: '2025-12-03T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Invitation expired', description: 'Owner did not respond in time', timestamp: '2025-12-11T09:00:00Z', icon: 'pi pi-exclamation-triangle', tone: 'warning' },
    ],
  },
  {
    id: 'assign-007', ownerId: 'owner-007', ownerName: 'Arjun Malhotra',
    projectId: 'proj-002', projectName: 'Skyline Residences', unitId: 'unit-012', unitNumber: '1-1002', towerName: 'Tower 1',
    status: 'active', assignedAt: '2026-06-02T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-007', status: 'cancelled', sentAt: '2026-06-03T09:00:00Z', cancelledAt: '2026-06-20T09:00:00Z',
      resendCount: 0, remindersSent: 0,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit 1-1002', description: 'Assigned by Builder Admin', timestamp: '2026-06-02T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Invitation cancelled', description: 'Cancelled by Builder Admin', timestamp: '2026-06-20T09:00:00Z', icon: 'pi pi-times-circle', tone: 'danger' },
    ],
  },
  {
    id: 'assign-008', ownerId: 'owner-008', ownerName: 'Divya Krishnan',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-005', unitNumber: 'A-701', towerName: 'Tower A',
    status: 'removed', assignedAt: '2026-06-11T09:00:00Z', assignedBy: 'Builder Admin',
    invitation: {
      id: 'inv-008', status: 'cancelled', sentAt: '2026-06-12T09:00:00Z', cancelledAt: '2026-07-01T09:00:00Z',
      resendCount: 0, remindersSent: 0,
    },
    activity: [
      { id: 'a1', title: 'Assigned to unit A-701', description: 'Assigned by Builder Admin', timestamp: '2026-06-11T09:00:00Z', icon: 'pi pi-building', tone: 'primary' },
      { id: 'a2', title: 'Assignment removed', description: 'Owner withdrew interest', timestamp: '2026-07-01T09:00:00Z', icon: 'pi pi-times', tone: 'danger' },
    ],
  },
];
