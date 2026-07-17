import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import { ProjectFormComponent } from '../components/form/project-form.component';
import { ProjectFormModel } from '../models/project.model';
import { ProjectStoreService } from '../services/project-store.service';
import { PlanEnforcementService } from '../../subscription/services/plan-enforcement.service';

@Component({
  selector: 'app-project-create-page',
  imports: [BuilderPortalPageComponent, EnterpriseFormShellComponent, ProjectFormComponent],
  template: `
    <app-bp-page>
      <app-enterprise-form-shell
        title="Create project"
        subtitle="Register a new development and begin tracking construction progress."
        mode="create"
        [state]="saving ? 'saving' : 'idle'"
        (save)="submit()"
        (cancel)="cancel()"
      >
        <app-proj-form
          layoutMode="wizard"
          [initialModel]="initialModel"
          (submitted)="onSubmit($event)"
        />
      </app-enterprise-form-shell>
    </app-bp-page>
  `,
  styleUrl: './project-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCreatePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(ProjectStoreService);
  private readonly toast = inject(UiToastService);
  private readonly enforcement = inject(PlanEnforcementService);
  private readonly form = viewChild(ProjectFormComponent);

  readonly initialModel = this.store.emptyFormModel();
  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: ProjectFormModel): void {
    const check = this.enforcement.check('create_project');
    if (!check.allowed) {
      this.toast.warn('Upgrade required', check.reason ?? 'Plan limit reached.');
      void this.router.navigate(['/builder-portal/subscription/plans']);
      return;
    }
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
