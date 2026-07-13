import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, UiDialogService } from '@shared/ui';

import { BuilderActivityTimelineComponent, BuilderAuditSummaryComponent, BuilderBrandingSummaryComponent, BuilderOverviewComponent } from '../components/detail';
import { BuilderContactsPanelComponent } from '../components/contacts';
import { BuilderHeaderComponent } from '../components/shared';
import { BuilderStatusPanelComponent } from '../components/status';
import { BuilderAdminRecord } from '../models/builder-admin.model';
import { BuilderAdminStoreService } from '../services/builder-admin-store.service';

@Component({
  selector: 'app-builder-detail-page',
  imports: [
    BasePageComponent, BuilderHeaderComponent, BuilderOverviewComponent, BuilderBrandingSummaryComponent,
    BuilderContactsPanelComponent, BuilderActivityTimelineComponent, BuilderAuditSummaryComponent, BuilderStatusPanelComponent,
  ],
  templateUrl: './builder-detail-page.component.html',
  styleUrl: './builder-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(BuilderAdminStoreService);
  private readonly dialog = inject(UiDialogService);

  private readonly builderId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });

  readonly builder = computed(() => this.store.getById(this.builderId()));
  readonly contacts = computed(() => this.store.getContacts(this.builderId()));
  readonly activities = computed(() => this.store.getActivities(this.builderId()));
  readonly statusHistory = computed(() => this.store.getStatusHistory(this.builderId()));
  readonly audits = computed(() => this.store.getAudits(this.builderId()));

  async onStatusChange(status: BuilderAdminRecord['status']): Promise<void> {
    const b = this.builder();
    if (!b) return;
    if (status === 'archived') {
      if (!(await this.dialog.confirm({ title: 'Archive builder', message: `Archive "${b.companyName}"?`, acceptLabel: 'Archive', acceptSeverity: 'danger' }))) return;
    }
    if (status === 'active' && b.status === 'archived') {
      if (!(await this.dialog.confirm({ title: 'Restore builder', message: `Restore "${b.companyName}"?`, acceptLabel: 'Restore' }))) return;
    }
    this.store.setStatus(b.id, status);
  }
}
