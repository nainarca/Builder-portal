import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import { BuilderFormComponent } from '../components/form/builder-form.component';
import { BuilderFormModel } from '../models/builder-admin.model';
import { BuilderAdminStoreService } from '../services/builder-admin-store.service';

@Component({
  selector: 'app-builder-edit-page',
  imports: [BasePageComponent, PageHeaderComponent, BuilderFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      @if (initialModel(); as model) {
        <div class="bldr-page">
          <app-page-header eyebrow="Builders" [title]="'Edit ' + model.companyName" description="Update builder profile and settings." />
          <app-bldr-form [initialModel]="model" (submitted)="onSubmit($event)" />
          <div class="bldr-form-page-actions">
            <app-button label="Save changes" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
            <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
          </div>
        </div>
      } @else {
        <div class="bldr-page bldr-page--empty"><h1 class="ui-page-title">Builder not found</h1></div>
      }
    </app-base-page>
  `,
  styles: `.bldr-form-page-actions { display: flex; gap: var(--mpa-spacing-sm); justify-content: flex-end; padding-top: var(--mpa-spacing-md); border-top: 1px solid var(--mpa-color-border); }`,
  styleUrl: './builder-edit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(BuilderAdminStoreService);
  private readonly form = viewChild(BuilderFormComponent);
  private readonly builderId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), { initialValue: '' });

  readonly initialModel = computed(() => {
    const b = this.store.getById(this.builderId());
    return b ? this.store.toFormModel(b) : null;
  });
  saving = false;

  submit(): void { this.form()?.submit(); }
  onSubmit(model: BuilderFormModel): void {
    const updated = this.store.update(this.builderId(), model);
    if (updated) void this.router.navigate(['/super-admin/builders', updated.id]);
  }
  cancel(): void { void this.router.navigate(['/super-admin/builders', this.builderId()]); }
}
