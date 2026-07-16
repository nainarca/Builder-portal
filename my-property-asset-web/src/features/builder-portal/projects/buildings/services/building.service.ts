import { Injectable, computed, inject, signal } from '@angular/core';

import {
  Building,
  BuildingDashboardStats,
  BuildingFormModel,
  BuildingListQuery,
  BuildingListResult,
  BuildingStatus,
} from '../models/building.model';
import { BuilderBuildingRepository } from '../repositories/builder-building.repository';
import { ProjectStoreService } from '../../services/project-store.service';

@Injectable({ providedIn: 'root' })
export class BuildingService {
  private readonly repository = inject(BuilderBuildingRepository);
  private readonly projects = inject(ProjectStoreService);
  private readonly revision = signal(0);

  readonly buildings = computed(() => {
    this.revision();
    return this.repository.getAll();
  });

  dashboardStats(projectId?: string): BuildingDashboardStats {
    this.revision();
    const all = this.repository
      .getAll()
      .filter((b) => !projectId || b.projectId === projectId);

    const byStatus: Record<BuildingStatus, number> = {
      planning: 0,
      construction: 0,
      completed: 0,
      archived: 0,
    };
    for (const b of all) {
      byStatus[b.status] += 1;
    }

    const recent = [...all]
      .filter((b) => !b.archived)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);

    return {
      total: all.filter((b) => !b.archived).length,
      byStatus,
      recent,
    };
  }

  query(params: BuildingListQuery): BuildingListResult {
    this.revision();
    return this.repository.list(params);
  }

  getById(id: string): Building | undefined {
    this.revision();
    return this.repository.getById(id);
  }

  listForProject(projectId: string, includeArchived = false): readonly Building[] {
    this.revision();
    return this.repository.getByProjectId(projectId, includeArchived);
  }

  create(projectId: string, model: BuildingFormModel): Building {
    const project = this.projects.getById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.hierarchy === 'direct-units') {
      throw new Error('Buildings are not allowed for DIRECT_UNITS projects');
    }
    const created = this.repository.create(projectId, project.organizationId, model);
    this.touch();
    return created;
  }

  update(id: string, model: BuildingFormModel): Building | undefined {
    const updated = this.repository.update(id, model);
    if (updated) {
      this.touch();
    }
    return updated;
  }

  archive(id: string): Building | undefined {
    const archived = this.repository.archive(id);
    if (archived) {
      this.touch();
    }
    return archived;
  }

  restore(id: string): Building | undefined {
    const restored = this.repository.restore(id);
    if (restored) {
      this.touch();
    }
    return restored;
  }

  codeExists(projectId: string, code: string, excludeId?: string): boolean {
    return this.repository.codeExists(projectId, code, excludeId);
  }

  toFormModel(building: Building): BuildingFormModel {
    return {
      name: building.name,
      code: building.code,
      towerName: building.towerName ?? '',
      blockName: building.blockName ?? '',
      displayOrder: building.displayOrder,
      floorsCount: building.floorsCount,
      unitsCount: building.unitsCount,
      status: building.status === 'archived' ? 'planning' : building.status,
      description: building.description ?? '',
      imageUrl: building.imageUrl ?? '',
      addressLine: building.addressLine ?? '',
    };
  }

  emptyFormModel(nextOrder = 1): BuildingFormModel {
    return {
      name: '',
      code: '',
      towerName: '',
      blockName: '',
      displayOrder: nextOrder,
      floorsCount: 0,
      unitsCount: 0,
      status: 'planning',
      description: '',
      imageUrl: '',
      addressLine: '',
    };
  }

  private touch(): void {
    this.revision.update((n) => n + 1);
  }
}
