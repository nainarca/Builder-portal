import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BasePageComponent, ButtonComponent, PageHeaderComponent } from '@shared/ui';

import { BuilderFormComponent } from '../components/form/builder-form.component';
import { BuilderFormModel } from '../models/builder-admin.model';
import { BuilderAdminStoreService } from '../services/builder-admin-store.service';

@Component({
  selector: 'app-builder-create-page',
  imports: [BasePageComponent, PageHeaderComponent, BuilderFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="bldr-page">
        <app-page-header eyebrow="Builders" title="Create builder" description="Register a new builder organization on the platform." />
        <app-bldr-form [initialModel]="initialModel" (submitted)="onSubmit($event)" />
        <div class="bldr-form-page-actions">
          <app-button label="Create builder" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
    </app-base-page>
  `,
  styles: `.bldr-form-page-actions { display: flex; gap: var(--mpa-spacing-sm); justify-content: flex-end; padding-top: var(--mpa-spacing-md); border-top: 1px solid var(--mpa-color-border); }`,
  styleUrl: './builder-create-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderCreatePageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(BuilderAdminStoreService);
  private readonly form = viewChild(BuilderFormComponent);
  readonly initialModel = this.store.emptyFormModel();
  saving = false;

  submit(): void { this.form()?.submit(); }
  onSubmit(model: BuilderFormModel): void {
    this.saving = true;
    const created = this.store.create(model);
    this.saving = false;
    void this.router.navigate(['/super-admin/builders', created.id]);
  }
  cancel(): void { void this.router.navigate(['/super-admin/builders']); }
}
