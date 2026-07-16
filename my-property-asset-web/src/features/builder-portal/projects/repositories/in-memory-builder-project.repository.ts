import { Injectable } from '@angular/core';

import {
  Project,
  ProjectFormModel,
  ProjectListQuery,
  ProjectListResult,
  emptyProjectSummary,
} from '../models/project.model';
import { SEED_BUILDER_PROJECTS } from '../config/projects.seed';
import { BuilderProjectRepository } from './builder-project.repository';

@Injectable({ providedIn: 'root' })
export class InMemoryBuilderProjectRepository extends BuilderProjectRepository {
  private projects: Project[] = SEED_BUILDER_PROJECTS.map((p) => ({ ...p }));

  list(query: ProjectListQuery, organizationId?: string | null): ProjectListResult {
    let items = [...this.projects];

    if (organizationId) {
      items = items.filter(
        (p) => p.organizationId === organizationId || p.organizationId === 'org-builder-demo',
      );
    }

    if (!query.includeArchived) {
      items = items.filter((p) => !p.archived && p.status !== 'archived');
    }

    if (query.search.trim()) {
      const term = query.search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term) ||
          p.location.city.toLowerCase().includes(term) ||
          p.projectType.includes(term),
      );
    }

    if (query.statusFilter !== 'all') {
      items = items.filter((p) => p.status === query.statusFilter);
    }

    if (query.typeFilter !== 'all') {
      items = items.filter((p) => p.projectType === query.typeFilter);
    }

    if (query.cityFilter) {
      items = items.filter((p) => p.location.city === query.cityFilter);
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

  getById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  getAll(): readonly Project[] {
    return this.projects;
  }

  create(model: ProjectFormModel, organizationId: string, organizationName: string): Project {
    const now = new Date().toISOString();
    const status = model.status === 'archived' ? 'archived' : model.status;
    const record: Project = {
      id: `proj-${crypto.randomUUID().slice(0, 8)}`,
      name: model.name.trim(),
      code: (model.code.trim() || this.generateCode(model.name)).toUpperCase(),
      description: model.description.trim() || undefined,
      organizationId,
      organizationName,
      projectType: model.projectType,
      status,
      location: {
        addressLine: model.addressLine.trim(),
        city: model.city.trim(),
        state: model.state.trim(),
        postalCode: model.postalCode.trim(),
        latitude: this.parseCoord(model.latitude),
        longitude: this.parseCoord(model.longitude),
      },
      launchDate: model.launchDate || undefined,
      expectedCompletionDate: model.expectedCompletionDate || undefined,
      bannerUrl: model.bannerUrl.trim() || undefined,
      logoUrl: model.logoUrl.trim() || undefined,
      thumbnailUrl: model.logoUrl.trim() || model.bannerUrl.trim() || undefined,
      summary: emptyProjectSummary(),
      archived: status === 'archived',
      createdAt: now,
      updatedAt: now,
    };
    this.projects = [record, ...this.projects];
    return record;
  }

  update(id: string, model: ProjectFormModel): Project | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }

    const status = model.status;
    const updated: Project = {
      ...existing,
      name: model.name.trim(),
      code: (model.code.trim() || existing.code).toUpperCase(),
      description: model.description.trim() || undefined,
      projectType: model.projectType,
      status,
      location: {
        addressLine: model.addressLine.trim(),
        city: model.city.trim(),
        state: model.state.trim(),
        postalCode: model.postalCode.trim(),
        latitude: this.parseCoord(model.latitude),
        longitude: this.parseCoord(model.longitude),
      },
      launchDate: model.launchDate || undefined,
      expectedCompletionDate: model.expectedCompletionDate || undefined,
      bannerUrl: model.bannerUrl.trim() || undefined,
      logoUrl: model.logoUrl.trim() || undefined,
      thumbnailUrl: model.logoUrl.trim() || model.bannerUrl.trim() || existing.thumbnailUrl,
      archived: status === 'archived',
      updatedAt: new Date().toISOString(),
    };

    this.projects = this.projects.map((p) => (p.id === id ? updated : p));
    return updated;
  }

  archive(id: string): Project | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated: Project = {
      ...existing,
      status: 'archived',
      archived: true,
      updatedAt: new Date().toISOString(),
    };
    this.projects = this.projects.map((p) => (p.id === id ? updated : p));
    return updated;
  }

  restore(id: string): Project | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated: Project = {
      ...existing,
      status: existing.status === 'archived' ? 'planning' : existing.status,
      archived: false,
      updatedAt: new Date().toISOString(),
    };
    this.projects = this.projects.map((p) => (p.id === id ? updated : p));
    return updated;
  }

  bulkArchive(ids: readonly string[]): number {
    let count = 0;
    this.projects = this.projects.map((p) => {
      if (!ids.includes(p.id)) {
        return p;
      }
      count += 1;
      return {
        ...p,
        status: 'archived' as const,
        archived: true,
        updatedAt: new Date().toISOString(),
      };
    });
    return count;
  }

  bulkRestore(ids: readonly string[]): number {
    let count = 0;
    this.projects = this.projects.map((p) => {
      if (!ids.includes(p.id)) {
        return p;
      }
      count += 1;
      return {
        ...p,
        status: p.status === 'archived' ? ('planning' as const) : p.status,
        archived: false,
        updatedAt: new Date().toISOString(),
      };
    });
    return count;
  }

  getCities(organizationId?: string | null): readonly string[] {
    return [
      ...new Set(
        this.projects
          .filter(
            (p) =>
              !organizationId ||
              p.organizationId === organizationId ||
              p.organizationId === 'org-builder-demo',
          )
          .map((p) => p.location.city)
          .filter(Boolean),
      ),
    ].sort();
  }

  private parseCoord(value: string): number | null {
    if (!value.trim()) {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private compare(a: Project, b: Project, field: string, direction: 'asc' | 'desc'): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    const pick = (p: Project): unknown => {
      switch (field) {
        case 'city':
          return p.location.city;
        case 'expectedCompletionDate':
          return p.expectedCompletionDate;
        case 'launchDate':
          return p.launchDate;
        case 'projectType':
          return p.projectType;
        default:
          return (p as unknown as Record<string, unknown>)[field];
      }
    };
    return String(pick(a) ?? '').localeCompare(String(pick(b) ?? '')) * multiplier;
  }

  private generateCode(name: string): string {
    const initials = name
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 3);
    return `${initials || 'PRJ'}-${Math.floor(Math.random() * 90 + 10)}`;
  }
}
