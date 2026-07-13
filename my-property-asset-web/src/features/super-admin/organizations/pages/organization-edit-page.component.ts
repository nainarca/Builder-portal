import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import { OrganizationFormComponent } from '../components/form/organization-form.component';
import { OrganizationFormModel } from '../models/organization-admin.model';
import { OrganizationAdminStoreService } from '../services/organization-admin-store.service';

@Component({
  selector: 'app-organization-edit-page',
  imports: [BasePageComponent, PageHeaderComponent, OrganizationFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      @if (initialModel(); as model) {
        <div class="org-page">
          <app-page-header
            eyebrow="Organizations"
            [title]="'Edit ' + model.name"
            description="Update organization profile and settings."
          />
          <app-org-form [initialModel]="model" (submitted)="onSubmit($event)" />
          <div class="org-form-page-actions">
            <app-button
              label="Save changes"
              icon="pi pi-check"
              [loading]="saving"
              (clicked)="submit()"
            />
            <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
          </div>
        </div>
      } @else {
        <div class="org-page org-page--empty">
          <h1 class="ui-page-title">Organization not found</h1>
        </div>
      }
    </app-base-page>
  `,
  styleUrl: './organization-edit-page.component.scss',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(OrganizationAdminStoreService);
  private readonly form = viewChild(OrganizationFormComponent);

  private readonly orgId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly initialModel = computed(() => {
    const org = this.store.getById(this.orgId());
    return org ? this.store.toFormModel(org) : null;
  });

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: OrganizationFormModel): void {
    const updated = this.store.update(this.orgId(), model);
    if (!updated) {
      return;
    }
    this.saving = false;
    void this.router.navigate(['/super-admin/organizations', updated.id]);
  }

  cancel(): void {
    void this.router.navigate(['/super-admin/organizations', this.orgId()]);
  }
}
