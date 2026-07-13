import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import { IamSectionNavComponent } from '../../components/shared';
import { IamUserFormComponent } from '../../components/users/form/iam-user-form.component';
import { UserFormModel } from '../../models/user-admin.model';
import { UserAdminStoreService } from '../../services/user-admin-store.service';

@Component({
  selector: 'app-iam-user-edit-page',
  imports: [BasePageComponent, PageHeaderComponent, IamSectionNavComponent, IamUserFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      @if (initialModel(); as model) {
        <div class="iam-page">
          <app-page-header eyebrow="Users" [title]="'Edit ' + model.displayName" description="Update user profile and access." />
          <app-iam-section-nav />
          <app-iam-user-form [initialModel]="model" (submitted)="onSubmit($event)" />
          <div class="iam-form-page-actions">
            <app-button label="Save changes" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
            <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
          </div>
        </div>
      } @else {
        <div class="iam-page iam-page--empty"><h1 class="ui-page-title">User not found</h1></div>
      }
    </app-base-page>
  `,
  styles: `.iam-form-page-actions { display: flex; gap: var(--mpa-spacing-sm); justify-content: flex-end; padding-top: var(--mpa-spacing-md); border-top: 1px solid var(--mpa-color-border); }`,
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
