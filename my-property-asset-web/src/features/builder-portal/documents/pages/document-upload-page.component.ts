import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { ProjectStoreService } from '../../projects/services/project-store.service';
import { UnitStoreService } from '../../projects/units/services/unit-store.service';
import { DocumentUploadFormComponent } from '../components/form/document-upload-form.component';
import { DocumentFormModel } from '../models/document.model';
import { DocumentStoreService } from '../services/document-store.service';
import { PlanEnforcementService } from '../../subscription/services/plan-enforcement.service';

@Component({
  selector: 'app-document-upload-page',
  imports: [BasePageComponent, PageHeaderComponent, DocumentUploadFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="doc-page">
        <app-page-header
          eyebrow="Documents"
          title="Add document"
          description="Capture document metadata, category, and visibility — no real file is uploaded in this framework."
        />
        <app-document-upload-form
          [initialModel]="initialModel"
          [projects]="projects()"
          [units]="units()"
          (submitted)="onSubmit($event)"
        />
        <div class="doc-form-page-actions">
          <app-button label="Save document" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
    </app-base-page>
  `,
  styles: `
    .doc-form-page-actions {
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
export class DocumentUploadPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DocumentStoreService);
  private readonly projectStore = inject(ProjectStoreService);
  private readonly unitStore = inject(UnitStoreService);
  private readonly toast = inject(UiToastService);
  private readonly enforcement = inject(PlanEnforcementService);
  private readonly form = viewChild(DocumentUploadFormComponent);

  readonly projects = computed(() => this.projectStore.projects());
  readonly units = computed(() => this.unitStore.units());
  readonly initialModel: DocumentFormModel = {
    ...this.store.emptyFormModel(),
    projectId: this.route.snapshot.queryParamMap.get('projectId') ?? '',
    unitId: this.route.snapshot.queryParamMap.get('unitId') ?? '',
  };

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: DocumentFormModel): void {
    const check = this.enforcement.check('upload_document');
    if (!check.allowed) {
      this.toast.warn('Upgrade required', check.reason ?? 'Plan limit reached.');
      void this.router.navigate(['/builder-portal/subscription/plans']);
      return;
    }
    this.saving = true;
    const created = this.store.create(model);
    this.saving = false;
    this.toast.success('Document added', `${created.name} has been created as a draft.`);
    void this.router.navigate(['/builder-portal/documents', created.id]);
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/documents']);
  }
}
