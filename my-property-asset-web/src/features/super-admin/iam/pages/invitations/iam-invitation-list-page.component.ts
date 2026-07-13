import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { AuthorizedButtonComponent } from '@core/rbac';
import {
  BasePageComponent, PageHeaderComponent, SearchFieldComponent,
  TableShellComponent, TableToolbarComponent,
} from '@shared/ui';

import { IamInvitationDataGridComponent, IamInvitationQuickFiltersComponent, IamInviteUserFormComponent } from '../../components/invitations';
import { IamSectionNavComponent } from '../../components/shared';
import { InvitationAdminRecord, InvitationFormModel } from '../../models/invitation-admin.model';
import { InvitationAdminStoreService } from '../../services/invitation-admin-store.service';
import { InvitationListStateService } from '../../services/invitation-list-state.service';

@Component({
  selector: 'app-iam-invitation-list-page',
  imports: [
    BasePageComponent, PageHeaderComponent, TableShellComponent, TableToolbarComponent,
    SearchFieldComponent, AuthorizedButtonComponent, IamSectionNavComponent,
    IamInvitationDataGridComponent, IamInvitationQuickFiltersComponent, IamInviteUserFormComponent,
  ],
  template: `
    <app-base-page>
      <div class="iam-page">
        <app-page-header eyebrow="Identity & Access" title="Invitations"
          description="Manage user invitations, resend, and track acceptance status.">
          <app-authorized-button pageActions label="Invite user" icon="plus"
            permission="id-14-user-identity-access:operate" (clicked)="listState.openInviteDialog()" />
        </app-page-header>
        <app-iam-section-nav />
        <app-iam-invitation-quick-filters [selected]="listState.statusFilter()"
          (selectedChange)="listState.setStatusFilter($event)" />
        <app-table-shell [value]="tableItems()" [loading]="listState.loading()">
          <app-table-toolbar tableToolbar>
            <app-search-field toolbarStart [value]="listState.search()" placeholder="Search invitations…"
              ariaLabel="Search invitations" (valueChange)="listState.setSearch($event)" />
          </app-table-toolbar>
          <app-iam-invitation-data-grid [items]="listState.listResult().items" [loading]="listState.loading()"
            [total]="listState.listResult().total" [pageSize]="listState.pageSize()"
            (selectionChange)="onSelection($event)" (resend)="onResend($event)" (cancelInvitation)="onCancel($event)" />
        </app-table-shell>
        @if (listState.inviteDialogVisible()) {
          <app-iam-invite-user-form (invited)="onInvite($event)" (cancelled)="listState.closeInviteDialog()" />
        }
      </div>
    </app-base-page>
  `,
  styleUrl: './iam-invitation-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamInvitationListPageComponent {
  readonly listState = inject(InvitationListStateService);
  private readonly store = inject(InvitationAdminStoreService);
  readonly tableItems = computed(() => [...this.listState.listResult().items]);

  onSelection(s: readonly InvitationAdminRecord[]): void { this.listState.setSelection(s.map((i) => i.id)); }
  onResend(id: string): void { this.store.resend(id); }
  onCancel(id: string): void { this.store.cancel(id); }
  onInvite(model: InvitationFormModel): void {
    this.store.create(model);
    this.listState.closeInviteDialog();
  }
}
