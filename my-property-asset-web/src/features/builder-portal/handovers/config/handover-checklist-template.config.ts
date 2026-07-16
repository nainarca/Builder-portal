import { HandoverChecklistTemplateItem } from '../models/handover-checklist.model';

export const HANDOVER_CHECKLIST_TEMPLATE: readonly HandoverChecklistTemplateItem[] = [
  { id: 'registration-completed', label: 'Registration Completed', mandatory: true },
  { id: 'payment-completed', label: 'Payment Completed', mandatory: true },
  { id: 'keys-handed-over', label: 'Keys Handed Over', mandatory: true },
  { id: 'documents-uploaded', label: 'Documents Uploaded', mandatory: true },
  { id: 'owner-assigned', label: 'Owner Assigned', mandatory: true },
  { id: 'invitation-sent', label: 'Invitation Sent', mandatory: true },
  { id: 'invitation-accepted', label: 'Invitation Accepted', mandatory: true },
  { id: 'property-activated', label: 'Property Activated', mandatory: true },
];
