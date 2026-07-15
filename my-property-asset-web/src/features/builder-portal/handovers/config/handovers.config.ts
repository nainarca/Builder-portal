import {
  Handover,
  HandoverSavedView,
  HandoverStageDefinition,
  HandoverStageId,
  HandoverStageStatus,
  HandoverStageStatusValue,
  HandoverTableColumn,
} from '../models/handover.model';

export const HANDOVER_WORKSPACE_HEADER = {
  eyebrow: 'Digital property handover',
  title: 'Handovers',
  description: 'The end-to-end handover workflow — from initiation through owner acceptance — for every assigned unit.',
};

export const HANDOVER_STAGE_DEFINITIONS: readonly HandoverStageDefinition[] = [
  { id: 'initiated', label: 'Handover Initiated', description: 'The handover record has been created for this unit.', order: 1 },
  { id: 'document-verification', label: 'Document Verification', description: 'Required project and unit documents are reviewed and approved.', order: 2 },
  { id: 'inspection', label: 'Inspection', description: 'Site inspection of the unit prior to handover.', order: 3 },
  { id: 'snag-resolution', label: 'Snag Resolution', description: 'Identified defects are rectified and verified.', order: 4 },
  { id: 'appointment', label: 'Appointment Scheduling', description: 'A handover appointment is scheduled with the owner.', order: 5 },
  { id: 'digital-signature', label: 'Digital Signature', description: 'Handover documents are digitally signed.', order: 6 },
  { id: 'owner-acceptance', label: 'Owner Acceptance', description: 'The owner formally accepts the unit.', order: 7 },
  { id: 'completion', label: 'Completion', description: 'The handover is complete and the unit is transferred.', order: 8 },
];

const STAGE_ORDER: readonly HandoverStageId[] = HANDOVER_STAGE_DEFINITIONS.map((d) => d.id);

function buildStages(
  completedThrough: number,
  currentStatus: HandoverStageStatusValue = 'in-progress',
): readonly HandoverStageStatus[] {
  return STAGE_ORDER.map((stageId, index) => {
    if (index < completedThrough) {
      return { stageId, status: 'completed' as const };
    }
    if (index === completedThrough) {
      return { stageId, status: currentStatus };
    }
    return { stageId, status: 'upcoming' as const };
  });
}

export const HANDOVER_TABLE_COLUMNS: readonly HandoverTableColumn[] = [
  { id: 'unit', label: 'Unit', sortable: true, defaultVisible: true },
  { id: 'owner', label: 'Owner', sortable: true, defaultVisible: true },
  { id: 'stage', label: 'Current stage', sortable: false, defaultVisible: true },
  { id: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { id: 'progress', label: 'Progress', sortable: true, defaultVisible: true },
  { id: 'targetDate', label: 'Target date', sortable: true, defaultVisible: false },
];

export const HANDOVER_SAVED_VIEWS: readonly HandoverSavedView[] = [
  { id: 'all', name: 'All handovers', statusFilter: 'all', isDefault: true },
  { id: 'in-progress', name: 'In progress', statusFilter: 'in-progress' },
  { id: 'delayed', name: 'Delayed', statusFilter: 'delayed' },
  { id: 'completed', name: 'Completed', statusFilter: 'completed' },
];

export const HANDOVER_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Completed', value: 'completed' },
] as const;

export const HANDOVER_SORT_OPTIONS = [
  { label: 'Recently updated', value: 'updatedAt:desc' },
  { label: 'Unit A–Z', value: 'unitNumber:asc' },
  { label: 'Progress', value: 'overallProgress:desc' },
  { label: 'Target date', value: 'targetCompletionDate:asc' },
] as const;

export const MOCK_HANDOVERS: readonly Handover[] = [
  {
    id: 'handover-001', projectId: 'proj-001', projectName: 'Horizon Towers',
    unitId: 'unit-001', unitNumber: 'A-101', towerName: 'Tower A',
    ownerId: 'owner-002', ownerName: 'Rohan Mehta',
    overallStatus: 'completed', overallProgress: 100,
    targetCompletionDate: '2026-04-15T00:00:00Z',
    stages: buildStages(8),
    activity: [
      { id: 'a1', title: 'Handover initiated', description: 'Handover record created', timestamp: '2026-01-22T09:00:00Z', icon: 'pi pi-flag', tone: 'primary' },
      { id: 'a2', title: 'Documents verified', description: 'All required documents approved', timestamp: '2026-02-01T09:00:00Z', icon: 'pi pi-file', tone: 'info' },
      { id: 'a3', title: 'Handover completed', description: 'Unit transferred to owner', timestamp: '2026-04-15T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' },
    ],
    createdAt: '2026-01-22T09:00:00Z', updatedAt: '2026-04-15T09:00:00Z',
  },
  {
    id: 'handover-002', projectId: 'proj-002', projectName: 'Skyline Residences',
    unitId: 'unit-010', unitNumber: '1-01', towerName: 'Tower 1',
    ownerId: 'owner-005', ownerName: 'Sanjay Gupta',
    overallStatus: 'completed', overallProgress: 100,
    targetCompletionDate: '2026-01-15T00:00:00Z',
    stages: buildStages(8),
    activity: [
      { id: 'a1', title: 'Handover initiated', description: 'Handover record created', timestamp: '2025-11-05T09:00:00Z', icon: 'pi pi-flag', tone: 'primary' },
      { id: 'a2', title: 'Handover completed', description: 'Unit transferred to owner', timestamp: '2026-01-15T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' },
    ],
    createdAt: '2025-11-05T09:00:00Z', updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'handover-003', projectId: 'proj-001', projectName: 'Horizon Towers',
    unitId: 'unit-002', unitNumber: 'A-204', towerName: 'Tower A',
    ownerId: 'owner-001', ownerName: 'Priya Sharma',
    overallStatus: 'in-progress', overallProgress: 35,
    targetCompletionDate: '2026-08-30T00:00:00Z',
    stages: buildStages(2, 'in-progress'),
    activity: [
      { id: 'a1', title: 'Handover initiated', description: 'Handover record created', timestamp: '2026-02-12T09:00:00Z', icon: 'pi pi-flag', tone: 'primary' },
      { id: 'a2', title: 'Documents verified', description: 'All required documents approved', timestamp: '2026-02-16T09:00:00Z', icon: 'pi pi-file', tone: 'info' },
      { id: 'a3', title: 'Inspection scheduled', description: 'Site inspection in progress', timestamp: '2026-07-14T09:00:00Z', icon: 'pi pi-search', tone: 'info' },
    ],
    createdAt: '2026-02-12T09:00:00Z', updatedAt: '2026-07-14T09:00:00Z',
  },
  {
    id: 'handover-004', projectId: 'proj-002', projectName: 'Skyline Residences',
    unitId: 'unit-011', unitNumber: '1-505', towerName: 'Tower 1',
    ownerId: 'owner-006', ownerName: 'Meera Pillai',
    overallStatus: 'delayed', overallProgress: 38,
    targetCompletionDate: '2026-06-30T00:00:00Z',
    stages: buildStages(3, 'delayed'),
    activity: [
      { id: 'a1', title: 'Handover initiated', description: 'Handover record created', timestamp: '2025-12-03T09:00:00Z', icon: 'pi pi-flag', tone: 'primary' },
      { id: 'a2', title: 'Inspection completed', description: 'Site inspection passed', timestamp: '2026-05-01T09:00:00Z', icon: 'pi pi-search', tone: 'success' },
      { id: 'a3', title: 'Snag resolution delayed', description: 'Awaiting contractor rectification', timestamp: '2026-06-20T09:00:00Z', icon: 'pi pi-exclamation-triangle', tone: 'warning' },
    ],
    createdAt: '2025-12-03T09:00:00Z', updatedAt: '2026-06-20T09:00:00Z',
  },
  {
    id: 'handover-005', projectId: 'proj-001', projectName: 'Horizon Towers',
    unitId: 'unit-003', unitNumber: 'A-305', towerName: 'Tower A',
    ownerId: 'owner-003', ownerName: 'Ananya Iyer',
    overallStatus: 'pending', overallProgress: 19,
    targetCompletionDate: '2026-10-15T00:00:00Z',
    stages: buildStages(1, 'in-progress'),
    activity: [
      { id: 'a1', title: 'Handover initiated', description: 'Handover record created', timestamp: '2026-05-02T09:00:00Z', icon: 'pi pi-flag', tone: 'primary' },
      { id: 'a2', title: 'Document verification started', description: 'Awaiting outstanding documents', timestamp: '2026-07-09T09:00:00Z', icon: 'pi pi-file', tone: 'info' },
    ],
    createdAt: '2026-05-02T09:00:00Z', updatedAt: '2026-07-09T09:00:00Z',
  },
  {
    id: 'handover-006', projectId: 'proj-001', projectName: 'Horizon Towers',
    unitId: 'unit-007', unitNumber: 'B-202', towerName: 'Tower B',
    ownerId: 'owner-004', ownerName: 'Vikram Nair',
    overallStatus: 'pending', overallProgress: 19,
    targetCompletionDate: '2026-10-30T00:00:00Z',
    stages: buildStages(1, 'in-progress'),
    activity: [
      { id: 'a1', title: 'Handover initiated', description: 'Handover record created', timestamp: '2026-05-16T09:00:00Z', icon: 'pi pi-flag', tone: 'primary' },
      { id: 'a2', title: 'Document verification started', description: 'Awaiting outstanding documents', timestamp: '2026-07-08T09:00:00Z', icon: 'pi pi-file', tone: 'info' },
    ],
    createdAt: '2026-05-16T09:00:00Z', updatedAt: '2026-07-08T09:00:00Z',
  },
  {
    id: 'handover-007', projectId: 'proj-002', projectName: 'Skyline Residences',
    unitId: 'unit-012', unitNumber: '1-1002', towerName: 'Tower 1',
    ownerId: 'owner-007', ownerName: 'Arjun Malhotra',
    overallStatus: 'pending', overallProgress: 13,
    targetCompletionDate: '2026-11-30T00:00:00Z',
    stages: buildStages(1, 'upcoming'),
    activity: [
      { id: 'a1', title: 'Handover initiated', description: 'Handover record created', timestamp: '2026-06-02T09:00:00Z', icon: 'pi pi-flag', tone: 'primary' },
    ],
    createdAt: '2026-06-02T09:00:00Z', updatedAt: '2026-06-02T09:00:00Z',
  },
];
