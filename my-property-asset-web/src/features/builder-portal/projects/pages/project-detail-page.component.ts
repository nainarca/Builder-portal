import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, UiDialogService, UiToastService } from '@shared/ui';

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
    BasePageComponent,
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
  private readonly store = inject(ProjectStoreService);
  private readonly dialog = inject(UiDialogService);
  private readonly toast = inject(UiToastService);

  private readonly projectId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly project = computed(() => this.store.getById(this.projectId()));

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
