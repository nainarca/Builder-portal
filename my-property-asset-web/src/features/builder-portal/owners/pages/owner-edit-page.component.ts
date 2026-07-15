import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { OwnerProfileFormComponent } from '../components/form/owner-profile-form.component';
import { OwnerFormModel } from '../models/owner.model';
import { OwnerStoreService } from '../services/owner-store.service';

@Component({
  selector: 'app-owner-edit-page',
  imports: [BasePageComponent, PageHeaderComponent, OwnerProfileFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      @if (initialModel(); as model) {
        <div class="owner-page">
          <app-page-header
            eyebrow="Owners"
            [title]="'Edit ' + owner()!.firstName + ' ' + owner()!.lastName"
            description="Update this customer's profile and contact information."
          />
          <app-owner-profile-form [initialModel]="model" (submitted)="onSubmit($event)" />
          <div class="owner-form-page-actions">
            <app-button label="Save changes" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
            <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
          </div>
        </div>
      } @else {
        <div class="owner-page owner-page--empty">
          <h1 class="ui-page-title">Owner not found</h1>
        </div>
      }
    </app-base-page>
  `,
  styles: `
    .owner-form-page-actions {
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
