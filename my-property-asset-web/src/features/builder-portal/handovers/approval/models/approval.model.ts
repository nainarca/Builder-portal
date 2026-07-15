import { HandoverActivityItem } from '../../models/handover.model';

export type ApprovalStatus =
  | 'ready-for-signature'
  | 'owner-signed'
  | 'builder-signed'
  | 'pending-approval'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type SignatureParty = 'owner' | 'builder' | 'witness';
export type SignatureStatus = 'pending' | 'signed' | 'declined';

export interface Signature {
  readonly party: SignatureParty;
  readonly status: SignatureStatus;
  readonly signedByName?: string;
  readonly signedAt?: string;
}

export interface HandoverApproval {
  readonly id: string;
  readonly handoverId: string;
  readonly status: ApprovalStatus;
  readonly termsAccepted: boolean;
  readonly ownerReviewedAt?: string;
  readonly signatures: readonly Signature[];
  readonly reviewNotes?: string;
  readonly decisionAt?: string;
  readonly decisionBy?: string;
  readonly rejectionReason?: string;
  readonly activity: readonly HandoverActivityItem[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
