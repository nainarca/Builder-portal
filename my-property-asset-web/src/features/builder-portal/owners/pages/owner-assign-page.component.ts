import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import { ProjectStoreService } from '../../projects/services/project-store.service';
import { OwnerAssignmentWizardComponent } from '../components/form/owner-assignment-wizard.component';
import { OwnerAssignmentFormModel } from '../models/owner.model';
import { OwnerStoreService } from '../services/owner-store.service';

@Component({
  selector: 'app-owner-assign-page',
  imports: [BuilderPortalPageComponent, EnterpriseFormShellComponent, OwnerAssignmentWizardComponent],
  template: `
    <app-bp-page>
      <app-enterprise-form-shell
        title="Assign owner"
        subtitle="Link a prospective or existing owner to an available unit and send an invitation."
        mode="create"
        [state]="saving ? 'saving' : 'idle'"
        (save)="submit()"
        (cancel)="cancel()"
      >
        <app-owner-assignment-wizard
          [initialModel]="initialModel"
          [existingOwners]="prospects()"
          [projects]="projects()"
          [availableUnits]="availableUnits()"
          (submitted)="onSubmit($event)"
        />
      </app-enterprise-form-shell>
    </app-bp-page>
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
