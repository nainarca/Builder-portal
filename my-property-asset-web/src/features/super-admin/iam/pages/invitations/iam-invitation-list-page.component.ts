import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  EnterpriseDataTableShellComponent,
  EnterpriseFormPageHeaderComponent,
} from '@shared/ui';

import { SuperAdminPageComponent } from '../../../components/layout';
import { mapQuickFilters } from '../../../utils/super-admin-table.helpers';
import { IamInvitationDataGridComponent, IamInviteUserFormComponent } from '../../components/invitations';
import { IamSectionNavComponent } from '../../components/shared';
import { InvitationAdminRecord, InvitationFormModel, InvitationStatus } from '../../models/invitation-admin.model';
import { InvitationAdminStoreService } from '../../services/invitation-admin-store.service';
import { InvitationListStateService } from '../../services/invitation-list-state.service';

const STATUS_QUICK_FILTER_OPTIONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'pending' as const, label: 'Pending' },
  { id: 'accepted' as const, label: 'Accepted' },
  { id: 'expired' as const, label: 'Expired' },
  { id: 'cancelled' as const, label: 'Cancelled' },
];

@Component({
  selector: 'app-iam-invitation-list-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormPageHeaderComponent,
    EnterpriseDataTableShellComponent,
    AuthorizedButtonComponent,
    IamSectionNavComponent,
    IamInvitationDataGridComponent,
    IamInviteUserFormComponent,
  ],
  template: `
    <app-sa-page>
      <div class="iam-page">
        <app-enterprise-form-page-header
          eyebrow="Identity & Access"
          title="Invitations"
          subtitle="Manage user invitations, resend, and track acceptance status."
          mode="view"
        >
          <app-authorized-button
            formHeaderActions
            label="Invite user"
            icon="plus"
            permission="id-14-user-identity-access:operate"
            (clicked)="listState.openInviteDialog()"
          />
        </app-enterprise-form-page-header>
        <app-iam-section-nav />
        <app-enterprise-data-table-shell
          [state]="listState.loading() ? 'loading' : 'idle'"
          [searchValue]="listState.search()"
          searchPlaceholder="Search invitations…"
          tableAriaLabel="Invitations table"
          [quickFilters]="statusQuickFilters()"
          [showColumnSelector]="false"
          [showExport]="false"
          [showDensity]="false"
          [showPagination]="false"
          (searchChange)="listState.setSearch($event)"
          (quickFilterToggle)="onStatusFilter($event)"
        >
          <app-iam-invitation-data-grid
            tableBody
            [items]="listState.listResult().items"
            [loading]="listState.loading()"
            [total]="listState.listResult().total"
            [pageSize]="listState.pageSize()"
            (selectionChange)="onSelection($event)"
            (resend)="onResend($event)"
            (cancelInvitation)="onCancel($event)"
          />
        </app-enterprise-data-table-shell>
        @if (listState.inviteDialogVisible()) {
          <app-iam-invite-user-form
            (invited)="onInvite($event)"
            (cancelled)="listState.closeInviteDialog()"
          />
        }
      </div>
    </app-sa-page>
  `,
  styleUrl: './iam-invitation-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamInvitationListPageComponent {
  readonly listState = inject(InvitationListStateService);
  private readonly store = inject(InvitationAdminStoreService);

  readonly statusQuickFilters = computed(() =>
    mapQuickFilters(STATUS_QUICK_FILTER_OPTIONS, this.listState.statusFilter()),
  );

  onStatusFilter(filterId: string): void {
    this.listState.setStatusFilter(filterId as InvitationStatus | 'all');
  }

  onSelection(selection: readonly InvitationAdminRecord[]): void {
    this.listState.setSelection(selection.map((item) => item.id));
  }

  onResend(id: string): void {
    this.store.resend(id);
  }

  onCancel(id: string): void {
    this.store.cancel(id);
  }

  onInvite(model: InvitationFormModel): void {
    this.store.create(model);
    this.listState.closeInviteDialog();
  }
}
