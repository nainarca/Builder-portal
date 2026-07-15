import {
  DocumentCategory,
  DocumentRecord,
  DocumentSavedView,
  DocumentTableColumn,
} from '../models/document.model';

export const DOCUMENT_WORKSPACE_HEADER = {
  eyebrow: 'Document management',
  title: 'Documents',
  description: 'The enterprise document platform for MyPropertyAsset — categories, versions, approvals, and visibility across every project.',
};

export const CATEGORY_META: Record<DocumentCategory, { label: string; icon: string }> = {
  legal: { label: 'Legal', icon: 'pi pi-verified' },
  financial: { label: 'Financial', icon: 'pi pi-wallet' },
  technical: { label: 'Technical', icon: 'pi pi-cog' },
  construction: { label: 'Construction', icon: 'pi pi-building' },
  warranty: { label: 'Warranty', icon: 'pi pi-shield' },
  maintenance: { label: 'Maintenance', icon: 'pi pi-wrench' },
  custom: { label: 'Custom', icon: 'pi pi-tag' },
};

export const DOCUMENT_TABLE_COLUMNS: readonly DocumentTableColumn[] = [
  { id: 'name', label: 'Document', sortable: true, defaultVisible: true },
  { id: 'category', label: 'Category', sortable: true, defaultVisible: true },
  { id: 'link', label: 'Project / Unit', sortable: false, defaultVisible: true },
  { id: 'approval', label: 'Approval status', sortable: true, defaultVisible: true },
  { id: 'visibility', label: 'Visibility', sortable: false, defaultVisible: true },
  { id: 'version', label: 'Version', sortable: true, defaultVisible: false },
  { id: 'updatedAt', label: 'Last updated', sortable: true, defaultVisible: false },
];

export const DOCUMENT_SAVED_VIEWS: readonly DocumentSavedView[] = [
  { id: 'all', name: 'All documents', approvalFilter: 'all', categoryFilter: 'all', isDefault: true },
  { id: 'pending', name: 'Pending review', approvalFilter: 'pending-review', categoryFilter: 'all' },
  { id: 'approved', name: 'Approved', approvalFilter: 'approved', categoryFilter: 'all' },
  { id: 'drafts', name: 'Drafts', approvalFilter: 'draft', categoryFilter: 'all' },
];

export const DOCUMENT_CATEGORY_OPTIONS = [
  { label: 'All categories', value: 'all' },
  { label: 'Legal', value: 'legal' },
  { label: 'Financial', value: 'financial' },
  { label: 'Technical', value: 'technical' },
  { label: 'Construction', value: 'construction' },
  { label: 'Warranty', value: 'warranty' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Custom', value: 'custom' },
] as const;

export const DOCUMENT_APPROVAL_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending review', value: 'pending-review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Archived', value: 'archived' },
] as const;

export const DOCUMENT_VISIBILITY_OPTIONS = [
  { label: 'All visibility', value: 'all' },
  { label: 'Internal', value: 'internal' },
  { label: 'Owner visible', value: 'owner-visible' },
] as const;

export const DOCUMENT_SORT_OPTIONS = [
  { label: 'Name A–Z', value: 'name:asc' },
  { label: 'Name Z–A', value: 'name:desc' },
  { label: 'Recently updated', value: 'updatedAt:desc' },
  { label: 'Recently created', value: 'createdAt:desc' },
] as const;

const v1 = (id: string, uploadedAt: string, uploadedBy: string, fileName: string, fileSizeLabel: string, notes?: string) => ({
  id, versionNumber: 1, uploadedAt, uploadedBy, fileName, fileSizeLabel, notes,
});

export const MOCK_DOCUMENTS: readonly DocumentRecord[] = [
  {
    id: 'doc-001', name: 'Sale Deed — Horizon Towers', category: 'legal', fileType: 'pdf',
    projectId: 'proj-001', projectName: 'Horizon Towers',
    approvalStatus: 'approved', visibility: 'internal',
    versions: [v1('v-001', '2026-02-01T09:00:00Z', 'Builder Admin', 'sale-deed-horizon.pdf', '2.4 MB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Legal Team', decision: 'approved', actedAt: '2026-02-02T09:00:00Z' }],
    activity: [
      { id: 'a1', title: 'Document uploaded', description: 'Initial version uploaded', timestamp: '2026-02-01T09:00:00Z', icon: 'pi pi-upload', tone: 'primary' },
      { id: 'a2', title: 'Approved', description: 'Approved by Legal Team', timestamp: '2026-02-02T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' },
    ],
    archived: false, createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-02T09:00:00Z',
  },
  {
    id: 'doc-002', name: 'RERA Registration Certificate', category: 'legal', fileType: 'pdf',
    projectId: 'proj-001', projectName: 'Horizon Towers',
    approvalStatus: 'approved', visibility: 'owner-visible',
    versions: [
      { id: 'v-002b', versionNumber: 2, uploadedAt: '2026-03-01T09:00:00Z', uploadedBy: 'Builder Admin', fileName: 'rera-cert-v2.pdf', fileSizeLabel: '1.1 MB', notes: 'Updated with renewed validity' },
      v1('v-002a', '2025-06-01T09:00:00Z', 'Builder Admin', 'rera-cert-v1.pdf', '1.0 MB'),
    ],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Legal Team', decision: 'approved', actedAt: '2026-03-02T09:00:00Z' }],
    activity: [
      { id: 'a1', title: 'New version uploaded', description: 'v2 replaces expiring certificate', timestamp: '2026-03-01T09:00:00Z', icon: 'pi pi-upload', tone: 'primary' },
      { id: 'a2', title: 'Shared with owners', description: 'Visibility set to owner-visible', timestamp: '2026-03-02T09:00:00Z', icon: 'pi pi-eye', tone: 'info' },
    ],
    archived: false, createdAt: '2025-06-01T09:00:00Z', updatedAt: '2026-03-02T09:00:00Z',
  },
  {
    id: 'doc-003', name: 'Cost Sheet — Unit A-204', category: 'financial', fileType: 'spreadsheet',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-002', unitNumber: 'A-204',
    approvalStatus: 'approved', visibility: 'owner-visible',
    versions: [v1('v-003', '2026-02-13T09:00:00Z', 'Builder Admin', 'cost-sheet-a204.xlsx', '340 KB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Finance Team', decision: 'approved', actedAt: '2026-02-14T09:00:00Z' }],
    activity: [{ id: 'a1', title: 'Shared with owner', description: 'Sent to Priya Sharma', timestamp: '2026-02-14T09:00:00Z', icon: 'pi pi-eye', tone: 'info' }],
    archived: false, createdAt: '2026-02-13T09:00:00Z', updatedAt: '2026-02-14T09:00:00Z',
  },
  {
    id: 'doc-004', name: 'Payment Schedule — Unit A-101', category: 'financial', fileType: 'spreadsheet',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-001', unitNumber: 'A-101',
    approvalStatus: 'approved', visibility: 'owner-visible',
    versions: [v1('v-004', '2026-01-25T09:00:00Z', 'Builder Admin', 'payment-schedule-a101.xlsx', '210 KB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Finance Team', decision: 'approved', actedAt: '2026-01-26T09:00:00Z' }],
    activity: [{ id: 'a1', title: 'Shared with owner', description: 'Sent to Rohan Mehta', timestamp: '2026-01-26T09:00:00Z', icon: 'pi pi-eye', tone: 'info' }],
    archived: false, createdAt: '2026-01-25T09:00:00Z', updatedAt: '2026-01-26T09:00:00Z',
  },
  {
    id: 'doc-005', name: 'Structural Drawings — Tower A', category: 'technical', fileType: 'pdf',
    projectId: 'proj-001', projectName: 'Horizon Towers',
    approvalStatus: 'pending-review', visibility: 'internal',
    versions: [
      { id: 'v-005b', versionNumber: 2, uploadedAt: '2026-07-05T09:00:00Z', uploadedBy: 'Site Engineer', fileName: 'structural-tower-a-v2.pdf', fileSizeLabel: '5.2 MB', notes: 'Revised per structural audit' },
      v1('v-005a', '2025-08-01T09:00:00Z', 'Site Engineer', 'structural-tower-a-v1.pdf', '4.8 MB'),
    ],
    approvalTimeline: [],
    activity: [{ id: 'a1', title: 'Submitted for review', description: 'Awaiting structural sign-off', timestamp: '2026-07-05T09:00:00Z', icon: 'pi pi-send', tone: 'info' }],
    archived: false, createdAt: '2025-08-01T09:00:00Z', updatedAt: '2026-07-05T09:00:00Z',
  },
  {
    id: 'doc-006', name: 'Building Plan Approval', category: 'construction', fileType: 'pdf',
    projectId: 'proj-001', projectName: 'Horizon Towers',
    approvalStatus: 'approved', visibility: 'internal',
    versions: [v1('v-006', '2025-01-15T09:00:00Z', 'Builder Admin', 'building-plan-approval.pdf', '3.1 MB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Municipal Liaison', decision: 'approved', actedAt: '2025-01-20T09:00:00Z' }],
    activity: [{ id: 'a1', title: 'Approved', description: 'Municipal approval received', timestamp: '2025-01-20T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' }],
    archived: false, createdAt: '2025-01-15T09:00:00Z', updatedAt: '2025-01-20T09:00:00Z',
  },
  {
    id: 'doc-007', name: 'Warranty Certificate — Unit A-204', category: 'warranty', fileType: 'pdf',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-002', unitNumber: 'A-204',
    approvalStatus: 'draft', visibility: 'internal',
    versions: [v1('v-007', '2026-07-12T09:00:00Z', 'Builder Admin', 'warranty-a204-draft.pdf', '180 KB')],
    approvalTimeline: [],
    activity: [{ id: 'a1', title: 'Draft created', description: 'Awaiting submission for review', timestamp: '2026-07-12T09:00:00Z', icon: 'pi pi-file', tone: 'neutral' }],
    archived: false, createdAt: '2026-07-12T09:00:00Z', updatedAt: '2026-07-12T09:00:00Z',
  },
  {
    id: 'doc-008', name: 'Maintenance Manual — Unit A-101', category: 'maintenance', fileType: 'pdf',
    projectId: 'proj-001', projectName: 'Horizon Towers', unitId: 'unit-001', unitNumber: 'A-101',
    approvalStatus: 'approved', visibility: 'owner-visible',
    versions: [v1('v-008', '2026-04-20T09:00:00Z', 'Builder Admin', 'maintenance-manual-a101.pdf', '890 KB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Facilities Team', decision: 'approved', actedAt: '2026-04-21T09:00:00Z' }],
    activity: [{ id: 'a1', title: 'Shared with owner', description: 'Sent to Rohan Mehta', timestamp: '2026-04-21T09:00:00Z', icon: 'pi pi-eye', tone: 'info' }],
    archived: false, createdAt: '2026-04-20T09:00:00Z', updatedAt: '2026-04-21T09:00:00Z',
  },
  {
    id: 'doc-009', name: 'Occupancy Certificate', category: 'legal', fileType: 'pdf',
    projectId: 'proj-002', projectName: 'Skyline Residences',
    approvalStatus: 'approved', visibility: 'internal',
    versions: [v1('v-009', '2026-01-10T09:00:00Z', 'Builder Admin', 'occupancy-cert.pdf', '1.5 MB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Legal Team', decision: 'approved', actedAt: '2026-01-12T09:00:00Z' }],
    activity: [{ id: 'a1', title: 'Approved', description: 'Occupancy certificate approved', timestamp: '2026-01-12T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' }],
    archived: false, createdAt: '2026-01-10T09:00:00Z', updatedAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'doc-010', name: 'Home Loan NOC — Unit 1-01', category: 'financial', fileType: 'pdf',
    projectId: 'proj-002', projectName: 'Skyline Residences', unitId: 'unit-010', unitNumber: '1-01',
    approvalStatus: 'pending-review', visibility: 'internal',
    versions: [v1('v-010', '2026-07-10T09:00:00Z', 'Builder Admin', 'loan-noc-1-01.pdf', '120 KB')],
    approvalTimeline: [],
    activity: [{ id: 'a1', title: 'Submitted for review', description: 'Awaiting finance sign-off', timestamp: '2026-07-10T09:00:00Z', icon: 'pi pi-send', tone: 'info' }],
    archived: false, createdAt: '2026-07-10T09:00:00Z', updatedAt: '2026-07-10T09:00:00Z',
  },
  {
    id: 'doc-011', name: 'Fire Safety Certificate', category: 'legal', fileType: 'pdf',
    projectId: 'proj-002', projectName: 'Skyline Residences',
    approvalStatus: 'rejected', visibility: 'internal',
    versions: [v1('v-011', '2026-06-01T09:00:00Z', 'Builder Admin', 'fire-safety-cert-draft.pdf', '640 KB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Safety Officer', decision: 'rejected', actedAt: '2026-06-05T09:00:00Z', comment: 'Missing hydrant inspection annexure — resubmit with full report.' }],
    activity: [{ id: 'a1', title: 'Rejected', description: 'Returned by Safety Officer', timestamp: '2026-06-05T09:00:00Z', icon: 'pi pi-times-circle', tone: 'danger' }],
    archived: false, createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-05T09:00:00Z',
  },
  {
    id: 'doc-012', name: 'Electrical Completion Certificate — Unit 1-505', category: 'technical', fileType: 'pdf',
    projectId: 'proj-002', projectName: 'Skyline Residences', unitId: 'unit-011', unitNumber: '1-505',
    approvalStatus: 'approved', visibility: 'owner-visible',
    versions: [
      { id: 'v-012c', versionNumber: 3, uploadedAt: '2026-02-01T09:00:00Z', uploadedBy: 'Site Engineer', fileName: 'electrical-completion-v3.pdf', fileSizeLabel: '420 KB', notes: 'Final signed copy' },
      { id: 'v-012b', versionNumber: 2, uploadedAt: '2026-01-20T09:00:00Z', uploadedBy: 'Site Engineer', fileName: 'electrical-completion-v2.pdf', fileSizeLabel: '410 KB', notes: 'Corrected annexure' },
      v1('v-012a', '2026-01-05T09:00:00Z', 'Site Engineer', 'electrical-completion-v1.pdf', '400 KB'),
    ],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Electrical Inspector', decision: 'approved', actedAt: '2026-02-02T09:00:00Z' }],
    activity: [
      { id: 'a1', title: 'New version uploaded', description: 'Final signed copy (v3)', timestamp: '2026-02-01T09:00:00Z', icon: 'pi pi-upload', tone: 'primary' },
      { id: 'a2', title: 'Approved', description: 'Approved by Electrical Inspector', timestamp: '2026-02-02T09:00:00Z', icon: 'pi pi-check-circle', tone: 'success' },
    ],
    archived: false, createdAt: '2026-01-05T09:00:00Z', updatedAt: '2026-02-02T09:00:00Z',
  },
  {
    id: 'doc-013', name: 'Snag Rectification Report — Unit 1-1002', category: 'custom', customCategoryLabel: 'Snag Reports', fileType: 'word',
    projectId: 'proj-002', projectName: 'Skyline Residences', unitId: 'unit-012', unitNumber: '1-1002',
    approvalStatus: 'draft', visibility: 'internal',
    versions: [v1('v-013', '2026-07-11T09:00:00Z', 'Site Engineer', 'snag-report-1-1002.docx', '95 KB')],
    approvalTimeline: [],
    activity: [{ id: 'a1', title: 'Draft created', description: 'Rectification notes captured', timestamp: '2026-07-11T09:00:00Z', icon: 'pi pi-file', tone: 'neutral' }],
    archived: false, createdAt: '2026-07-11T09:00:00Z', updatedAt: '2026-07-11T09:00:00Z',
  },
  {
    id: 'doc-014', name: 'Society Formation Documents', category: 'legal', fileType: 'pdf',
    projectId: 'proj-003', projectName: 'Meadow Heights',
    approvalStatus: 'archived', visibility: 'internal',
    versions: [v1('v-014', '2024-11-01T09:00:00Z', 'Builder Admin', 'society-formation.pdf', '2.0 MB')],
    approvalTimeline: [{ id: 'ap1', reviewerName: 'Legal Team', decision: 'approved', actedAt: '2024-11-05T09:00:00Z' }],
    activity: [{ id: 'a1', title: 'Archived', description: 'Superseded by registered society bye-laws', timestamp: '2025-01-01T09:00:00Z', icon: 'pi pi-inbox', tone: 'neutral' }],
    archived: true, createdAt: '2024-11-01T09:00:00Z', updatedAt: '2025-01-01T09:00:00Z',
  },
];
