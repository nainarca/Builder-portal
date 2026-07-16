import { Injectable, computed, inject, signal } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';

import {
  Project,
  ProjectDashboardStats,
  ProjectFormModel,
  ProjectListQuery,
  ProjectListResult,
  ProjectStatus,
} from '../models/project.model';
import { BuilderProjectRepository } from '../repositories/builder-project.repository';

/**
 * P8 Project application service — org-scoped CRUD over BuilderProjectRepository.
 */
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly repository = inject(BuilderProjectRepository);
  private readonly currentOrganization = inject(CurrentOrganizationService);

  /** Bumps when repository mutates so computed consumers refresh. */
  private readonly revision = signal(0);

  readonly projects = computed(() => {
    this.revision();
    return this.repository.getAll();
  });

  readonly totalCount = computed(() => this.projects().length);

  readonly dashboardStats = computed<ProjectDashboardStats>(() => {
    this.revision();
    const orgId = this.currentOrganization.organizationId();
    const all = this.repository
      .getAll()
      .filter((p) => !orgId || p.organizationId === orgId || p.organizationId === 'org-builder-demo');

    const byStatus: Record<ProjectStatus, number> = {
      upcoming: 0,
      planning: 0,
      construction: 0,
      completed: 0,
      archived: 0,
    };
    for (const p of all) {
      byStatus[p.status] += 1;
    }

    const recent = [...all]
      .filter((p) => !p.archived)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);

    return {
      total: all.filter((p) => !p.archived).length,
      byStatus,
      recent,
    };
  });

  query(params: ProjectListQuery): ProjectListResult {
    this.revision();
    return this.repository.list(params, this.resolveOrgId());
  }

  getById(id: string): Project | undefined {
    this.revision();
    return this.repository.getById(id);
  }

  create(model: ProjectFormModel): Project {
    const org = this.currentOrganization.snapshot();
    const created = this.repository.create(
      model,
      org.organizationId ?? 'org-builder-demo',
      org.organizationName ?? 'Builder Organization',
    );
    this.touch();
    return created;
  }

  update(id: string, model: ProjectFormModel): Project | undefined {
    const updated = this.repository.update(id, model);
    if (updated) {
      this.touch();
    }
    return updated;
  }

  archive(id: string): Project | undefined {
    const archived = this.repository.archive(id);
    if (archived) {
      this.touch();
    }
    return archived;
  }

  restore(id: string): Project | undefined {
    const restored = this.repository.restore(id);
    if (restored) {
      this.touch();
    }
    return restored;
  }

  bulkArchive(ids: readonly string[]): number {
    const count = this.repository.bulkArchive(ids);
    if (count) {
      this.touch();
    }
    return count;
  }

  bulkRestore(ids: readonly string[]): number {
    const count = this.repository.bulkRestore(ids);
    if (count) {
      this.touch();
    }
    return count;
  }

  getCities(): readonly string[] {
    this.revision();
    return this.repository.getCities(this.resolveOrgId());
  }

  toFormModel(project: Project): ProjectFormModel {
    return {
      name: project.name,
      code: project.code,
      description: project.description ?? '',
      projectType: project.projectType,
      hierarchy: project.hierarchy,
      status: project.status === 'archived' ? 'planning' : project.status,
      addressLine: project.location.addressLine,
      city: project.location.city,
      state: project.location.state,
      postalCode: project.location.postalCode,
      latitude: project.location.latitude != null ? String(project.location.latitude) : '',
      longitude: project.location.longitude != null ? String(project.location.longitude) : '',
      launchDate: project.launchDate ?? '',
      expectedCompletionDate: project.expectedCompletionDate ?? '',
      bannerUrl: project.bannerUrl ?? '',
      logoUrl: project.logoUrl ?? '',
    };
  }

  emptyFormModel(): ProjectFormModel {
    return {
      name: '',
      code: '',
      description: '',
      projectType: 'apartment',
      hierarchy: 'building-based',
      status: 'planning',
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
      latitude: '',
      longitude: '',
      launchDate: '',
      expectedCompletionDate: '',
      bannerUrl: '',
      logoUrl: '',
    };
  }

  private resolveOrgId(): string | null {
    return this.currentOrganization.organizationId() ?? null;
  }

  private touch(): void {
    this.revision.update((n) => n + 1);
  }
}
