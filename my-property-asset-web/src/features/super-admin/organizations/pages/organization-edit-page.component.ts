import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, EnterpriseFormShellComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';
import { OrganizationFormComponent } from '../components/form/organization-form.component';
import { OrganizationFormModel } from '../models/organization-admin.model';
import { OrganizationAdminStoreService } from '../services/organization-admin-store.service';

@Component({
  selector: 'app-organization-edit-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormShellComponent,
    EmptyNoDataComponent,
    OrganizationFormComponent,
  ],
  template: `
    <app-sa-page>
      @if (initialModel(); as model) {
        <app-enterprise-form-shell
          [title]="'Edit ' + model.name"
          subtitle="Update organization profile and settings."
          mode="edit"
          [state]="saving ? 'saving' : 'idle'"
          (save)="submit()"
          (cancel)="cancel()"
        >
          <app-org-form [initialModel]="model" (submitted)="onSubmit($event)" />
        </app-enterprise-form-shell>
      } @else {
        <app-empty-no-data
          title="Organization not found"
          description="The requested organization does not exist or was removed."
        />
      }
    </app-sa-page>
  `,
  styleUrl: './organization-edit-page.component.scss',
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
