import { ApprovalStatus, Signature } from '../models/approval.model';

const TERMINAL_STATUSES: readonly ApprovalStatus[] = ['approved', 'rejected', 'cancelled'];

export function deriveApprovalStatus(signatures: readonly Signature[], currentStatus: ApprovalStatus): ApprovalStatus {
  if (TERMINAL_STATUSES.includes(currentStatus)) {
    return currentStatus;
  }

  const ownerSigned = signatures.find((s) => s.party === 'owner')?.status === 'signed';
  const builderSigned = signatures.find((s) => s.party === 'builder')?.status === 'signed';

  if (ownerSigned && builderSigned) {
    return 'pending-approval';
  }
  if (ownerSigned) {
    return 'owner-signed';
  }
  if (builderSigned) {
    return 'builder-signed';
  }
  return 'ready-for-signature';
}
