import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../../components/layout';
import { ProjectStoreService } from '../../services/project-store.service';
import { BuildingFormComponent } from '../components/form/building-form.component';
import { BuildingFormModel } from '../models/building.model';
import { BuildingUnsavedChangesHost } from '../guards/building-unsaved-changes.guard';
import { BuildingService } from '../services/building.service';

@Component({
  selector: 'app-building-create-page',
  imports: [BuilderPortalPageComponent, EnterpriseFormShellComponent, BuildingFormComponent],
  template: `
    <app-bp-page>
      <app-enterprise-form-shell
        title="Create building"
        subtitle="Add a tower or block under this project. Codes must be unique within the project."
        mode="create"
        [state]="saving ? 'saving' : 'idle'"
        (save)="submit()"
        (cancel)="cancel()"
      >
        <app-bldg-form
          [initialModel]="initialModel()"
          [codeExistsCheck]="codeExistsCheck"
          (submitted)="onSubmit($event)"
        />
      </app-enterprise-form-shell>
    </app-bp-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingCreatePageComponent implements BuildingUnsavedChangesHost {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly buildings = inject(BuildingService);
  private readonly projects = inject(ProjectStoreService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(BuildingFormComponent);

  private readonly projectId = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly initialModel = computed(() => {
    const existing = this.buildings.listForProject(this.projectId(), true);
    const nextOrder = existing.length
      ? Math.max(...existing.map((b) => b.displayOrder)) + 1
      : 1;
    return this.buildings.emptyFormModel(nextOrder);
  });

  readonly codeExistsCheck = (code: string): boolean =>
    this.buildings.codeExists(this.projectId(), code);

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: BuildingFormModel): void {
    const project = this.projects.getById(this.projectId());
    if (!project) {
      this.toast.error('Project not found');
      return;
    }
    if (project.hierarchy === 'direct-units') {
      this.toast.error('Buildings are not allowed for Direct Units projects');
      void this.router.navigate(['/builder-portal/projects', this.projectId()]);
      return;
    }

    this.saving = true;
    try {
      const created = this.buildings.create(this.projectId(), model);
      this.toast.success('Building created', `${created.name} was added.`);
      void this.router.navigate([
        '/builder-portal/projects',
        this.projectId(),
        'buildings',
        created.id,
      ]);
    } catch (error) {
      this.toast.error('Unable to create building', error instanceof Error ? error.message : undefined);
    } finally {
      this.saving = false;
    }
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'buildings']);
  }

  hasUnsavedChanges(): boolean {
    return this.form()?.hasUnsavedChanges() ?? false;
  }
}
