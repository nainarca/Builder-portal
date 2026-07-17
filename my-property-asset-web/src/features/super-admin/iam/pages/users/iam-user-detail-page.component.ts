import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, UiDialogService } from '@shared/ui';

import { SuperAdminPageComponent } from '../../../components/layout';

import { IamActivityTimelineComponent, IamSectionNavComponent, IamUserHeaderComponent } from '../../components/shared';
import {
  IamUserAccessReviewComponent, IamUserAuditSummaryComponent,
  IamUserOverviewComponent, IamUserPermissionSummaryComponent,
} from '../../components/users/detail';
import { IamUserStatusPanelComponent } from '../../components/users/status/iam-user-status-panel.component';
import { UserAdminRecord } from '../../models/user-admin.model';
import { UserAdminStoreService } from '../../services/user-admin-store.service';

@Component({
  selector: 'app-iam-user-detail-page',
  imports: [
    SuperAdminPageComponent,
    EmptyNoDataComponent,
    IamSectionNavComponent, IamUserHeaderComponent, IamUserOverviewComponent,
    IamUserPermissionSummaryComponent, IamActivityTimelineComponent, IamUserAuditSummaryComponent,
    IamUserAccessReviewComponent, IamUserStatusPanelComponent,
  ],
  templateUrl: './iam-user-detail-page.component.html',
  styleUrl: './iam-user-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(UserAdminStoreService);
  private readonly dialog = inject(UiDialogService);

  private readonly userId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });

  readonly user = computed(() => this.store.getById(this.userId()));
  readonly activities = computed(() => this.store.getActivities(this.userId()));
  readonly statusHistory = computed(() => this.store.getStatusHistory(this.userId()));
  readonly audits = computed(() => this.store.getAudits(this.userId()));
  readonly security = computed(() => {
    const u = this.user();
    return u ? this.store.getSecuritySummary(u) : null;
  });

  async onStatusChange(status: UserAdminRecord['status']): Promise<void> {
    const u = this.user();
    if (!u) return;
    if (status === 'archived' || status === 'suspended') {
      const action = status === 'archived' ? 'Archive' : 'Suspend';
      if (!(await this.dialog.confirm({ title: `${action} user`, message: `${action} "${u.displayName}"?`, acceptLabel: action, acceptSeverity: 'danger' }))) return;
    }
    if (status === 'active' && u.status === 'archived') {
      if (!(await this.dialog.confirm({ title: 'Restore user', message: `Restore "${u.displayName}"?`, acceptLabel: 'Restore' }))) return;
    }
    this.store.setStatus(u.id, status);
  }
}
