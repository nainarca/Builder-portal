import { Injectable, computed, signal } from '@angular/core';

import { MOCK_TOWERS, MOCK_UNITS } from '../config/units.config';
import { Tower, Unit, UnitFormModel, UnitListQuery, UnitListResult } from '../models/unit.model';

@Injectable({ providedIn: 'root' })
export class UnitStoreService {
  private readonly unitsSignal = signal<Unit[]>([...MOCK_UNITS]);
  private readonly towersSignal = signal<Tower[]>([...MOCK_TOWERS]);

  readonly units = this.unitsSignal.asReadonly();
  readonly towers = this.towersSignal.asReadonly();

  getById(id: string): Unit | undefined {
    return this.unitsSignal().find((unit) => unit.id === id);
  }

  getTowers(projectId: string): readonly Tower[] {
    return this.towersSignal().filter((tower) => tower.projectId === projectId);
  }

  getFloors(projectId: string, towerId?: string): readonly number[] {
    const units = this.unitsSignal().filter(
      (unit) => unit.projectId === projectId && (!towerId || unit.towerId === towerId),
    );
    return [...new Set(units.map((unit) => unit.floorNumber))].sort((a, b) => a - b);
  }

  query(params: UnitListQuery): UnitListResult {
    let items = this.unitsSignal().filter((unit) => unit.projectId === params.projectId);

    if (!params.includeArchived) {
      items = items.filter((unit) => !unit.archived);
    }

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (unit) =>
          unit.unitNumber.toLowerCase().includes(term) ||
          unit.code.toLowerCase().includes(term) ||
          unit.configuration.toLowerCase().includes(term),
      );
    }

    if (params.statusFilter !== 'all') {
      items = items.filter((unit) => unit.status === params.statusFilter);
    }

    if (params.stageFilter !== 'all') {
      items = items.filter((unit) => unit.constructionStage === params.stageFilter);
    }

    if (params.typeFilter !== 'all') {
      items = items.filter((unit) => unit.unitType === params.typeFilter);
    }

    if (params.towerFilter) {
      items = items.filter((unit) => unit.towerId === params.towerFilter);
    }

    if (params.floorFilter !== 'all') {
      items = items.filter((unit) => unit.floorNumber === params.floorFilter);
    }

    items = [...items].sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const paged = items.slice(start, start + params.pageSize);

    return { items: paged, total, page: params.page, pageSize: params.pageSize };
  }

  create(projectId: string, model: UnitFormModel): Unit {
    const now = new Date().toISOString();
    const tower = this.towersSignal().find((t) => t.id === model.towerId);
    const record: Unit = {
      id: `unit-${crypto.randomUUID().slice(0, 8)}`,
      projectId,
      towerId: model.towerId,
      towerName: tower?.name ?? 'Unassigned tower',
      floorNumber: model.floorNumber,
      unitNumber: model.unitNumber.trim(),
      code: model.code.trim() || model.unitNumber.trim(),
      unitType: model.unitType,
      configuration: model.configuration.trim(),
      areaSqft: model.areaSqft,
      status: model.status,
      constructionStage: model.constructionStage,
      progress: model.progress,
      milestones: [],
      summary: {
        ownerAssigned: false,
        documentsCount: 0,
        handoverStatus: 'not-started',
        openSnags: 0,
        upcomingAppointments: 0,
      },
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    this.unitsSignal.update((units) => [record, ...units]);
    return record;
  }

  update(id: string, model: UnitFormModel): Unit | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const tower = this.towersSignal().find((t) => t.id === model.towerId);
    const updated: Unit = {
      ...existing,
      towerId: model.towerId,
      towerName: tower?.name ?? existing.towerName,
      floorNumber: model.floorNumber,
      unitNumber: model.unitNumber.trim(),
      code: model.code.trim() || existing.code,
      unitType: model.unitType,
      configuration: model.configuration.trim(),
      areaSqft: model.areaSqft,
      status: model.status,
      constructionStage: model.constructionStage,
      progress: model.progress,
      updatedAt: new Date().toISOString(),
    };

    this.unitsSignal.update((units) => units.map((unit) => (unit.id === id ? updated : unit)));
    return updated;
  }

  archive(id: string): Unit | undefined {
    return this.setArchived(id, true);
  }

  restore(id: string): Unit | undefined {
    return this.setArchived(id, false);
  }

  bulkArchive(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, true);
  }

  bulkRestore(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, false);
  }

  toFormModel(unit: Unit): UnitFormModel {
    return {
      towerId: unit.towerId,
      floorNumber: unit.floorNumber,
      unitNumber: unit.unitNumber,
      code: unit.code,
      unitType: unit.unitType,
      configuration: unit.configuration,
      areaSqft: unit.areaSqft,
      status: unit.status,
      constructionStage: unit.constructionStage,
      progress: unit.progress,
    };
  }

  emptyFormModel(projectId: string): UnitFormModel {
    const firstTower = this.getTowers(projectId)[0];
    return {
      towerId: firstTower?.id ?? '',
      floorNumber: 1,
      unitNumber: '',
      code: '',
      unitType: 'apartment',
      configuration: '',
      areaSqft: 0,
      status: 'available',
      constructionStage: 'not-started',
      progress: 0,
    };
  }

  readonly totalCount = computed(() => this.unitsSignal().length);

  private setArchived(id: string, archived: boolean): Unit | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, archived, updatedAt: new Date().toISOString() };
    this.unitsSignal.update((units) => units.map((unit) => (unit.id === id ? updated : unit)));
    return updated;
  }

  private bulkSetArchived(ids: readonly string[], archived: boolean): number {
    let count = 0;
    this.unitsSignal.update((units) =>
      units.map((unit) => {
        if (!ids.includes(unit.id)) {
          return unit;
        }
        count += 1;
        return { ...unit, archived, updatedAt: new Date().toISOString() };
      }),
    );
    return count;
  }

  private compare(a: Unit, b: Unit, field: string, direction: 'asc' | 'desc'): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    const av = (a as unknown as Record<string, unknown>)[field];
    const bv = (b as unknown as Record<string, unknown>)[field];

    if (typeof av === 'number' && typeof bv === 'number') {
      return (av - bv) * multiplier;
    }

    return String(av ?? '').localeCompare(String(bv ?? '')) * multiplier;
  }
}
