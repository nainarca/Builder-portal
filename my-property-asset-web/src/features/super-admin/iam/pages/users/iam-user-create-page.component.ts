import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import { IamSectionNavComponent } from '../../components/shared';
import { IamUserFormComponent } from '../../components/users/form/iam-user-form.component';
import { UserFormModel } from '../../models/user-admin.model';
import { UserAdminStoreService } from '../../services/user-admin-store.service';

@Component({
  selector: 'app-iam-user-create-page',
  imports: [BasePageComponent, PageHeaderComponent, IamSectionNavComponent, IamUserFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="iam-page">
        <app-page-header eyebrow="Identity & Access" title="Create user" description="Register a new platform user." />
        <app-iam-section-nav />
        <app-iam-user-form [initialModel]="initialModel" (submitted)="onSubmit($event)" />
        <div class="iam-form-page-actions">
          <app-button label="Create user" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
    </app-base-page>
  `,
  styles: `.iam-form-page-actions { display: flex; gap: var(--mpa-spacing-sm); justify-content: flex-end; padding-top: var(--mpa-spacing-md); border-top: 1px solid var(--mpa-color-border); }`,
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
