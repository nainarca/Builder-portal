import { ChangeDetectionStrategy, Component, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, PageHeaderComponent, UiToastService } from '@shared/ui';

import { BuildingFormComponent } from '../components/form/building-form.component';
import { BuildingFormModel } from '../models/building.model';
import { BuildingUnsavedChangesHost } from '../guards/building-unsaved-changes.guard';
import { BuildingService } from '../services/building.service';

@Component({
  selector: 'app-building-edit-page',
  imports: [BasePageComponent, PageHeaderComponent, BuildingFormComponent, ButtonComponent],
  template: `
    <app-base-page>
      @if (building(); as b) {
        <div class="bldg-page">
          <app-page-header
            eyebrow="Buildings"
            title="Edit building"
            [description]="'Update ' + b.name"
          />
          <app-bldg-form
            [initialModel]="initialModel()"
            [codeExistsCheck]="codeExistsCheck"
            (submitted)="onSubmit($event)"
          />
          <div class="bldg-form-actions">
            <app-button label="Save changes" icon="pi pi-check" [loading]="saving" (clicked)="submit()" />
            <app-button label="Cancel" [outlined]="true" (clicked)="cancel()" />
          </div>
        </div>
      } @else {
        <h1 class="ui-page-title">Building not found</h1>
      }
    </app-base-page>
  `,
  styles: `
    .bldg-form-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid var(--mpa-color-border, #e5e7eb);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingEditPageComponent implements BuildingUnsavedChangesHost {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly buildings = inject(BuildingService);
  private readonly toast = inject(UiToastService);
  private readonly form = viewChild(BuildingFormComponent);

  private readonly projectId = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(map((p) => p.get('id') ?? '')),
    { initialValue: '' },
  );
  private readonly buildingId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('buildingId') ?? '')),
    { initialValue: '' },
  );

  readonly building = computed(() => this.buildings.getById(this.buildingId()));
  readonly initialModel = computed(() => {
    const b = this.building();
    return b ? this.buildings.toFormModel(b) : this.buildings.emptyFormModel();
  });

  readonly codeExistsCheck = (code: string): boolean =>
    this.buildings.codeExists(this.projectId(), code, this.buildingId());

  saving = false;

  submit(): void {
    this.form()?.submit();
  }

  onSubmit(model: BuildingFormModel): void {
    this.saving = true;
    try {
      const updated = this.buildings.update(this.buildingId(), model);
      if (!updated) {
        this.toast.error('Building not found');
        return;
      }
      this.toast.success('Building updated', `${updated.name} was saved.`);
      void this.router.navigate([
        '/builder-portal/projects',
        this.projectId(),
        'buildings',
        updated.id,
      ]);
    } catch (error) {
      this.toast.error('Unable to update building', error instanceof Error ? error.message : undefined);
    } finally {
      this.saving = false;
    }
  }

  cancel(): void {
    void this.router.navigate([
      '/builder-portal/projects',
      this.projectId(),
      'buildings',
      this.buildingId(),
    ]);
  }

  hasUnsavedChanges(): boolean {
    return this.form()?.hasUnsavedChanges() ?? false;
  }
}
