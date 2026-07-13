import { Injectable, computed, inject, signal } from '@angular/core';

import { PlatformRole } from '@core/rbac/models/permission.model';

import { InvitationBulkAction, InvitationListQuery } from '../models/invitation-admin.model';
import { InvitationAdminStoreService } from './invitation-admin-store.service';

@Injectable({ providedIn: 'root' })
export class InvitationListStateService {
  private readonly store = inject(InvitationAdminStoreService);

  readonly search = signal('');
  readonly statusFilter = signal<InvitationListQuery['statusFilter']>('all');
  readonly roleFilter = signal<PlatformRole | 'all'>('all');
  readonly sortValue = signal('sentAt:desc');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly selectedIds = signal<readonly string[]>([]);
  readonly loading = signal(false);
  readonly exportLoading = signal(false);
  readonly inviteDialogVisible = signal(false);

  readonly query = computed<InvitationListQuery>(() => {
    const [sortField, sortDirection] = this.sortValue().split(':') as [string, 'asc' | 'desc'];
    return {
      search: this.search(),
      statusFilter: this.statusFilter(),
      roleFilter: this.roleFilter(),
      sortField,
      sortDirection,
      page: this.page(),
      pageSize: this.pageSize(),
    };
  });

  readonly listResult = computed(() => this.store.query(this.query()));

  setSearch(v: string): void { this.search.set(v); this.page.set(1); }
  setStatusFilter(v: InvitationListQuery['statusFilter']): void { this.statusFilter.set(v); this.page.set(1); }
  setRoleFilter(v: PlatformRole | 'all'): void { this.roleFilter.set(v); this.page.set(1); }
  setSelection(ids: readonly string[]): void { this.selectedIds.set(ids); }
  clearSelection(): void { this.selectedIds.set([]); }
  openInviteDialog(): void { this.inviteDialogVisible.set(true); }
  closeInviteDialog(): void { this.inviteDialogVisible.set(false); }

  async executeBulkAction(action: InvitationBulkAction): Promise<number> {
    const ids = this.selectedIds();
    if (!ids.length) return 0;
    this.loading.set(true);
    await this.delay();
    let count = 0;
    if (action === 'resend') count = this.store.bulkResend(ids);
    else if (action === 'cancel') count = this.store.bulkCancel(ids);
    else if (action === 'export') { this.exportLoading.set(true); await this.delay(400); this.exportLoading.set(false); count = ids.length; }
    this.loading.set(false);
    this.clearSelection();
    return count;
  }

  private delay(ms = 500): Promise<void> {
    return new Promise((r) => window.setTimeout(r, ms));
  }
}
