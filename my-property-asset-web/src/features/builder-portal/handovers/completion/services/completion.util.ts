import { ApprovalStatus } from '../../approval/models/approval.model';
import { CompletionStatus } from '../models/completion.model';

export function deriveCompletionStatus(approvalStatus: ApprovalStatus | undefined, completedAt: string | undefined): CompletionStatus {
  if (completedAt) {
    return 'completed';
  }
  return approvalStatus === 'approved' ? 'ready' : 'not-ready';
}
