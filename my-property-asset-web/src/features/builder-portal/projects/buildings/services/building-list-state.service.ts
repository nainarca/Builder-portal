import { Injectable, computed, inject, signal } from '@angular/core';

import { BuildingListQuery, BuildingStatus } from '../models/building.model';
import { BuildingService } from './building.service';

@Injectable({ providedIn: 'root' })
export class BuildingListStateService {
  private readonly buildingService = inject(BuildingService);

  readonly projectId = signal('');
  readonly search = signal('');
  readonly statusFilter = signal<BuildingStatus | 'all'>('all');
  readonly includeArchived = signal(false);
  readonly sortValue = signal('displayOrder:asc');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly loading = signal(false);

  readonly query = computed<BuildingListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      projectId: this.projectId(),
      search: this.search(),
      statusFilter: this.statusFilter(),
      includeArchived: this.includeArchived(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => {
    if (!this.projectId()) {
      return { items: [], total: 0, page: 1, pageSize: this.pageSize() };
    }
    return this.buildingService.query(this.query());
  });

  setProjectId(id: string): void {
    this.projectId.set(id);
    this.page.set(1);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setStatusFilter(value: BuildingStatus | 'all'): void {
    this.statusFilter.set(value);
    this.page.set(1);
  }

  setIncludeArchived(value: boolean): void {
    this.includeArchived.set(value);
    this.page.set(1);
  }

  setSort(value: string): void {
    this.sortValue.set(value);
  }

  setPage(page: number): void {
    this.page.set(page);
  }

  resetFilters(): void {
    this.search.set('');
    this.statusFilter.set('all');
    this.includeArchived.set(false);
    this.sortValue.set('displayOrder:asc');
    this.page.set(1);
  }
}
