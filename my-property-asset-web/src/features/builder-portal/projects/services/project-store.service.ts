import { Injectable, computed, inject, signal } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';

import { MOCK_PROJECTS } from '../config/projects.config';
import { Project, ProjectFormModel, ProjectListQuery, ProjectListResult } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectStoreService {
  private readonly currentOrganization = inject(CurrentOrganizationService);

  private readonly projectsSignal = signal<Project[]>([...MOCK_PROJECTS]);

  readonly projects = this.projectsSignal.asReadonly();
  readonly totalCount = computed(() => this.projectsSignal().length);

  getById(id: string): Project | undefined {
    return this.projectsSignal().find((project) => project.id === id);
  }

  query(params: ProjectListQuery): ProjectListResult {
    let items = [...this.projectsSignal()];

    if (!params.includeArchived) {
      items = items.filter((project) => !project.archived);
    }

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      items = items.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          project.code.toLowerCase().includes(term) ||
          project.location.city.toLowerCase().includes(term),
      );
    }

    if (params.statusFilter !== 'all') {
      items = items.filter((project) => project.status === params.statusFilter);
    }

    if (params.stageFilter !== 'all') {
      items = items.filter((project) => project.constructionStage === params.stageFilter);
    }

    if (params.healthFilter !== 'all') {
      items = items.filter((project) => project.health === params.healthFilter);
    }

    if (params.cityFilter) {
      items = items.filter((project) => project.location.city === params.cityFilter);
    }

    items.sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const paged = items.slice(start, start + params.pageSize);

    return { items: paged, total, page: params.page, pageSize: params.pageSize };
  }

  create(model: ProjectFormModel): Project {
    const now = new Date().toISOString();
    const orgSnapshot = this.currentOrganization.snapshot();
    const record: Project = {
      id: `proj-${crypto.randomUUID().slice(0, 8)}`,
      name: model.name.trim(),
      code: model.code.trim() || this.generateCode(model.name),
      description: model.description.trim() || undefined,
      organizationId: orgSnapshot.organizationId ?? 'org-current',
      organizationName: orgSnapshot.organizationName ?? 'My Organization',
      status: model.status,
      constructionStage: model.constructionStage,
      health: model.health,
      progress: model.progress,
      location: {
        addressLine: model.addressLine.trim(),
        city: model.city.trim(),
        state: model.state.trim(),
        postalCode: model.postalCode.trim(),
        country: model.country.trim(),
      },
      startDate: model.startDate,
      targetCompletionDate: model.targetCompletionDate,
      milestones: [],
      summary: {
        unitsTotal: 0,
        unitsSold: 0,
        ownersCount: 0,
        documentsCount: 0,
        pendingHandovers: 0,
        openSnags: 0,
        upcomingAppointments: 0,
      },
      archived: false,
      createdAt: now,
      updatedAt: now,
    };

    this.projectsSignal.update((projects) => [record, ...projects]);
    return record;
  }

  update(id: string, model: ProjectFormModel): Project | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const updated: Project = {
      ...existing,
      name: model.name.trim(),
      code: model.code.trim() || existing.code,
      description: model.description.trim() || undefined,
      status: model.status,
      constructionStage: model.constructionStage,
      health: model.health,
      progress: model.progress,
      location: {
        addressLine: model.addressLine.trim(),
        city: model.city.trim(),
        state: model.state.trim(),
        postalCode: model.postalCode.trim(),
        country: model.country.trim(),
      },
      startDate: model.startDate,
      targetCompletionDate: model.targetCompletionDate,
      updatedAt: new Date().toISOString(),
    };

    this.projectsSignal.update((projects) =>
      projects.map((project) => (project.id === id ? updated : project)),
    );
    return updated;
  }

  archive(id: string): Project | undefined {
    return this.setArchived(id, true);
  }

  restore(id: string): Project | undefined {
    return this.setArchived(id, false);
  }

  bulkArchive(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, true);
  }

  bulkRestore(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, false);
  }

  getCities(): readonly string[] {
    return [...new Set(this.projectsSignal().map((p) => p.location.city))].sort();
  }

  toFormModel(project: Project): ProjectFormModel {
    return {
      name: project.name,
      code: project.code,
      description: project.description ?? '',
      status: project.status,
      constructionStage: project.constructionStage,
      health: project.health,
      progress: project.progress,
      addressLine: project.location.addressLine,
      city: project.location.city,
      state: project.location.state,
      postalCode: project.location.postalCode,
      country: project.location.country,
      startDate: project.startDate,
      targetCompletionDate: project.targetCompletionDate,
    };
  }

  emptyFormModel(): ProjectFormModel {
    return {
      name: '',
      code: '',
      description: '',
      status: 'planning',
      constructionStage: 'land-acquisition',
      health: 'on-track',
      progress: 0,
      addressLine: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      startDate: '',
      targetCompletionDate: '',
    };
  }

  private setArchived(id: string, archived: boolean): Project | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, archived, updatedAt: new Date().toISOString() };
    this.projectsSignal.update((projects) =>
      projects.map((project) => (project.id === id ? updated : project)),
    );
    return updated;
  }

  private bulkSetArchived(ids: readonly string[], archived: boolean): number {
    let count = 0;
    this.projectsSignal.update((projects) =>
      projects.map((project) => {
        if (!ids.includes(project.id)) {
          return project;
        }
        count += 1;
        return { ...project, archived, updatedAt: new Date().toISOString() };
      }),
    );
    return count;
  }

  private compare(a: Project, b: Project, field: string, direction: 'asc' | 'desc'): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    const av = field === 'targetCompletionDate' ? a.targetCompletionDate : (a as unknown as Record<string, unknown>)[field];
    const bv = field === 'targetCompletionDate' ? b.targetCompletionDate : (b as unknown as Record<string, unknown>)[field];

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
    return `${initials}-${Math.floor(Math.random() * 90 + 10)}`;
  }
}
