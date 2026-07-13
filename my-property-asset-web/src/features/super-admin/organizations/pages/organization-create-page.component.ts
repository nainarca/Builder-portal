import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import { OrganizationFormComponent } from '../components/form/organization-form.component';
import { OrganizationFormModel } from '../models/organization-admin.model';
import { OrganizationAdminStoreService } from '../services/organization-admin-store.service';

@Component({
  selector: 'app-organization-create-page',
  imports: [BasePageComponent, PageHeaderComponent, OrganizationFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="org-page">
        <app-page-header
          eyebrow="Organizations"
          title="Create organization"
          description="Register a new tenant on the MyPropertyAsset platform."
        />
        <app-org-form [initialModel]="initialModel" (submitted)="onSubmit($event)" />
        <div class="org-form-page-actions">
          <app-button
            label="Create organization"
            icon="pi pi-check"
            [loading]="saving"
            (clicked)="submit()"
          />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
    </app-base-page>
  `,
  styles: `
    .org-form-page-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--mpa-spacing-sm);
      justify-content: flex-end;
      padding-top: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
    }
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
