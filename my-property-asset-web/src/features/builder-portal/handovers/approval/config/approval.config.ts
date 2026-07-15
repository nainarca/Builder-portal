import { HandoverApproval, Signature } from '../models/approval.model';

function signedSignature(party: Signature['party'], name: string, at: string): Signature {
  return { party, status: 'signed', signedByName: name, signedAt: at };
}

function pendingSignature(party: Signature['party']): Signature {
  return { party, status: 'pending' };
}

function approvedRecord(handoverId: string, ownerName: string, at: string): HandoverApproval {
  return {
    id: `appr-${handoverId}`,
    handoverId,
    status: 'approved',
    termsAccepted: true,
    ownerReviewedAt: at,
    signatures: [
      signedSignature('owner', ownerName, at),
      signedSignature('builder', 'Builder Admin', at),
      pendingSignature('witness'),
    ],
    decisionAt: at,
    decisionBy: 'Builder Admin',
    activity: [
      { id: 'a1', title: 'Owner reviewed handover', description: 'Terms & conditions accepted', timestamp: at, icon: 'pi pi-eye', tone: 'info' },
      { id: 'a2', title: 'Owner signed', description: `Signed by ${ownerName}`, timestamp: at, icon: 'pi pi-pencil', tone: 'primary' },
      { id: 'a3', title: 'Builder signed', description: 'Signed by Builder Admin', timestamp: at, icon: 'pi pi-pencil', tone: 'primary' },
      { id: 'a4', title: 'Handover approved', description: 'Approved by Builder Admin', timestamp: at, icon: 'pi pi-check-circle', tone: 'success' },
    ],
    createdAt: at,
    updatedAt: at,
  };
}

function notStartedRecord(handoverId: string, at: string): HandoverApproval {
  return {
    id: `appr-${handoverId}`,
    handoverId,
    status: 'ready-for-signature',
    termsAccepted: false,
    signatures: [pendingSignature('owner'), pendingSignature('builder'), pendingSignature('witness')],
    activity: [
      { id: 'a1', title: 'Approval workflow initialized', description: 'Awaiting owner review', timestamp: at, icon: 'pi pi-flag', tone: 'neutral' },
    ],
    createdAt: at,
    updatedAt: at,
  };
}

export const MOCK_APPROVALS: readonly HandoverApproval[] = [
  approvedRecord('handover-001', 'Rohan Mehta', '2026-04-15T09:00:00Z'),
  approvedRecord('handover-002', 'Sanjay Gupta', '2026-01-15T09:00:00Z'),
  notStartedRecord('handover-003', '2026-07-14T09:00:00Z'),
  notStartedRecord('handover-004', '2025-12-03T09:00:00Z'),
  notStartedRecord('handover-005', '2026-05-02T09:00:00Z'),
  notStartedRecord('handover-006', '2026-05-16T09:00:00Z'),
  notStartedRecord('handover-007', '2026-06-02T09:00:00Z'),
];
