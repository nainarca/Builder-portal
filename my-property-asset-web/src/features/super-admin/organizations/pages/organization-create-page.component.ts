import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { EnterpriseFormShellComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';
import { OrganizationFormComponent } from '../components/form/organization-form.component';
import { OrganizationFormModel } from '../models/organization-admin.model';
import { OrganizationAdminStoreService } from '../services/organization-admin-store.service';

@Component({
  selector: 'app-organization-create-page',
  imports: [SuperAdminPageComponent, EnterpriseFormShellComponent, OrganizationFormComponent],
  template: `
    <app-sa-page>
      <app-enterprise-form-shell
        title="Create organization"
        subtitle="Register a new tenant on the MyPropertyAsset platform."
        mode="create"
        [state]="saving ? 'saving' : 'idle'"
        (save)="submit()"
        (cancel)="cancel()"
      >
        <app-org-form [initialModel]="initialModel" (submitted)="onSubmit($event)" />
      </app-enterprise-form-shell>
    </app-sa-page>
  `,
  styleUrl: './organization-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCreatePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(OrganizationAdminStoreService);
  private readonly form = viewChild(OrganizationFormComponent);

  readonly initialModel = this.store.emptyFormModel();
  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: OrganizationFormModel): void {
    this.saving = true;
    const created = this.store.create(model);
    this.saving = false;
    void this.router.navigate(['/super-admin/organizations', created.id]);
  }

  cancel(): void {
    void this.router.navigate(['/super-admin/organizations']);
  }
}
