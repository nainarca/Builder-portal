import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import { ProjectFormComponent } from '../components/form/project-form.component';
import { ProjectFormModel } from '../models/project.model';
import { ProjectStoreService } from '../services/project-store.service';

@Component({
  selector: 'app-project-edit-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseFormShellComponent,
    EmptyNoDataComponent,
    ProjectFormComponent,
  ],
  template: `
    <app-bp-page>
      @if (initialModel(); as model) {
        <app-enterprise-form-shell
          [title]="'Edit ' + model.name"
          subtitle="Update project details and construction status."
          mode="edit"
          [state]="saving ? 'saving' : 'idle'"
          (save)="submit()"
          (cancel)="cancel()"
        >
          <app-proj-form
            layoutMode="single"
            [initialModel]="model"
            (submitted)="onSubmit($event)"
          />
        </app-enterprise-form-shell>
      } @else {
        <app-empty-no-data title="Project not found" description="The requested project does not exist or was removed."
        />
      }
    </app-bp-page>
  `,
  styleUrl: './project-edit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(ProjectStoreService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(ProjectFormComponent);

  private readonly projectId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly initialModel = computed(() => {
    const project = this.store.getById(this.projectId());
    return project ? this.store.toFormModel(project) : null;
  });

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: ProjectFormModel): void {
    const updated = this.store.update(this.projectId(), model);
    if (!updated) {
      return;
    }
    this.saving = false;
    this.toast.success('Project updated', `${updated.name} has been saved.`);
    void this.router.navigate(['/builder-portal/projects', updated.id]);
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId()]);
  }
}
