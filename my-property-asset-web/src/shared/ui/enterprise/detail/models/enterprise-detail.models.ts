/** DS-07 Enterprise Detail — presentation models (UI-REBIRTH §5 / P0.1 §2.7). */

export type EnterpriseDetailLifecycleState = 'idle' | 'loading' | 'error' | 'not-found';

/** Tabs for non-sequential entity sub-domains (Projects, Orgs…). */
export interface EnterpriseDetailTab {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly disabled?: boolean;
}

/** Sequential process stages (Handovers) — Stage Tracker pattern. */
export type EnterpriseDetailStageStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'blocked'
  | 'skipped'
  | 'delayed';

export interface EnterpriseDetailStageStep {
  readonly id: string;
  readonly label: string;
  readonly status: EnterpriseDetailStageStatus;
  readonly description?: string;
  /** Optional deep-link for stage workspace (presentation only). */
  readonly href?: string;
}

export interface EnterpriseDetailFact {
  readonly label: string;
  readonly value: string;
}

export interface EnterpriseDetailStat {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface EnterpriseDetailAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly severity?: 'default' | 'danger';
}

export interface EnterpriseDetailRelatedItem {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly meta?: string;
  readonly href?: string;
  readonly statusLabel?: string;
  readonly statusSeverity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
}

export interface EnterpriseDetailAttachment {
  readonly id: string;
  readonly name: string;
  readonly version?: string;
  readonly sizeLabel?: string;
  readonly updatedAt?: string;
  readonly mimeHint?: string;
}

export interface EnterpriseDetailTimelineEvent {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly timestamp: string;
  readonly absoluteTimestamp?: string;
  readonly icon?: string;
}

export type EnterpriseDetailEmptyVariant =
  | 'no-related'
  | 'no-documents'
  | 'no-activity'
  | 'no-financial'
  | 'no-history';

/** Detail chrome pattern — tabs vs stage tracker vs simple scroll. */
export type EnterpriseDetailChromePattern = 'tabs' | 'stage' | 'simple';
