import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { EnterpriseFormShellComponent, UiToastService } from '@shared/ui';

import { BuilderPortalPageComponent } from '../../../components/layout';
import { UnitFormComponent } from '../components/form/unit-form.component';
import { UnitFormModel } from '../models/unit.model';
import { UnitStoreService } from '../services/unit-store.service';
import { PlanEnforcementService } from '../../../subscription/services/plan-enforcement.service';

@Component({
  selector: 'app-unit-create-page',
  imports: [BuilderPortalPageComponent, EnterpriseFormShellComponent, UnitFormComponent],
  template: `
    <app-bp-page>
      <app-enterprise-form-shell
        title="Create unit"
        subtitle="Register a new unit and begin tracking its construction progress."
        mode="create"
        [state]="saving ? 'saving' : 'idle'"
        (save)="submit()"
        (cancel)="cancel()"
      >
        <app-unit-form [initialModel]="initialModel()" [towers]="towers()" (submitted)="onSubmit($event)" />
      </app-enterprise-form-shell>
    </app-bp-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitCreatePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(UnitStoreService);
  private readonly toast = inject(UiToastService);
  private readonly enforcement = inject(PlanEnforcementService);
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
    const check = this.enforcement.check('create_unit');
    if (!check.allowed) {
      this.toast.warn('Upgrade required', check.reason ?? 'Plan limit reached.');
      void this.router.navigate(['/builder-portal/subscription/plans']);
      return;
    }
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
