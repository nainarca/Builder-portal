import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { EnterpriseFormShellComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../../components/layout';
import { IamSectionNavComponent } from '../../components/shared';
import { IamUserFormComponent } from '../../components/users/form/iam-user-form.component';
import { UserFormModel } from '../../models/user-admin.model';
import { UserAdminStoreService } from '../../services/user-admin-store.service';

@Component({
  selector: 'app-iam-user-create-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormShellComponent,
    IamSectionNavComponent,
    IamUserFormComponent,
  ],
  template: `
    <app-sa-page>
      <div class="iam-page">
        <app-enterprise-form-shell
          title="Create user"
          subtitle="Register a new platform user."
          mode="create"
          [state]="saving ? 'saving' : 'idle'"
          (save)="submit()"
          (cancel)="cancel()"
        >
          <app-iam-section-nav />
          <app-iam-user-form [initialModel]="initialModel" (submitted)="onSubmit($event)" />
        </app-enterprise-form-shell>
      </div>
    </app-sa-page>
  `,
  styleUrl: './iam-user-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserCreatePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(UserAdminStoreService);
  private readonly form = viewChild(IamUserFormComponent);
  readonly initialModel = this.store.emptyFormModel();
  saving = false;

  submit(): void { this.form()?.submit(); }
  onSubmit(model: UserFormModel): void {
    this.saving = true;
    const created = this.store.create(model);
    this.saving = false;
    void this.router.navigate(['/super-admin/iam/users', created.id]);
  }
  cancel(): void { void this.router.navigate(['/super-admin/iam/users']); }
}
