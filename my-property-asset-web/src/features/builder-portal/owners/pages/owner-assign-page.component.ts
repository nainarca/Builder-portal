import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { ProjectStoreService } from '../../projects/services/project-store.service';
import { OwnerAssignmentWizardComponent } from '../components/form/owner-assignment-wizard.component';
import { OwnerAssignmentFormModel } from '../models/owner.model';
import { OwnerStoreService } from '../services/owner-store.service';

@Component({
  selector: 'app-owner-assign-page',
  imports: [BasePageComponent, PageHeaderComponent, OwnerAssignmentWizardComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="owner-page">
        <app-page-header
          eyebrow="Owners"
          title="Assign owner"
          description="Link a prospective or existing owner to an available unit and send an invitation."
        />
        <app-owner-assignment-wizard
          [initialModel]="initialModel"
          [existingOwners]="prospects()"
          [projects]="projects()"
          [availableUnits]="availableUnits()"
          (submitted)="onSubmit($event)"
        />
        <div class="owner-form-page-actions">
          <app-button label="Assign owner" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
    </app-base-page>
  `,
  styles: `
    .owner-form-page-actions {
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
export class OwnerAssignPageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(OwnerStoreService);
  private readonly projectStore = inject(ProjectStoreService);
  private readonly toast = inject(UiToastService);
  private readonly wizard = viewChild(OwnerAssignmentWizardComponent);

  readonly projects = computed(() => this.projectStore.projects());
  readonly availableUnits = computed(() => this.store.getAvailableUnits());
  readonly prospects = computed(() => this.store.owners().filter((o) => !o.archived && !this.store.getActiveAssignment(o.id)));

  readonly initialModel: OwnerAssignmentFormModel = {
    ownerMode: 'existing',
    existingOwnerId: '',
    newOwner: { firstName: '', lastName: '', email: '', phone: '', city: '', state: '', country: '' },
    projectId: '',
    unitId: '',
    notes: '',
  };

  saving = false;

  submit(): void {
    this.wizard()?.submit();
  }

  onSubmit(model: OwnerAssignmentFormModel): void {
    this.saving = true;
    const owner = model.ownerMode === 'new' ? this.store.create(model.newOwner) : this.store.getById(model.existingOwnerId);
    if (!owner) {
      this.saving = false;
      this.toast.error('Assignment failed', 'Could not resolve the selected owner.');
      return;
    }
    const assignment = this.store.createAssignment({
      owner,
      projectId: model.projectId,
      unitId: model.unitId,
      notes: model.notes || undefined,
    });
    this.saving = false;
    this.toast.success('Owner assigned', `${assignment.ownerName} has been assigned to ${assignment.unitNumber}.`);
    void this.router.navigate(['/builder-portal/owners', owner.id]);
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/owners']);
  }
}
