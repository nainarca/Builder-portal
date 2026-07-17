import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { ButtonComponent, EmptyNoDataComponent, UiDialogService, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';

import { BuildingService } from '../buildings/services/building.service';
import {
  buildingsAreRequired,
  buildingsAreSupported,
} from '../buildings/utils/project-building-compatibility';
import {
  ProjectGalleryPlaceholderComponent,
  ProjectLocationCardComponent,
  ProjectMapPlaceholderComponent,
  ProjectOverviewComponent,
  ProjectSummaryRowComponent,
} from '../components/detail';
import { ProjectHeaderComponent } from '../components/shared';
import { ProjectStoreService } from '../services/project-store.service';

@Component({
  selector: 'app-project-detail-page',
  imports: [
    BuilderPortalPageComponent,
    EmptyNoDataComponent,
    ButtonComponent,
    ProjectHeaderComponent,
    ProjectOverviewComponent,
    ProjectLocationCardComponent,
    ProjectSummaryRowComponent,
    ProjectMapPlaceholderComponent,
    ProjectGalleryPlaceholderComponent,
  ],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(ProjectStoreService);
  private readonly buildings = inject(BuildingService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly projectId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly project = computed(() => this.store.getById(this.projectId()));
  readonly buildingStats = computed(() => this.buildings.dashboardStats(this.projectId()));
  readonly showBuildings = computed(() => {
    const p = this.project();
    return p ? buildingsAreSupported(p) : false;
  });
  readonly buildingsRequired = computed(() => {
    const p = this.project();
    return p ? buildingsAreRequired(p) : false;
  });

  goToBuildings(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'buildings']);
  }

  async onArchive(): Promise<void> {
    const project = this.project();
    if (!project) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Archive project',
      message: `Archive "${project.name}"? It will be hidden from the default list view until restored.`,
      acceptLabel: 'Archive',
      acceptSeverity: 'danger',
    });
    if (!confirmed) {
      return;
    }
    this.store.archive(project.id);
    this.toast.success('Project archived', `${project.name} has been archived.`);
  }

  async onRestore(): Promise<void> {
    const project = this.project();
    if (!project) {
      return;
    }
    const confirmed = await this.dialog.confirm({
      title: 'Restore project',
      message: `Restore "${project.name}" to the active portfolio?`,
      acceptLabel: 'Restore',
    });
    if (!confirmed) {
      return;
    }
    this.store.restore(project.id);
    this.toast.success('Project restored', `${project.name} is active again.`);
  }
}
