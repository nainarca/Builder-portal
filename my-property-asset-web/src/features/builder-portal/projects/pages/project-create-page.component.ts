import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { ProjectFormComponent } from '../components/form/project-form.component';
import { ProjectFormModel } from '../models/project.model';
import { ProjectStoreService } from '../services/project-store.service';

@Component({
  selector: 'app-project-create-page',
  imports: [BasePageComponent, PageHeaderComponent, ProjectFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="proj-page">
        <app-page-header
          eyebrow="Projects"
          title="Create project"
          description="Register a new development and begin tracking construction progress."
        />
        <app-proj-form [initialModel]="initialModel" (submitted)="onSubmit($event)" />
        <div class="proj-form-page-actions">
          <app-button label="Create project" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
    </app-base-page>
  `,
  styleUrl: './project-create-page.component.scss',
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
export class ProjectCreatePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(ProjectStoreService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(ProjectFormComponent);

  readonly initialModel = this.store.emptyFormModel();
  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: ProjectFormModel): void {
    this.saving = true;
    const created = this.store.create(model);
    this.saving = false;
    this.toast.success('Project created', `${created.name} has been added to your portfolio.`);
    void this.router.navigate(['/builder-portal/projects', created.id]);
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/projects/list']);
  }
}
