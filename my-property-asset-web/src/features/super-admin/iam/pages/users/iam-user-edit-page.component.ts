import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, EnterpriseFormShellComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../../components/layout';
import { IamSectionNavComponent } from '../../components/shared';
import { IamUserFormComponent } from '../../components/users/form/iam-user-form.component';
import { UserFormModel } from '../../models/user-admin.model';
import { UserAdminStoreService } from '../../services/user-admin-store.service';

@Component({
  selector: 'app-iam-user-edit-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormShellComponent,
    EmptyNoDataComponent,
    IamSectionNavComponent,
    IamUserFormComponent,
  ],
  template: `
    <app-sa-page>
      @if (initialModel(); as model) {
        <div class="iam-page">
          <app-enterprise-form-shell
            [title]="'Edit ' + model.displayName"
            subtitle="Update user profile and access."
            mode="edit"
            [state]="saving ? 'saving' : 'idle'"
            (save)="submit()"
            (cancel)="cancel()"
          >
            <app-iam-section-nav />
            <app-iam-user-form [initialModel]="model" (submitted)="onSubmit($event)" />
          </app-enterprise-form-shell>
        </div>
      } @else {
        <app-empty-no-data
          title="User not found"
          description="The requested user does not exist or was removed."
        />
      }
    </app-sa-page>
  `,
  styleUrl: './iam-user-edit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamUserEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(UserAdminStoreService);
  private readonly form = viewChild(IamUserFormComponent);
  private readonly userId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });

  readonly initialModel = computed(() => {
    const u = this.store.getById(this.userId());
    return u ? this.store.toFormModel(u) : null;
  });
  saving = false;

  submit(): void { this.form()?.submit(); }
  onSubmit(model: UserFormModel): void {
    const updated = this.store.update(this.userId(), model);
    if (updated) void this.router.navigate(['/super-admin/iam/users', updated.id]);
  }
  cancel(): void { void this.router.navigate(['/super-admin/iam/users', this.userId()]); }
}
