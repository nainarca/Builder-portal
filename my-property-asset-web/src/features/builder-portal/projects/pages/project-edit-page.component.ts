import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { ProjectFormComponent } from '../components/form/project-form.component';
import { ProjectFormModel } from '../models/project.model';
import { ProjectStoreService } from '../services/project-store.service';

@Component({
  selector: 'app-project-edit-page',
  imports: [BasePageComponent, PageHeaderComponent, ProjectFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      @if (initialModel(); as model) {
        <div class="proj-page">
          <app-page-header
            eyebrow="Projects"
            [title]="'Edit ' + model.name"
            description="Update project details and construction status."
          />
          <app-proj-form [initialModel]="model" (submitted)="onSubmit($event)" />
          <div class="proj-form-page-actions">
            <app-button label="Save changes" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
            <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
          </div>
        </div>
      } @else {
        <div class="proj-page proj-page--empty">
          <h1 class="ui-page-title">Project not found</h1>
        </div>
      }
    </app-base-page>
  `,
  styleUrl: './project-edit-page.component.scss',
  styles: `
    .proj-form-page-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-sm);
      justify-content: flex-end;
      padding-top: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
    }
  `,
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
