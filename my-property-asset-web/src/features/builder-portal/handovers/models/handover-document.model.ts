import { DocumentRecord } from '../../documents/models/document.model';

export type HandoverDocumentType =
  | 'sale_deed'
  | 'registration_document'
  | 'patta'
  | 'fmb'
  | 'survey_sketch'
  | 'encumbrance_certificate'
  | 'tax_receipt'
  | 'building_approval'
  | 'completion_certificate'
  | 'occupancy_certificate'
  | 'electrical_documents'
  | 'water_connection'
  | 'maintenance_documents'
  | 'builder_warranty_documents'
  | 'other_attachment';

export interface HandoverDocumentTypeDefinition {
  readonly id: HandoverDocumentType;
  readonly label: string;
  readonly required: boolean;
  readonly keywords: readonly string[];
}

export interface HandoverDocumentBucket {
  readonly type: HandoverDocumentTypeDefinition;
  readonly documents: readonly DocumentRecord[];
  readonly verified: boolean;
}
