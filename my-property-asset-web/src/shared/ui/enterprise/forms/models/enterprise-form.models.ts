import { ValidationIssue } from '../../../models';
import { WizardStep } from '../../../composites/forms/stepper.component';

/** Named section kinds for enterprise forms (P0.1 §5.3). */
export type EnterpriseFormSectionKind =
  | 'general'
  | 'address'
  | 'configuration'
  | 'financial'
  | 'documents'
  | 'attachments'
  | 'settings'
  | 'metadata'
  | 'audit'
  | 'advanced'
  | 'custom';

export const ENTERPRISE_FORM_SECTION_LABELS: Record<EnterpriseFormSectionKind, string> = {
  general: 'General Information',
  address: 'Address',
  configuration: 'Configuration',
  financial: 'Financial',
  documents: 'Documents',
  attachments: 'Attachments',
  settings: 'Settings',
  metadata: 'Metadata',
  audit: 'Audit',
  advanced: 'Advanced',
  custom: 'Details',
};

export type EnterpriseFormMode = 'create' | 'edit' | 'view';

export type EnterpriseFormLifecycleState =
  | 'idle'
  | 'loading'
  | 'saving'
  | 'draft'
  | 'archived'
  | 'error'
  | 'permission-denied'
  | 'readonly';

export interface EnterpriseFormFieldState {
  required?: boolean;
  hint?: string;
  error?: string | null;
  success?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export interface EnterpriseSelectOption {
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}

export interface EnterpriseUploadFile {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly type?: string;
  readonly previewUrl?: string | null;
  readonly progress?: number;
  readonly status: 'pending' | 'uploading' | 'complete' | 'error';
  readonly errorMessage?: string;
}

export interface EnterpriseWizardStep extends WizardStep {
  readonly optional?: boolean;
  readonly valid?: boolean;
}

export type EnterpriseWizardPhase =
  | 'steps'
  | 'review'
  | 'confirmation'
  | 'completion';

export type { ValidationIssue, WizardStep };
