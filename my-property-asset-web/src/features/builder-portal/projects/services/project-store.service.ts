import { Injectable, computed, inject } from '@angular/core';

import {
  Project,
  ProjectFormModel,
  ProjectListQuery,
  ProjectListResult,
} from '../models/project.model';
import { ProjectService } from './project.service';

/**
 * Compatibility facade used by existing list/detail pages.
 * Delegates to P8 ProjectService + repository.
 */
@Injectable({ providedIn: 'root' })
export class ProjectStoreService {
  private readonly projectService = inject(ProjectService);

  readonly projects = this.projectService.projects;
  readonly totalCount = this.projectService.totalCount;
  readonly dashboardStats = this.projectService.dashboardStats;

  getById(id: string): Project | undefined {
    return this.projectService.getById(id);
  }

  query(params: ProjectListQuery): ProjectListResult {
    return this.projectService.query(params);
  }

  create(model: ProjectFormModel): Project {
    return this.projectService.create(model);
  }

  update(id: string, model: ProjectFormModel): Project | undefined {
    return this.projectService.update(id, model);
  }

  archive(id: string): Project | undefined {
    return this.projectService.archive(id);
  }

  restore(id: string): Project | undefined {
    return this.projectService.restore(id);
  }

  bulkArchive(ids: readonly string[]): number {
    return this.projectService.bulkArchive(ids);
  }

  bulkRestore(ids: readonly string[]): number {
    return this.projectService.bulkRestore(ids);
  }

  getCities(): readonly string[] {
    return this.projectService.getCities();
  }

  toFormModel(project: Project): ProjectFormModel {
    return this.projectService.toFormModel(project);
  }

  emptyFormModel(): ProjectFormModel {
    return this.projectService.emptyFormModel();
  }

  readonly activeProjectCount = computed(
    () => this.dashboardStats().total,
  );
}
