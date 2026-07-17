import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ButtonComponent, EmptyNoDataComponent, UiDialogService, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../../components/layout';

import { ProjectStoreService } from '../../services/project-store.service';
import { BuildingHeaderComponent } from '../components/shared/building-header.component';
import { BuildingStatusBadgeComponent } from '../components/shared/building-status-badge.component';
import { BUILDING_STATUS_LABELS } from '../config/buildings.config';
import { BuildingService } from '../services/building.service';

@Component({
  selector: 'app-building-detail-page',
  imports: [
    BuilderPortalPageComponent,
    EmptyNoDataComponent,
    ButtonComponent,
    BuildingHeaderComponent,
    BuildingStatusBadgeComponent,
  ],
  templateUrl: './building-detail-page.component.html',
  styleUrl: './building-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly buildings = inject(BuildingService);
  private readonly projects = inject(ProjectStoreService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly buildingId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('buildingId') ?? '')),
    { initialValue: '' },
  );

  readonly building = computed(() => this.buildings.getById(this.buildingId()));
  readonly project = computed(() => {
    const b = this.building();
    return b ? this.projects.getById(b.projectId) : undefined;
  });

  readonly statusLabel = computed(() => {
    const b = this.building();
    return b ? BUILDING_STATUS_LABELS[b.status] ?? b.status : '';
  });

  async onArchive(): Promise<void> {
    const building = this.building();
    if (!building) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Archive building',
      message: `Archive "${building.name}"? Soft delete only — it can be restored later.`,
      acceptLabel: 'Archive',
      acceptSeverity: 'danger',
    });
    if (!confirmed) {
      return;
    }
    this.buildings.archive(building.id);
    this.toast.success('Building archived', `${building.name} has been archived.`);
  }

  async onRestore(): Promise<void> {
    const building = this.building();
    if (!building) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Restore building',
      message: `Restore "${building.name}" to the active building list?`,
      acceptLabel: 'Restore',
    });
    if (!confirmed) {
      return;
    }
    this.buildings.restore(building.id);
    this.toast.success('Building restored', `${building.name} is active again.`);
  }
}
