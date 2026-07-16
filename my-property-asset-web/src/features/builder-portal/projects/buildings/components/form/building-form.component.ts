import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';

import {
  FormActionsComponent,
  FormContainerComponent,
  FormSectionComponent,
  InputTextComponent,
  SelectComponent,
  SelectOption,
} from '@shared/ui';

import { BUILDING_STATUS_OPTIONS } from '../../config/buildings.config';
import { BuildingFormModel } from '../../models/building.model';
import { BuildingFormStateService } from '../../services/building-form-state.service';

@Component({
  selector: 'app-bldg-form',
  imports: [
    FormContainerComponent,
    FormSectionComponent,
    FormActionsComponent,
    InputTextComponent,
    SelectComponent,
  ],
  providers: [BuildingFormStateService],
  template: `
    @if (formState.model(); as model) {
      <app-form-container>
        <app-form-section title="Building identity" description="Name, code, and tower/block labels">
          <div class="bldg-form__field">
            <span class="bldg-form__label">Building name *</span>
            <app-input-text
              [value]="model.name"
              [invalid]="!!formState.errors()['name']"
              (valueChange)="onText('name', $event)"
            />
            @if (formState.errors()['name']) {
              <small class="bldg-form__error">{{ formState.errors()['name'] }}</small>
            }
          </div>
          <div class="bldg-form__field">
            <span class="bldg-form__label">Building code *</span>
            <app-input-text
              [value]="model.code"
              [invalid]="!!formState.errors()['code']"
              (valueChange)="onText('code', $event)"
            />
            @if (formState.errors()['code']) {
              <small class="bldg-form__error">{{ formState.errors()['code'] }}</small>
            }
          </div>
          <div class="bldg-form__field">
            <span class="bldg-form__label">Tower name</span>
            <app-input-text [value]="model.towerName" (valueChange)="onText('towerName', $event)" />
          </div>
          <div class="bldg-form__field">
            <span class="bldg-form__label">Block name</span>
            <app-input-text [value]="model.blockName" (valueChange)="onText('blockName', $event)" />
          </div>
        </app-form-section>

        <app-form-section title="Capacity & status">
          <div class="bldg-form__field">
            <span class="bldg-form__label">Display order</span>
            <app-input-text
              [value]="'' + model.displayOrder"
              (valueChange)="onNumber('displayOrder', $event)"
            />
          </div>
          <div class="bldg-form__field">
            <span class="bldg-form__label">Number of floors</span>
            <app-input-text
              [value]="'' + model.floorsCount"
              [invalid]="!!formState.errors()['floorsCount']"
              (valueChange)="onNumber('floorsCount', $event)"
            />
          </div>
          <div class="bldg-form__field">
            <span class="bldg-form__label">Number of units (planned)</span>
            <app-input-text
              [value]="'' + model.unitsCount"
              [invalid]="!!formState.errors()['unitsCount']"
              (valueChange)="onNumber('unitsCount', $event)"
            />
          </div>
          <div class="bldg-form__field">
            <span class="bldg-form__label">Status</span>
            <app-select
              [options]="statusOptions"
              [value]="model.status"
              (valueChange)="onText('status', $event)"
            />
          </div>
        </app-form-section>

        <app-form-section title="Details">
          <div class="bldg-form__field bldg-form__field--full">
            <span class="bldg-form__label">Description</span>
            <textarea
              rows="3"
              [value]="model.description"
              (input)="onTextarea($event)"
            ></textarea>
          </div>
          <div class="bldg-form__field bldg-form__field--full">
            <span class="bldg-form__label">Building image URL</span>
            <app-input-text [value]="model.imageUrl" (valueChange)="onText('imageUrl', $event)" />
          </div>
          <div class="bldg-form__field bldg-form__field--full">
            <span class="bldg-form__label">Building address (optional)</span>
            <app-input-text [value]="model.addressLine" (valueChange)="onText('addressLine', $event)" />
          </div>
        </app-form-section>

        <app-form-actions>
          <ng-content select="[formActions]" />
        </app-form-actions>
      </app-form-container>
    }
  `,
  styles: `
    .bldg-form__field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 0.85rem;
    }
    .bldg-form__label {
      font-size: 0.875rem;
      font-weight: 600;
    }
    .bldg-form__error {
      color: var(--mpa-color-danger, #b91c1c);
    }
    textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid var(--mpa-color-border, #e5e7eb);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildingFormComponent implements OnInit {
  readonly formState = inject(BuildingFormStateService);

  readonly initialModel = input.required<BuildingFormModel>();
  readonly codeExistsCheck = input<(code: string) => boolean>();

  readonly submitted = output<BuildingFormModel>();

  readonly statusOptions: readonly SelectOption[] = BUILDING_STATUS_OPTIONS.filter(
    (o) => o.value !== 'all' && o.value !== 'archived',
  );

  ngOnInit(): void {
    this.formState.initialize(this.initialModel());
  }

  submit(): boolean {
    if (!this.formState.validate(this.codeExistsCheck())) {
      return false;
    }
    const model = this.formState.model();
    if (model) {
      this.submitted.emit(model);
      this.formState.markPristine();
    }
    return true;
  }

  hasUnsavedChanges(): boolean {
    return this.formState.hasUnsavedChanges();
  }

  onText<K extends keyof BuildingFormModel>(field: K, value: string): void {
    this.formState.setField(field, value as BuildingFormModel[K]);
  }

  onNumber(field: 'displayOrder' | 'floorsCount' | 'unitsCount', value: string): void {
    this.formState.setField(field, Number(value) || 0);
  }

  onTextarea(event: Event): void {
    this.formState.setField('description', (event.target as HTMLTextAreaElement).value);
  }
}
