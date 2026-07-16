import { Injectable } from '@angular/core';

import {
  Building,
  BuildingFormModel,
  BuildingListQuery,
  BuildingListResult,
} from '../models/building.model';
import { SEED_BUILDER_BUILDINGS } from '../config/buildings.seed';
import { BuilderBuildingRepository } from './builder-building.repository';

@Injectable({ providedIn: 'root' })
export class InMemoryBuilderBuildingRepository extends BuilderBuildingRepository {
  private buildings: Building[] = SEED_BUILDER_BUILDINGS.map((b) => ({ ...b }));

  list(query: BuildingListQuery): BuildingListResult {
    let items = this.buildings.filter((b) => b.projectId === query.projectId);

    if (!query.includeArchived) {
      items = items.filter((b) => !b.archived && b.status !== 'archived');
    }

    if (query.search.trim()) {
      const term = query.search.trim().toLowerCase();
      items = items.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.code.toLowerCase().includes(term) ||
          (b.towerName?.toLowerCase().includes(term) ?? false) ||
          (b.blockName?.toLowerCase().includes(term) ?? false),
      );
    }

    if (query.statusFilter !== 'all') {
      items = items.filter((b) => b.status === query.statusFilter);
    }

    items.sort((a, b) => this.compare(a, b, query.sortField, query.sortDirection));

    const total = items.length;
    const start = (query.page - 1) * query.pageSize;
    return {
      items: items.slice(start, start + query.pageSize),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  getById(id: string): Building | undefined {
    return this.buildings.find((b) => b.id === id);
  }

  getByProjectId(projectId: string, includeArchived = false): readonly Building[] {
    return this.buildings.filter(
      (b) =>
        b.projectId === projectId &&
        (includeArchived || (!b.archived && b.status !== 'archived')),
    );
  }

  getAll(): readonly Building[] {
    return this.buildings;
  }

  codeExists(projectId: string, code: string, excludeId?: string): boolean {
    const normalized = code.trim().toUpperCase();
    return this.buildings.some(
      (b) =>
        b.projectId === projectId &&
        b.code.toUpperCase() === normalized &&
        b.id !== excludeId,
    );
  }

  create(projectId: string, organizationId: string, model: BuildingFormModel): Building {
    const code = (model.code.trim() || this.generateCode(model.name)).toUpperCase();
    if (this.codeExists(projectId, code)) {
      throw new Error('Building code already exists for this project');
    }

    const now = new Date().toISOString();
    const status = model.status === 'archived' ? 'archived' : model.status;
    const record: Building = {
      id: `bld-${crypto.randomUUID().slice(0, 8)}`,
      projectId,
      organizationId,
      name: model.name.trim(),
      code,
      towerName: model.towerName.trim() || undefined,
      blockName: model.blockName.trim() || undefined,
      displayOrder: Number.isFinite(model.displayOrder) ? model.displayOrder : 0,
      floorsCount: Math.max(0, model.floorsCount || 0),
      unitsCount: Math.max(0, model.unitsCount || 0),
      status,
      description: model.description.trim() || undefined,
      imageUrl: model.imageUrl.trim() || undefined,
      addressLine: model.addressLine.trim() || undefined,
      archived: status === 'archived',
      createdAt: now,
      updatedAt: now,
    };
    this.buildings = [record, ...this.buildings];
    return record;
  }

  update(id: string, model: BuildingFormModel): Building | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const code = (model.code.trim() || existing.code).toUpperCase();
    if (this.codeExists(existing.projectId, code, id)) {
      throw new Error('Building code already exists for this project');
    }

    const status = model.status;
    const updated: Building = {
      ...existing,
      name: model.name.trim(),
      code,
      towerName: model.towerName.trim() || undefined,
      blockName: model.blockName.trim() || undefined,
      displayOrder: Number.isFinite(model.displayOrder) ? model.displayOrder : existing.displayOrder,
      floorsCount: Math.max(0, model.floorsCount || 0),
      unitsCount: Math.max(0, model.unitsCount || 0),
      status,
      description: model.description.trim() || undefined,
      imageUrl: model.imageUrl.trim() || undefined,
      addressLine: model.addressLine.trim() || undefined,
      archived: status === 'archived',
      updatedAt: new Date().toISOString(),
    };
    this.buildings = this.buildings.map((b) => (b.id === id ? updated : b));
    return updated;
  }

  archive(id: string): Building | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated: Building = {
      ...existing,
      status: 'archived',
      archived: true,
      updatedAt: new Date().toISOString(),
    };
    this.buildings = this.buildings.map((b) => (b.id === id ? updated : b));
    return updated;
  }

  restore(id: string): Building | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated: Building = {
      ...existing,
      status: existing.status === 'archived' ? 'planning' : existing.status,
      archived: false,
      updatedAt: new Date().toISOString(),
    };
    this.buildings = this.buildings.map((b) => (b.id === id ? updated : b));
    return updated;
  }

  private compare(a: Building, b: Building, field: string, direction: 'asc' | 'desc'): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    const pick = (item: Building): unknown => {
      switch (field) {
        case 'displayOrder':
          return item.displayOrder;
        default:
          return (item as unknown as Record<string, unknown>)[field];
      }
    };
    const av = pick(a);
    const bv = pick(b);
    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * multiplier;
    }
    return String(av ?? '').localeCompare(String(bv ?? '')) * multiplier;
  }

  private generateCode(name: string): string {
    const initials = name
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 3);
    return `${initials || 'BLD'}-${Math.floor(Math.random() * 90 + 10)}`;
  }
}
