export type DocumentCategory =
  | 'legal'
  | 'financial'
  | 'technical'
  | 'construction'
  | 'warranty'
  | 'maintenance'
  | 'custom';

export type ApprovalStatus = 'draft' | 'pending-review' | 'approved' | 'rejected' | 'archived';
export type DocumentVisibility = 'internal' | 'owner-visible';
export type DocumentFileType = 'pdf' | 'image' | 'spreadsheet' | 'word' | 'other';
export type DocumentActivityTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type DocumentExplorerScope = 'all' | 'project' | 'unit' | 'category';
export type DocumentViewMode = 'grid' | 'list';

export interface DocumentVersion {
  readonly id: string;
  readonly versionNumber: number;
  readonly uploadedAt: string;
  readonly uploadedBy: string;
  readonly fileName: string;
  readonly fileSizeLabel: string;
  readonly notes?: string;
}

export interface DocumentActivityItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly icon: string;
  readonly tone?: DocumentActivityTone;
}

export interface ApprovalStep {
  readonly id: string;
  readonly reviewerName: string;
  readonly decision: 'approved' | 'rejected';
  readonly actedAt: string;
  readonly comment?: string;
}

export interface DocumentRecord {
  readonly id: string;
  readonly name: string;
  readonly category: DocumentCategory;
  readonly customCategoryLabel?: string;
  readonly fileType: DocumentFileType;
  readonly projectId: string;
  readonly projectName: string;
  readonly unitId?: string;
  readonly unitNumber?: string;
  readonly approvalStatus: ApprovalStatus;
  readonly visibility: DocumentVisibility;
  readonly versions: readonly DocumentVersion[];
  readonly approvalTimeline: readonly ApprovalStep[];
  readonly activity: readonly DocumentActivityItem[];
  readonly archived: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface DocumentFormModel {
  name: string;
  category: DocumentCategory;
  customCategoryLabel: string;
  fileType: DocumentFileType;
  projectId: string;
  unitId: string;
  visibility: DocumentVisibility;
  fileName: string;
  notes: string;
}

export interface DocumentTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface DocumentSavedView {
  readonly id: string;
  readonly name: string;
  readonly approvalFilter: ApprovalStatus | 'all';
  readonly categoryFilter: DocumentCategory | 'all';
  readonly isDefault?: boolean;
}

export interface DocumentListQuery {
  readonly search: string;
  readonly categoryFilter: DocumentCategory | 'all';
  readonly approvalFilter: ApprovalStatus | 'all';
  readonly visibilityFilter: DocumentVisibility | 'all';
  readonly projectFilter: string;
  readonly unitFilter: string;
  readonly includeArchived: boolean;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface DocumentListResult {
  readonly items: readonly DocumentRecord[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface CategoryStat {
  readonly category: DocumentCategory;
  readonly label: string;
  readonly icon: string;
  readonly count: number;
}

export type DocumentBulkAction = 'archive' | 'restore' | 'export';
