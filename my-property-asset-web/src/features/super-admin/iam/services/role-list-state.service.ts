import { Injectable, computed, inject, signal } from '@angular/core';

import { RoleListQuery } from '../models/role-admin.model';
import { RoleAdminStoreService } from './role-admin-store.service';

@Injectable({ providedIn: 'root' })
export class RoleListStateService {
  private readonly store = inject(RoleAdminStoreService);

  readonly search = signal('');
  readonly scopeFilter = signal<RoleListQuery['scopeFilter']>('all');
  readonly sortValue = signal('label:asc');
  readonly page = signal(1);
  readonly pageSize = signal(25);
  readonly loading = signal(false);

  readonly query = computed<RoleListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      scopeFilter: this.scopeFilter(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));

  setSearch(v: string): void { this.search.set(v); this.page.set(1); }
  setScopeFilter(v: RoleListQuery['scopeFilter']): void { this.scopeFilter.set(v); this.page.set(1); }
  setSort(v: string): void { this.sortValue.set(v); }
}
