import { Injectable, inject, signal } from '@angular/core';

import { DocumentRecord } from '../../documents/models/document.model';
import { DocumentStoreService } from '../../documents/services/document-store.service';
import { HANDOVER_DOCUMENT_TYPES } from '../config/handover-document-types.config';
import { HandoverDocumentBucket, HandoverDocumentTypeDefinition } from '../models/handover-document.model';
import { HandoverStoreService } from './handover-store.service';

@Injectable({ providedIn: 'root' })
export class HandoverDocumentService {
  private readonly documents = inject(DocumentStoreService);
  private readonly handovers = inject(HandoverStoreService);
  private readonly verifiedIds = signal<Record<string, readonly string[]>>({});

  getByHandoverId(handoverId: string): readonly DocumentRecord[] {
    const handover = this.handovers.getById(handoverId);
    return handover ? this.documents.getByUnitId(handover.unitId) : [];
  }

  getBuckets(handoverId: string): readonly HandoverDocumentBucket[] {
    const docs = this.getByHandoverId(handoverId);
    return HANDOVER_DOCUMENT_TYPES.map((type) => {
      const matches = docs.filter((doc) => this.matchesType(doc, type));
      return {
        type,
        documents: matches,
        verified: matches.length > 0 && matches.every((doc) => this.isVerified(handoverId, doc.id)),
      };
    });
  }

  requiredReady(handoverId: string): boolean {
    return this.getBuckets(handoverId)
      .filter((bucket) => bucket.type.required)
      .every((bucket) => bucket.verified);
  }

  isVerified(handoverId: string, documentId: string): boolean {
    return (this.verifiedIds()[handoverId] ?? []).includes(documentId);
  }

  verifyDocument(handoverId: string, documentId: string): void {
    this.verifiedIds.update((state) => {
      const current = state[handoverId] ?? [];
      if (current.includes(documentId)) {
        return state;
      }
      return { ...state, [handoverId]: [...current, documentId] };
    });
  }

  private matchesType(doc: DocumentRecord, type: HandoverDocumentTypeDefinition): boolean {
    if (type.id === 'other_attachment') {
      return !HANDOVER_DOCUMENT_TYPES.some(
        (candidate) =>
          candidate.id !== 'other_attachment' &&
          candidate.keywords.some((keyword) => doc.name.toLowerCase().includes(keyword)),
      );
    }
    return type.keywords.some((keyword) => doc.name.toLowerCase().includes(keyword));
  }
}
