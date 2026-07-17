import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../components/layout';
import { OwnerProfileFormComponent } from '../components/form/owner-profile-form.component';
import { OwnerFormModel } from '../models/owner.model';
import { OwnerStoreService } from '../services/owner-store.service';

@Component({
  selector: 'app-owner-edit-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseFormShellComponent,
    EmptyNoDataComponent,
    OwnerProfileFormComponent,
  ],
  template: `
    <app-bp-page>
      @if (initialModel(); as model) {
        <app-enterprise-form-shell
          [title]="'Edit ' + owner()!.firstName + ' ' + owner()!.lastName"
          subtitle="Update this customer's profile and contact information."
          mode="edit"
          [state]="saving ? 'saving' : 'idle'"
          (save)="submit()"
          (cancel)="cancel()"
        >
          <app-owner-profile-form [initialModel]="model" (submitted)="onSubmit($event)" />
        </app-enterprise-form-shell>
      } @else {
        <app-empty-no-data title="Owner not found" description="The requested owner does not exist or was removed."
        />
      }
    </app-bp-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(OwnerStoreService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(OwnerProfileFormComponent);

  private readonly ownerId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly owner = computed(() => this.store.getById(this.ownerId()));
  readonly initialModel = computed(() => {
    const owner = this.owner();
    return owner ? this.store.toFormModel(owner) : null;
  });

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: OwnerFormModel): void {
    const updated = this.store.update(this.ownerId(), model);
    if (!updated) {
      return;
    }
    this.saving = false;
    this.toast.success('Profile updated', `${updated.firstName} ${updated.lastName}'s profile has been saved.`);
    void this.router.navigate(['/builder-portal/owners', updated.id]);
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/owners', this.ownerId()]);
  }
}
