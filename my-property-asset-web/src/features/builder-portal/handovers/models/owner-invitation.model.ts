export type HandoverInvitationStatus =
  | 'not-generated'
  | 'pending'
  | 'accepted'
  | 'expired'
  | 'cancelled'
  | 'resent';

export interface HandoverInvitationSummary {
  readonly assignmentId: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly status: HandoverInvitationStatus;
  readonly sentAt?: string;
  readonly expiresAt?: string;
  readonly acceptedAt?: string;
  readonly cancelledAt?: string;
  readonly resendCount: number;
  readonly remindersSent: number;
}
