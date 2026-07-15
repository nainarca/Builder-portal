import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { UnitFormComponent } from '../components/form/unit-form.component';
import { UnitFormModel } from '../models/unit.model';
import { UnitStoreService } from '../services/unit-store.service';

@Component({
  selector: 'app-unit-create-page',
  imports: [BasePageComponent, PageHeaderComponent, UnitFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      <div class="unit-page">
        <app-page-header
          eyebrow="Units"
          title="Create unit"
          description="Register a new unit and begin tracking its construction progress."
        />
        <app-unit-form [initialModel]="initialModel()" [towers]="towers()" (submitted)="onSubmit($event)" />
        <div class="unit-form-page-actions">
          <app-button label="Create unit" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
          <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
        </div>
      </div>
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
export class UnitCreatePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(UnitStoreService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(UnitFormComponent);

  readonly projectId = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );

  readonly towers = computed(() => this.store.getTowers(this.projectId()));
  readonly initialModel = computed(() => this.store.emptyFormModel(this.projectId()));

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: UnitFormModel): void {
    this.saving = true;
    const created = this.store.create(this.projectId(), model);
    this.saving = false;
    this.toast.success('Unit created', `${created.unitNumber} has been added.`);
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units', created.id]);
  }

  cancel(): void {
    void this.router.navigate(['/builder-portal/projects', this.projectId(), 'units']);
  }
}
