import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent, EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../../components/layout';
import { UnitFormComponent } from '../components/form/unit-form.component';
import { UnitFormModel } from '../models/unit.model';
import { UnitStoreService } from '../services/unit-store.service';

@Component({
  selector: 'app-unit-edit-page',
  imports: [
    BuilderPortalPageComponent,
    EnterpriseFormShellComponent,
    EmptyNoDataComponent,
    UnitFormComponent,
  ],
  template: `
    <app-bp-page>
      @if (initialModel(); as model) {
        <app-enterprise-form-shell
          [title]="'Edit ' + unit()!.unitNumber"
          subtitle="Update unit details and construction status."
          mode="edit"
          [state]="saving ? 'saving' : 'idle'"
          (save)="submit()"
          (cancel)="cancel()"
        >
          <app-unit-form [initialModel]="model" [towers]="towers()" (submitted)="onSubmit($event)" />
        </app-enterprise-form-shell>
      } @else {
        <app-empty-no-data title="Unit not found" description="The requested unit does not exist or was removed."
        />
      }
    </app-bp-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(UnitStoreService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(UnitFormComponent);

  readonly projectId = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );
  private readonly unitId = toSignal(this.route.paramMap.pipe(map((p) => p.get('unitId') ?? '')), {
    initialValue: '',
  });

  readonly unit = computed(() => this.store.getById(this.unitId()));
  readonly towers = computed(() => this.store.getTowers(this.projectId()));
  readonly initialModel = computed(() => {
    const unit = this.unit();
    return unit ? this.store.toFormModel(unit) : null;
  });

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: UnitFormModel): void {
    const updated = this.store.update(this.unitId(), model);
    if (!updated) {
      return;
    }
    this.saving = false;
    this.toast.success('Unit updated', `${updated.unitNumber} has been saved.`);
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units', updated.id]);
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units', this.unitId()]);
  }
}
