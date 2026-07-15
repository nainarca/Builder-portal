export type InspectionCategory = 'construction' | 'electrical' | 'plumbing' | 'civil' | 'safety' | 'custom';
export type InspectionResultStatus = 'pending' | 'passed' | 'passed-with-remarks' | 'failed' | 'blocked';
export type ChecklistItemStatus = 'pending' | 'passed' | 'failed' | 'not-applicable';

export interface ChecklistItemDefinition {
  readonly id: string;
  readonly label: string;
  readonly mandatory: boolean;
}

export interface ChecklistSectionDefinition {
  readonly id: string;
  readonly title: string;
  readonly items: readonly ChecklistItemDefinition[];
}

export interface InspectionCategoryDefinition {
  readonly id: InspectionCategory;
  readonly label: string;
  readonly icon: string;
  readonly mandatoryForHandover: boolean;
  readonly sections: readonly ChecklistSectionDefinition[];
}

export interface ChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly mandatory: boolean;
  readonly status: ChecklistItemStatus;
  readonly remarks?: string;
}

export interface ChecklistSection {
  readonly id: string;
  readonly title: string;
  readonly items: readonly ChecklistItem[];
}

export interface Inspection {
  readonly id: string;
  readonly handoverId: string;
  readonly category: InspectionCategory;
  readonly title: string;
  readonly mandatoryForHandover: boolean;
  readonly result: InspectionResultStatus;
  readonly completionPercent: number;
  readonly inspectorNotes?: string;
  readonly sections: readonly ChecklistSection[];
  readonly updatedAt: string;
  readonly completedAt?: string;
}

export type ReadinessTriState = 'not-started' | 'in-progress' | 'complete';

export interface HandoverReadiness {
  readonly handoverId: string;
  readonly documentsReady: boolean;
  readonly ownerAssigned: boolean;
  readonly checklistStatus: ReadinessTriState;
  readonly inspectionStatus: ReadinessTriState | 'blocked';
  readonly overallReadiness: 'not-ready' | 'partially-ready' | 'ready';
  readonly goNoGo: 'go' | 'no-go' | 'pending';
}
