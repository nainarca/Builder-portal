export type HandoverChecklistStatus = 'pending' | 'completed' | 'blocked';

export interface HandoverChecklistTemplateItem {
  readonly id: string;
  readonly label: string;
  readonly mandatory: boolean;
}

export interface HandoverChecklistItem {
  readonly id: string;
  readonly label: string;
  readonly mandatory: boolean;
  readonly status: HandoverChecklistStatus;
  readonly detail?: string;
}
