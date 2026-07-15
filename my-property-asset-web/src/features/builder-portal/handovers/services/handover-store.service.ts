import { Injectable, signal } from '@angular/core';

import { MOCK_HANDOVERS } from '../config/handovers.config';
import { Handover, HandoverListQuery, HandoverListResult, HandoverStageId } from '../models/handover.model';

@Injectable({ providedIn: 'root' })
export class HandoverStoreService {
  private readonly handoversSignal = signal<Handover[]>([...MOCK_HANDOVERS]);

  readonly handovers = this.handoversSignal.asReadonly();

  getById(id: string): Handover | undefined {
    return this.handoversSignal().find((h) => h.id === id);
  }

  getByUnitId(unitId: string): Handover | undefined {
    return this.handoversSignal().find((h) => h.unitId === unitId);
  }

  getByProjectId(projectId: string): readonly Handover[] {
    return this.handoversSignal().filter((h) => h.projectId === projectId);
  }

  currentStageId(handover: Handover): HandoverStageId {
    const active = handover.stages.find((s) => s.status !== 'completed');
    return active?.stageId ?? handover.stages[handover.stages.length - 1].stageId;
  }

  query(params: HandoverListQuery): HandoverListResult {
    let items = this.handoversSignal();

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (h) =>
          h.unitNumber.toLowerCase().includes(term) ||
          h.ownerName.toLowerCase().includes(term) ||
          h.projectName.toLowerCase().includes(term),
      );
    }

    if (params.statusFilter !== 'all') {
      items = items.filter((h) => h.overallStatus === params.statusFilter);
    }
    if (params.projectFilter) {
      items = items.filter((h) => h.projectId === params.projectFilter);
    }
    if (params.unitFilter) {
      items = items.filter((h) => h.unitId === params.unitFilter);
    }

    items = [...items].sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const paged = items.slice(start, start + params.pageSize);

    return { items: paged, total, page: params.page, pageSize: params.pageSize };
  }

  private compare(a: Handover, b: Handover, field: string, direction: 'asc' | 'desc'): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    const av = (a as unknown as Record<string, unknown>)[field];
    const bv = (b as unknown as Record<string, unknown>)[field];

    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * multiplier;
    }
    return String(av ?? '').localeCompare(String(bv ?? '')) * multiplier;
  }
}
