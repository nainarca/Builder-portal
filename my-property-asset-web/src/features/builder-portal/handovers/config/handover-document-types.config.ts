import { HandoverDocumentTypeDefinition } from '../models/handover-document.model';

export const HANDOVER_DOCUMENT_TYPES: readonly HandoverDocumentTypeDefinition[] = [
  { id: 'sale_deed', label: 'Sale Deed', required: true, keywords: ['sale deed'] },
  { id: 'registration_document', label: 'Registration Document', required: true, keywords: ['registration'] },
  { id: 'patta', label: 'Patta', required: false, keywords: ['patta'] },
  { id: 'fmb', label: 'FMB', required: false, keywords: ['fmb'] },
  { id: 'survey_sketch', label: 'Survey Sketch', required: false, keywords: ['survey sketch'] },
  { id: 'encumbrance_certificate', label: 'EC', required: false, keywords: ['encumbrance', 'ec'] },
  { id: 'tax_receipt', label: 'Tax Receipt', required: false, keywords: ['tax receipt'] },
  { id: 'building_approval', label: 'Building Approval', required: true, keywords: ['building approval', 'plan approval'] },
  { id: 'completion_certificate', label: 'Completion Certificate', required: false, keywords: ['completion certificate'] },
  { id: 'occupancy_certificate', label: 'Occupancy Certificate', required: true, keywords: ['occupancy certificate'] },
  { id: 'electrical_documents', label: 'Electrical Documents', required: false, keywords: ['electrical'] },
  { id: 'water_connection', label: 'Water Connection', required: false, keywords: ['water connection'] },
  { id: 'maintenance_documents', label: 'Maintenance Documents', required: false, keywords: ['maintenance'] },
  { id: 'builder_warranty_documents', label: 'Builder Warranty Documents', required: false, keywords: ['warranty'] },
  { id: 'other_attachment', label: 'Other Attachments', required: false, keywords: [] },
];
