import { FutureIntegrationPoint, HandoverCompletion, KeyAssetItem, WarrantyTerm } from '../models/completion.model';

export const KEY_ASSET_TEMPLATE: readonly Omit<KeyAssetItem, 'handedOver'>[] = [
  { id: 'keys-main', label: 'Main door keys (2)' },
  { id: 'keys-parking', label: 'Parking access card / remote' },
  { id: 'keys-intercom', label: 'Intercom fob' },
  { id: 'keys-mailbox', label: 'Mailbox key' },
];

export const WARRANTY_TERMS: readonly WarrantyTerm[] = [
  { id: 'structural', label: 'Structural warranty', period: '5 years' },
  { id: 'waterproofing', label: 'Waterproofing warranty', period: '10 years' },
  { id: 'fittings', label: 'Fittings & fixtures warranty', period: '1 year' },
  { id: 'electrical', label: 'Electrical & plumbing warranty', period: '2 years' },
];

export const FUTURE_INTEGRATION_POINTS: readonly FutureIntegrationPoint[] = [
  { id: 'pdf', label: 'PDF Generator', description: 'Generate a downloadable, print-ready possession certificate.', icon: 'pi pi-file-pdf' },
  { id: 'qr', label: 'QR Verification', description: 'Scan-to-verify the authenticity of an issued certificate.', icon: 'pi pi-qrcode' },
  { id: 'email', label: 'Email Delivery', description: 'Automatically email the owner package on completion.', icon: 'pi pi-envelope' },
  { id: 'sms', label: 'SMS Notification', description: 'Notify the owner by SMS when the handover closes.', icon: 'pi pi-comment' },
  { id: 'whatsapp', label: 'WhatsApp Notification', description: 'Send handover updates via WhatsApp Business.', icon: 'pi pi-whatsapp' },
  { id: 'owner-app', label: 'Flutter Owner App Activation', description: 'Activate the owner’s mobile app access on completion.', icon: 'pi pi-mobile' },
  { id: 'crm', label: 'CRM Integration', description: 'Sync completed handovers to the builder’s CRM.', icon: 'pi pi-sitemap' },
];

function buildKeysAssets(allHandedOver: boolean): readonly KeyAssetItem[] {
  return KEY_ASSET_TEMPLATE.map((item) => ({ ...item, handedOver: allHandedOver }));
}

function completedRecord(handoverId: string, completedBy: string, at: string): HandoverCompletion {
  return {
    id: `comp-${handoverId}`,
    handoverId,
    completedAt: at,
    completedBy,
    builderResponsibilityCompleted: true,
    ownerPossessionStarted: true,
    certificate: { certificateNumber: `MPA-CERT-${handoverId.replace('handover-', '')}`, issuedAt: at, status: 'generated' },
    keysAssets: buildKeysAssets(true),
    activity: [
      { id: 'a1', title: 'Handover finalized', description: `Completed by ${completedBy}`, timestamp: at, icon: 'pi pi-check-circle', tone: 'success' },
      { id: 'a2', title: 'Possession certificate generated', description: `Certificate MPA-CERT-${handoverId.replace('handover-', '')} issued`, timestamp: at, icon: 'pi pi-verified', tone: 'success' },
    ],
    createdAt: at,
    updatedAt: at,
  };
}

function notReadyRecord(handoverId: string, at: string): HandoverCompletion {
  return {
    id: `comp-${handoverId}`,
    handoverId,
    builderResponsibilityCompleted: false,
    ownerPossessionStarted: false,
    certificate: { status: 'not-generated' },
    keysAssets: buildKeysAssets(false),
    activity: [],
    createdAt: at,
    updatedAt: at,
  };
}

export const MOCK_COMPLETIONS: readonly HandoverCompletion[] = [
  completedRecord('handover-001', 'Builder Admin', '2026-04-15T09:30:00Z'),
  completedRecord('handover-002', 'Builder Admin', '2026-01-15T09:30:00Z'),
  notReadyRecord('handover-003', '2026-07-14T09:00:00Z'),
  notReadyRecord('handover-004', '2025-12-03T09:00:00Z'),
  notReadyRecord('handover-005', '2026-05-02T09:00:00Z'),
  notReadyRecord('handover-006', '2026-05-16T09:00:00Z'),
  notReadyRecord('handover-007', '2026-06-02T09:00:00Z'),
];
