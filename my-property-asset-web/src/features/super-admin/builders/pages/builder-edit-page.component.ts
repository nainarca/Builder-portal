import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, EnterpriseFormShellComponent } from '@shared/ui';

import { SuperAdminPageComponent } from '../../components/layout';
import { BuilderFormComponent } from '../components/form/builder-form.component';
import { BuilderFormModel } from '../models/builder-admin.model';
import { BuilderAdminStoreService } from '../services/builder-admin-store.service';

@Component({
  selector: 'app-builder-edit-page',
  imports: [
    SuperAdminPageComponent,
    EnterpriseFormShellComponent,
    EmptyNoDataComponent,
    BuilderFormComponent,
  ],
  template: `
    <app-sa-page>
      @if (initialModel(); as model) {
        <app-enterprise-form-shell
          [title]="'Edit ' + model.companyName"
          subtitle="Update builder profile and settings."
          mode="edit"
          [state]="saving ? 'saving' : 'idle'"
          (save)="submit()"
          (cancel)="cancel()"
        >
          <app-bldr-form [initialModel]="model" (submitted)="onSubmit($event)" />
        </app-enterprise-form-shell>
      } @else {
        <app-empty-no-data
          title="Builder not found"
          description="The requested builder does not exist or was removed."
        />
      }
    </app-sa-page>
  `,
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
