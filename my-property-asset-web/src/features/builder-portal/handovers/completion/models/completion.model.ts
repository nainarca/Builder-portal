import { HandoverActivityItem } from '../../models/handover.model';

export type CompletionStatus = 'not-ready' | 'ready' | 'completed';
export type CertificateStatus = 'not-generated' | 'generated';

export interface KeyAssetItem {
  readonly id: string;
  readonly label: string;
  readonly handedOver: boolean;
}

export interface PossessionCertificate {
  readonly certificateNumber?: string;
  readonly issuedAt?: string;
  readonly status: CertificateStatus;
}

export interface HandoverCompletion {
  readonly id: string;
  readonly handoverId: string;
  readonly completedAt?: string;
  readonly completedBy?: string;
  readonly builderResponsibilityCompleted: boolean;
  readonly ownerPossessionStarted: boolean;
  readonly certificate: PossessionCertificate;
  readonly keysAssets: readonly KeyAssetItem[];
  readonly activity: readonly HandoverActivityItem[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface WarrantyTerm {
  readonly id: string;
  readonly label: string;
  readonly period: string;
}

export interface FutureIntegrationPoint {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
}
