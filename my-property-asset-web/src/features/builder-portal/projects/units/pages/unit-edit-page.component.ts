import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { UnitFormComponent } from '../components/form/unit-form.component';
import { UnitFormModel } from '../models/unit.model';
import { UnitStoreService } from '../services/unit-store.service';

@Component({
  selector: 'app-unit-edit-page',
  imports: [BasePageComponent, PageHeaderComponent, UnitFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      @if (initialModel(); as model) {
        <div class="unit-page">
          <app-page-header
            eyebrow="Units"
            [title]="'Edit ' + unit()!.unitNumber"
            description="Update unit details and construction status."
          />
          <app-unit-form [initialModel]="model" [towers]="towers()" (submitted)="onSubmit($event)" />
          <div class="unit-form-page-actions">
            <app-button label="Save changes" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
            <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
          </div>
        </div>
      } @else {
        <div class="unit-page unit-page--empty">
          <h1 class="ui-page-title">Unit not found</h1>
        </div>
      }
    </app-base-page>
  `,
  styles: `
    .unit-form-page-actions {
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
