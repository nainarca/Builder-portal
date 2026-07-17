import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ButtonComponent, EmptyNoDataComponent, EnterpriseDetailShellComponent, UiDialogService, UiToastService } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';

import { BuilderOrganizationService } from '../../../builder-portal/organization/services/builder-organization.service';
import {
  BuilderActivityTimelineComponent,
  BuilderAuditSummaryComponent,
  BuilderBrandingSummaryComponent,
  BuilderOverviewComponent,
} from '../components/detail';
import { BuilderContactsPanelComponent } from '../components/contacts';
import { BuilderHeaderComponent } from '../components/shared';
import { BuilderStatusPanelComponent } from '../components/status';
import { BuilderAdminRecord } from '../models/builder-admin.model';
import { BuilderAdminStoreService } from '../services/builder-admin-store.service';

@Component({
  selector: 'app-builder-detail-page',
  imports: [
    SuperAdminPageComponent,
    EmptyNoDataComponent,
    EnterpriseDetailShellComponent,
    ButtonComponent,
    BuilderHeaderComponent,
    BuilderOverviewComponent,
    BuilderBrandingSummaryComponent,
    BuilderContactsPanelComponent,
    BuilderActivityTimelineComponent,
    BuilderAuditSummaryComponent,
    BuilderStatusPanelComponent,
  ],
  templateUrl: './builder-detail-page.component.html',
  styleUrl: './builder-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(BuilderAdminStoreService);
  private readonly builderOrganizations = inject(BuilderOrganizationService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly builderId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly inviteTokenHint = toSignal(
    this.route.queryParamMap.pipe(map((q) => q.get('inviteToken'))),
    { initialValue: null as string | null },
  );

  readonly lastResendToken = signal<string | null>(null);

  readonly builder = computed(() => this.store.getById(this.builderId()));
  readonly contacts = computed(() => this.store.getContacts(this.builderId()));
  readonly activities = computed(() => this.store.getActivities(this.builderId()));
  readonly statusHistory = computed(() => this.store.getStatusHistory(this.builderId()));
  readonly audits = computed(() => this.store.getAudits(this.builderId()));

  readonly displayedInviteToken = computed(
    () => this.lastResendToken() ?? this.inviteTokenHint(),
  );

  async onStatusChange(status: BuilderAdminRecord['status']): Promise<void> {
    const b = this.builder();
    if (!b) return;
    if (status === 'archived') {
      if (
        !(await this.dialog.confirm({
          title: 'Archive builder',
          message: `Archive "${b.companyName}"?`,
          acceptLabel: 'Archive',
          acceptSeverity: 'danger',
        }))
      ) {
        return;
      }
    }
    if (status === 'active' && b.status === 'archived') {
      if (
        !(await this.dialog.confirm({
          title: 'Restore builder',
          message: `Restore "${b.companyName}"?`,
          acceptLabel: 'Restore',
        }))
      ) {
        return;
      }
    }
    this.store.setStatus(b.id, status);
  }

  async onDeactivate(): Promise<void> {
    const b = this.builder();
    if (!b) return;
    if (
      !(await this.dialog.confirm({
        title: 'Deactivate builder',
        message: `Deactivate "${b.companyName}"? Builder users will lose portal access.`,
        acceptLabel: 'Deactivate',
        acceptSeverity: 'danger',
      }))
    ) {
      return;
    }

    this.store.deactivate(b.id);
    if (b.organizationId) {
      const company = this.builderOrganizations.getCompanyByOrganizationId(b.organizationId);
      if (company) {
        this.builderOrganizations.deactivateCompany(company.id);
      }
    }
    this.toast.success('Builder deactivated');
  }

  onInviteOwner(): void {
    const b = this.builder();
    if (!b?.organizationId) {
      this.toast.error(
        'Missing organization',
        'Create this builder again to provision an organization.',
      );
      return;
    }

    const invited = this.builderOrganizations.inviteBuilderOwner(
      b.organizationId,
      b.primaryContactEmail,
    );
    if (!invited) {
      this.toast.error('Unable to invite owner');
      return;
    }

    this.store.inviteBuilderOwner(b.id);
    this.lastResendToken.set(invited.token);
    this.toast.success('Owner invited', 'Share the token via /auth/builder-invitation.');
  }

  onResendInvitation(): void {
    const b = this.builder();
    if (!b?.organizationId) {
      this.toast.error('Missing organization');
      return;
    }

    const pending = this.builderOrganizations
      .listInvitations(b.organizationId)
      .find(
        (i) =>
          i.invitedRole === 'builder_owner' &&
          (i.status === 'pending' || i.status === 'expired'),
      );

    if (!pending) {
      this.onInviteOwner();
      return;
    }

    const resent = this.builderOrganizations.resendInvitation(pending.id);
    if (!resent) {
      this.toast.error('Unable to resend invitation');
      return;
    }

    this.store.resendOwnerInvitation(b.id);
    this.lastResendToken.set(resent.token);
    this.toast.success('Invitation resent', 'Previous token is invalidated.');
  }
}
