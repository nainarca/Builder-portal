import { Injectable, inject, signal } from '@angular/core';

import { ProjectStoreService } from '../../projects/services/project-store.service';
import { UnitStoreService } from '../../projects/units/services/unit-store.service';
import { CATEGORY_META, MOCK_DOCUMENTS } from '../config/documents.config';
import {
  ApprovalStatus,
  CategoryStat,
  DocumentFormModel,
  DocumentListQuery,
  DocumentListResult,
  DocumentRecord,
} from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentStoreService {
  private readonly projectStore = inject(ProjectStoreService);
  private readonly unitStore = inject(UnitStoreService);

  private readonly documentsSignal = signal<DocumentRecord[]>([...MOCK_DOCUMENTS]);

  readonly documents = this.documentsSignal.asReadonly();

  getById(id: string): DocumentRecord | undefined {
    return this.documentsSignal().find((doc) => doc.id === id);
  }

  getByUnitId(unitId: string): readonly DocumentRecord[] {
    return this.documentsSignal().filter((doc) => doc.unitId === unitId && !doc.archived);
  }

  getByProjectId(projectId: string): readonly DocumentRecord[] {
    return this.documentsSignal().filter((doc) => doc.projectId === projectId && !doc.archived);
  }

  getCategoryStats(): readonly CategoryStat[] {
    const active = this.documentsSignal().filter((doc) => !doc.archived);
    return (Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map((category) => ({
      category,
      label: CATEGORY_META[category].label,
      icon: CATEGORY_META[category].icon,
      count: active.filter((doc) => doc.category === category).length,
    }));
  }

  query(params: DocumentListQuery): DocumentListResult {
    let items = this.documentsSignal();

    if (!params.includeArchived) {
      items = items.filter((doc) => !doc.archived);
    }

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (doc) =>
          doc.name.toLowerCase().includes(term) ||
          doc.projectName.toLowerCase().includes(term) ||
          (doc.unitNumber?.toLowerCase().includes(term) ?? false),
      );
    }

    if (params.categoryFilter !== 'all') {
      items = items.filter((doc) => doc.category === params.categoryFilter);
    }
    if (params.approvalFilter !== 'all') {
      items = items.filter((doc) => doc.approvalStatus === params.approvalFilter);
    }
    if (params.visibilityFilter !== 'all') {
      items = items.filter((doc) => doc.visibility === params.visibilityFilter);
    }
    if (params.projectFilter) {
      items = items.filter((doc) => doc.projectId === params.projectFilter);
    }
    if (params.unitFilter) {
      items = items.filter((doc) => doc.unitId === params.unitFilter);
    }

    items = [...items].sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const paged = items.slice(start, start + params.pageSize);

    return { items: paged, total, page: params.page, pageSize: params.pageSize };
  }

  create(model: DocumentFormModel): DocumentRecord {
    const now = new Date().toISOString();
    const project = this.projectStore.getById(model.projectId);
    const unit = model.unitId ? this.unitStore.getById(model.unitId) : undefined;

    const record: DocumentRecord = {
      id: `doc-${crypto.randomUUID().slice(0, 8)}`,
      name: model.name.trim(),
      category: model.category,
      customCategoryLabel: model.category === 'custom' ? model.customCategoryLabel.trim() || undefined : undefined,
      fileType: model.fileType,
      projectId: model.projectId,
      projectName: project?.name ?? model.projectId,
      unitId: unit?.id,
      unitNumber: unit?.unitNumber,
      approvalStatus: 'draft',
      visibility: model.visibility,
      versions: [
        {
          id: `v-${crypto.randomUUID().slice(0, 8)}`,
          versionNumber: 1,
          uploadedAt: now,
          uploadedBy: 'Builder Admin',
          fileName: model.fileName.trim() || `${model.name.trim()}.pdf`,
          fileSizeLabel: '—',
          notes: model.notes || undefined,
        },
      ],
      approvalTimeline: [],
      activity: [
        {
          id: `a-${crypto.randomUUID().slice(0, 8)}`,
          title: 'Document created',
          description: 'Initial version added',
          timestamp: now,
          icon: 'pi pi-upload',
          tone: 'primary',
        },
      ],
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    this.documentsSignal.update((docs) => [record, ...docs]);
    return record;
  }

  addVersion(id: string, fileName: string, notes?: string): DocumentRecord | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const now = new Date().toISOString();
    const nextVersionNumber = (existing.versions[0]?.versionNumber ?? 0) + 1;
    const updated: DocumentRecord = {
      ...existing,
      versions: [
        {
          id: `v-${crypto.randomUUID().slice(0, 8)}`,
          versionNumber: nextVersionNumber,
          uploadedAt: now,
          uploadedBy: 'Builder Admin',
          fileName: fileName.trim() || `${existing.name}-v${nextVersionNumber}.pdf`,
          fileSizeLabel: '—',
          notes,
        },
        ...existing.versions,
      ],
      activity: [
        {
          id: `a-${crypto.randomUUID().slice(0, 8)}`,
          title: `Version ${nextVersionNumber} uploaded`,
          description: notes || 'New version added',
          timestamp: now,
          icon: 'pi pi-upload',
          tone: 'primary' as const,
        },
        ...existing.activity,
      ],
      updatedAt: now,
    };
    this.documentsSignal.update((docs) => docs.map((d) => (d.id === id ? updated : d)));
    return updated;
  }

  submitForReview(id: string): void {
    this.transition(id, 'pending-review', 'Submitted for review', 'pi pi-send', 'info');
  }

  approve(id: string, reviewerName = 'Builder Admin'): void {
    const now = new Date().toISOString();
    this.documentsSignal.update((docs) =>
      docs.map((d) => {
        if (d.id !== id) {
          return d;
        }
        return {
          ...d,
          approvalStatus: 'approved',
          approvalTimeline: [{ id: `ap-${crypto.randomUUID().slice(0, 8)}`, reviewerName, decision: 'approved', actedAt: now }, ...d.approvalTimeline],
          activity: [
            { id: `a-${crypto.randomUUID().slice(0, 8)}`, title: 'Approved', description: `Approved by ${reviewerName}`, timestamp: now, icon: 'pi pi-check-circle', tone: 'success' as const },
            ...d.activity,
          ],
          updatedAt: now,
        };
      }),
    );
  }

  reject(id: string, comment: string, reviewerName = 'Builder Admin'): void {
    const now = new Date().toISOString();
    this.documentsSignal.update((docs) =>
      docs.map((d) => {
        if (d.id !== id) {
          return d;
        }
        return {
          ...d,
          approvalStatus: 'rejected',
          approvalTimeline: [{ id: `ap-${crypto.randomUUID().slice(0, 8)}`, reviewerName, decision: 'rejected', actedAt: now, comment }, ...d.approvalTimeline],
          activity: [
            { id: `a-${crypto.randomUUID().slice(0, 8)}`, title: 'Rejected', description: comment, timestamp: now, icon: 'pi pi-times-circle', tone: 'danger' as const },
            ...d.activity,
          ],
          updatedAt: now,
        };
      }),
    );
  }

  archive(id: string): DocumentRecord | undefined {
    return this.setArchived(id, true);
  }

  restore(id: string): DocumentRecord | undefined {
    return this.setArchived(id, false);
  }

  bulkArchive(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, true);
  }

  bulkRestore(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, false);
  }

  emptyFormModel(): DocumentFormModel {
    return {
      name: '',
      category: 'legal',
      customCategoryLabel: '',
      fileType: 'pdf',
      projectId: '',
      unitId: '',
      visibility: 'internal',
      fileName: '',
      notes: '',
    };
  }

  private transition(id: string, status: ApprovalStatus, title: string, icon: string, tone: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'): void {
    const now = new Date().toISOString();
    this.documentsSignal.update((docs) =>
      docs.map((d) => {
        if (d.id !== id) {
          return d;
        }
        return {
          ...d,
          approvalStatus: status,
          activity: [{ id: `a-${crypto.randomUUID().slice(0, 8)}`, title, description: title, timestamp: now, icon, tone }, ...d.activity],
          updatedAt: now,
        };
      }),
    );
  }

  private setArchived(id: string, archived: boolean): DocumentRecord | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated: DocumentRecord = {
      ...existing,
      archived,
      approvalStatus: archived ? 'archived' : existing.approvalStatus === 'archived' ? 'draft' : existing.approvalStatus,
      updatedAt: new Date().toISOString(),
    };
    this.documentsSignal.update((docs) => docs.map((d) => (d.id === id ? updated : d)));
    return updated;
  }

  private bulkSetArchived(ids: readonly string[], archived: boolean): number {
    let count = 0;
    this.documentsSignal.update((docs) =>
      docs.map((doc) => {
        if (!ids.includes(doc.id)) {
          return doc;
        }
        count += 1;
        return { ...doc, archived, updatedAt: new Date().toISOString() };
      }),
    );
    return count;
  }

  private compare(a: DocumentRecord, b: DocumentRecord, field: string, direction: 'asc' | 'desc'): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    if (field === 'version') {
      return ((a.versions[0]?.versionNumber ?? 0) - (b.versions[0]?.versionNumber ?? 0)) * multiplier;
    }
    const av = (a as unknown as Record<string, unknown>)[field];
    const bv = (b as unknown as Record<string, unknown>)[field];
    return String(av ?? '').localeCompare(String(bv ?? '')) * multiplier;
  }
}
