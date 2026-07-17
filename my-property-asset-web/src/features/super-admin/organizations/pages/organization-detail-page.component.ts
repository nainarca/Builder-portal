import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, UiDialogService } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';

import {
  OrganizationActivityTimelineComponent,
  OrganizationAuditSummaryComponent,
  OrganizationBrandingSummaryComponent,
  OrganizationOverviewComponent,
} from '../components/detail';
import { OrganizationMembersListComponent } from '../components/members';
import { OrganizationHeaderComponent } from '../components/shared';
import { OrganizationStatusPanelComponent } from '../components/status';
import { OrganizationAdminRecord } from '../models/organization-admin.model';
import { OrganizationAdminStoreService } from '../services/organization-admin-store.service';

@Component({
  selector: 'app-organization-detail-page',
  imports: [
    SuperAdminPageComponent,
    EmptyNoDataComponent,
    OrganizationHeaderComponent,
    OrganizationOverviewComponent,
    OrganizationBrandingSummaryComponent,
    OrganizationMembersListComponent,
    OrganizationStatusPanelComponent,
    OrganizationActivityTimelineComponent,
    OrganizationAuditSummaryComponent,
  ],
  templateUrl: './organization-detail-page.component.html',
  styleUrl: './organization-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(OrganizationAdminStoreService);
  private readonly dialog = inject(UiDialogService);

  private readonly orgId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly org = computed(() => this.store.getById(this.orgId()));
  readonly members = computed(() => this.store.getMembers(this.orgId()));
  readonly activities = computed(() => this.store.getActivities(this.orgId()));
  readonly statusHistory = computed(() => this.store.getStatusHistory(this.orgId()));
  readonly audits = computed(() => this.store.getAudits(this.orgId()));

  async onStatusChange(status: OrganizationAdminRecord['status']): Promise<void> {
    const org = this.org();
    if (!org) {
      return;
    }

    if (status === 'archived') {
      const confirmed = await this.dialog.confirm({
        title: 'Archive organization',
        message: `Archive "${org.name}"? Members will lose access until restored.`,
        acceptLabel: 'Archive',
        acceptSeverity: 'danger',
      });
      if (!confirmed) {
        return;
      }
    }

    if (status === 'active' && org.status === 'archived') {
      const confirmed = await this.dialog.confirm({
        title: 'Restore organization',
        message: `Restore "${org.name}" to active status?`,
        acceptLabel: 'Restore',
      });
      if (!confirmed) {
        return;
      }
    }

    this.store.setStatus(org.id, status);
  }
}
