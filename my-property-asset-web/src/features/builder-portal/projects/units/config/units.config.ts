import { Tower, Unit, UnitSavedView, UnitTableColumn } from '../models/unit.model';

export const UNIT_TABLE_COLUMNS: readonly UnitTableColumn[] = [
  { id: 'unitNumber', label: 'Unit', sortable: true, defaultVisible: true },
  { id: 'tower', label: 'Tower', sortable: true, defaultVisible: true },
  { id: 'floor', label: 'Floor', sortable: true, defaultVisible: true },
  { id: 'type', label: 'Type', sortable: true, defaultVisible: true },
  { id: 'configuration', label: 'Configuration', sortable: false, defaultVisible: true },
  { id: 'area', label: 'Area (sqft)', sortable: true, defaultVisible: false },
  { id: 'status', label: 'Status', sortable: true, defaultVisible: true },
  { id: 'constructionStage', label: 'Construction stage', sortable: true, defaultVisible: true },
  { id: 'progress', label: 'Progress', sortable: true, defaultVisible: true },
];

export const UNIT_SAVED_VIEWS: readonly UnitSavedView[] = [
  { id: 'all', name: 'All units', statusFilter: 'all', stageFilter: 'all', isDefault: true },
  { id: 'available', name: 'Available', statusFilter: 'available', stageFilter: 'all' },
  { id: 'ready-for-handover', name: 'Ready for handover', statusFilter: 'all', stageFilter: 'ready-for-handover' },
  { id: 'reserved', name: 'Reserved', statusFilter: 'reserved', stageFilter: 'all' },
];

export const UNIT_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Sold', value: 'sold' },
  { label: 'Blocked', value: 'blocked' },
] as const;

export const UNIT_STAGE_OPTIONS = [
  { label: 'All stages', value: 'all' },
  { label: 'Not started', value: 'not-started' },
  { label: 'Foundation', value: 'foundation' },
  { label: 'Structure', value: 'structure' },
  { label: 'Finishing', value: 'finishing' },
  { label: 'Ready for handover', value: 'ready-for-handover' },
  { label: 'Handed over', value: 'handed-over' },
] as const;

export const UNIT_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Studio', value: 'studio' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Retail', value: 'retail' },
] as const;

export const UNIT_SORT_OPTIONS = [
  { label: 'Unit A–Z', value: 'unitNumber:asc' },
  { label: 'Unit Z–A', value: 'unitNumber:desc' },
  { label: 'Newest', value: 'createdAt:desc' },
  { label: 'Progress', value: 'progress:desc' },
  { label: 'Floor', value: 'floorNumber:asc' },
] as const;

export const MOCK_TOWERS: readonly Tower[] = [
  { id: 'tower-a', projectId: 'proj-001', name: 'Tower A', totalFloors: 10 },
  { id: 'tower-b', projectId: 'proj-001', name: 'Tower B', totalFloors: 10 },
  { id: 'tower-1', projectId: 'proj-002', name: 'Tower 1', totalFloors: 16 },
];

const EMPTY_SUMMARY = {
  ownerAssigned: false,
  documentsCount: 0,
  handoverStatus: 'not-started' as const,
  openSnags: 0,
  upcomingAppointments: 0,
};

export const MOCK_UNITS: readonly Unit[] = [
  {
    id: 'unit-001', projectId: 'proj-001', towerId: 'tower-a', towerName: 'Tower A', floorNumber: 1,
    unitNumber: 'A-101', code: 'HZT-A-101', unitType: 'apartment', configuration: '2BHK', areaSqft: 1150,
    status: 'sold', constructionStage: 'handed-over', progress: 100,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2025-06-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2025-11-01', status: 'completed' },
      { id: 'm3', label: 'Finishing', date: '2026-03-01', status: 'completed' },
      { id: 'm4', label: 'Handover', date: '2026-04-15', status: 'completed' },
    ],
    summary: { ownerAssigned: true, documentsCount: 12, handoverStatus: 'completed', openSnags: 0, upcomingAppointments: 0 },
    archived: false, createdAt: '2025-02-15T09:00:00Z', updatedAt: '2026-04-15T09:00:00Z',
  },
  {
    id: 'unit-002', projectId: 'proj-001', towerId: 'tower-a', towerName: 'Tower A', floorNumber: 2,
    unitNumber: 'A-204', code: 'HZT-A-204', unitType: 'apartment', configuration: '3BHK', areaSqft: 1480,
    status: 'sold', constructionStage: 'ready-for-handover', progress: 96,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2025-06-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2025-11-15', status: 'completed' },
      { id: 'm3', label: 'Finishing', date: '2026-06-01', status: 'completed' },
      { id: 'm4', label: 'Handover', date: '2026-07-20', status: 'in-progress' },
    ],
    summary: { ownerAssigned: true, documentsCount: 9, handoverStatus: 'in-progress', openSnags: 2, upcomingAppointments: 1 },
    archived: false, createdAt: '2025-02-15T09:00:00Z', updatedAt: '2026-07-10T09:00:00Z',
  },
  {
    id: 'unit-003', projectId: 'proj-001', towerId: 'tower-a', towerName: 'Tower A', floorNumber: 3,
    unitNumber: 'A-305', code: 'HZT-A-305', unitType: 'apartment', configuration: '2BHK', areaSqft: 1160,
    status: 'reserved', constructionStage: 'finishing', progress: 74,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2025-06-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2025-12-01', status: 'completed' },
      { id: 'm3', label: 'Finishing', date: '2026-08-01', status: 'in-progress' },
      { id: 'm4', label: 'Handover', date: '2026-10-01', status: 'upcoming' },
    ],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2025-02-15T09:00:00Z', updatedAt: '2026-07-09T09:00:00Z',
  },
  {
    id: 'unit-004', projectId: 'proj-001', towerId: 'tower-a', towerName: 'Tower A', floorNumber: 5,
    unitNumber: 'A-508', code: 'HZT-A-508', unitType: 'apartment', configuration: '3BHK', areaSqft: 1500,
    status: 'available', constructionStage: 'structure', progress: 48,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2025-06-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2026-09-01', status: 'in-progress' },
      { id: 'm3', label: 'Finishing', date: '2027-01-01', status: 'upcoming' },
      { id: 'm4', label: 'Handover', date: '2027-03-01', status: 'upcoming' },
    ],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2025-02-15T09:00:00Z', updatedAt: '2026-07-05T09:00:00Z',
  },
  {
    id: 'unit-005', projectId: 'proj-001', towerId: 'tower-a', towerName: 'Tower A', floorNumber: 7,
    unitNumber: 'A-701', code: 'HZT-A-701', unitType: 'penthouse', configuration: '4BHK Duplex', areaSqft: 2600,
    status: 'available', constructionStage: 'structure', progress: 45,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2025-06-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2026-09-15', status: 'in-progress' },
      { id: 'm3', label: 'Finishing', date: '2027-02-01', status: 'upcoming' },
      { id: 'm4', label: 'Handover', date: '2027-04-01', status: 'upcoming' },
    ],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2025-02-15T09:00:00Z', updatedAt: '2026-07-05T09:00:00Z',
  },
  {
    id: 'unit-006', projectId: 'proj-001', towerId: 'tower-a', towerName: 'Tower A', floorNumber: 9,
    unitNumber: 'A-902', code: 'HZT-A-902', unitType: 'apartment', configuration: '2BHK', areaSqft: 1140,
    status: 'blocked', constructionStage: 'not-started', progress: 5,
    milestones: [{ id: 'm1', label: 'Foundation', date: '2026-11-01', status: 'upcoming' }],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2025-02-15T09:00:00Z', updatedAt: '2026-06-20T09:00:00Z',
  },
  {
    id: 'unit-007', projectId: 'proj-001', towerId: 'tower-b', towerName: 'Tower B', floorNumber: 2,
    unitNumber: 'B-202', code: 'HZT-B-202', unitType: 'apartment', configuration: '2BHK', areaSqft: 1120,
    status: 'sold', constructionStage: 'finishing', progress: 68,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2025-07-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2026-01-01', status: 'completed' },
      { id: 'm3', label: 'Finishing', date: '2026-09-01', status: 'in-progress' },
    ],
    summary: { ownerAssigned: true, documentsCount: 6, handoverStatus: 'not-started', openSnags: 0, upcomingAppointments: 0 },
    archived: false, createdAt: '2025-03-01T09:00:00Z', updatedAt: '2026-07-08T09:00:00Z',
  },
  {
    id: 'unit-008', projectId: 'proj-001', towerId: 'tower-b', towerName: 'Tower B', floorNumber: 4,
    unitNumber: 'B-404', code: 'HZT-B-404', unitType: 'studio', configuration: 'Studio', areaSqft: 620,
    status: 'available', constructionStage: 'structure', progress: 40,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2025-07-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2026-10-01', status: 'in-progress' },
    ],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2025-03-01T09:00:00Z', updatedAt: '2026-07-01T09:00:00Z',
  },
  {
    id: 'unit-009', projectId: 'proj-001', towerId: 'tower-b', towerName: 'Tower B', floorNumber: 6,
    unitNumber: 'B-606', code: 'HZT-B-606', unitType: 'apartment', configuration: '3BHK', areaSqft: 1490,
    status: 'available', constructionStage: 'foundation', progress: 18,
    milestones: [{ id: 'm1', label: 'Foundation', date: '2026-08-01', status: 'in-progress' }],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2025-03-01T09:00:00Z', updatedAt: '2026-06-25T09:00:00Z',
  },
  {
    id: 'unit-010', projectId: 'proj-002', towerId: 'tower-1', towerName: 'Tower 1', floorNumber: 1,
    unitNumber: '1-01', code: 'SKR-1-01', unitType: 'commercial', configuration: 'Retail unit', areaSqft: 900,
    status: 'sold', constructionStage: 'handed-over', progress: 100,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2024-01-01', status: 'completed' },
      { id: 'm2', label: 'Structure', date: '2024-08-01', status: 'completed' },
      { id: 'm3', label: 'Finishing', date: '2025-10-01', status: 'completed' },
      { id: 'm4', label: 'Handover', date: '2026-01-15', status: 'completed' },
    ],
    summary: { ownerAssigned: true, documentsCount: 15, handoverStatus: 'completed', openSnags: 0, upcomingAppointments: 0 },
    archived: false, createdAt: '2023-12-01T09:00:00Z', updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'unit-011', projectId: 'proj-002', towerId: 'tower-1', towerName: 'Tower 1', floorNumber: 5,
    unitNumber: '1-505', code: 'SKR-1-505', unitType: 'apartment', configuration: '2BHK', areaSqft: 1080,
    status: 'sold', constructionStage: 'handed-over', progress: 100,
    milestones: [
      { id: 'm1', label: 'Foundation', date: '2024-01-01', status: 'completed' },
      { id: 'm2', label: 'Handover', date: '2026-02-01', status: 'completed' },
    ],
    summary: { ownerAssigned: true, documentsCount: 11, handoverStatus: 'completed', openSnags: 1, upcomingAppointments: 0 },
    archived: false, createdAt: '2023-12-01T09:00:00Z', updatedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'unit-012', projectId: 'proj-002', towerId: 'tower-1', towerName: 'Tower 1', floorNumber: 10,
    unitNumber: '1-1002', code: 'SKR-1-1002', unitType: 'apartment', configuration: '3BHK', areaSqft: 1520,
    status: 'reserved', constructionStage: 'ready-for-handover', progress: 92,
    milestones: [
      { id: 'm1', label: 'Finishing', date: '2026-05-01', status: 'completed' },
      { id: 'm2', label: 'Handover', date: '2026-08-01', status: 'in-progress' },
    ],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2023-12-01T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
  {
    id: 'unit-013', projectId: 'proj-002', towerId: 'tower-1', towerName: 'Tower 1', floorNumber: 14,
    unitNumber: '1-1401', code: 'SKR-1-1401', unitType: 'penthouse', configuration: '4BHK', areaSqft: 2400,
    status: 'available', constructionStage: 'ready-for-handover', progress: 90,
    milestones: [{ id: 'm1', label: 'Handover', date: '2026-08-15', status: 'upcoming' }],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2023-12-01T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
  {
    id: 'unit-014', projectId: 'proj-002', towerId: 'tower-1', towerName: 'Tower 1', floorNumber: 16,
    unitNumber: '1-1601', code: 'SKR-1-1601', unitType: 'penthouse', configuration: '4BHK Duplex', areaSqft: 2800,
    status: 'blocked', constructionStage: 'ready-for-handover', progress: 88,
    milestones: [{ id: 'm1', label: 'Handover', date: '2026-09-01', status: 'upcoming' }],
    summary: EMPTY_SUMMARY,
    archived: false, createdAt: '2023-12-01T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
];
