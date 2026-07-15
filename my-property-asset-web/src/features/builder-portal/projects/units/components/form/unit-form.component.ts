import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input, output, signal } from '@angular/core';

import {
  FormActionsComponent,
  FormContainerComponent,
  FormSectionComponent,
  InputTextComponent,
  MessageComponent,
  SelectComponent,
  SelectOption,
  StepperComponent,
  WizardStep,
} from '@shared/ui';

import { UNIT_STAGE_OPTIONS, UNIT_TYPE_OPTIONS } from '../../config/units.config';
import { Tower, UnitFormModel } from '../../models/unit.model';
import { UnitFormStateService } from '../../services/unit-form-state.service';

const STEP_FIELD_MAP: Record<number, (keyof UnitFormModel)[]> = {
  0: ['unitNumber', 'configuration', 'areaSqft'],
  1: ['towerId', 'floorNumber'],
  2: ['progress'],
};

const UNIT_STATUS_FORM_OPTIONS: readonly SelectOption[] = [
  { label: 'Available', value: 'available' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Sold', value: 'sold' },
  { label: 'Blocked', value: 'blocked' },
];

@Component({
  selector: 'app-unit-form',
  imports: [
    StepperComponent,
    FormContainerComponent,
    FormSectionComponent,
    FormActionsComponent,
    InputTextComponent,
    SelectComponent,
    MessageComponent,
  ],
  providers: [UnitFormStateService],
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(UnitFormStateService);

  readonly initialModel = input.required<UnitFormModel>();
  readonly towers = input.required<readonly Tower[]>();

  readonly submitted = output<UnitFormModel>();

  readonly steps: readonly WizardStep[] = [
    { id: 'basics', label: 'Basics' },
    { id: 'location', label: 'Tower & floor' },
    { id: 'construction', label: 'Construction & status' },
    { id: 'review', label: 'Review' },
  ];

  readonly activeIndex = signal(0);

  readonly typeOptions: readonly SelectOption[] = UNIT_TYPE_OPTIONS.filter((o) => o.value !== 'all');
  readonly stageOptions: readonly SelectOption[] = UNIT_STAGE_OPTIONS.filter((o) => o.value !== 'all');
  readonly statusOptions = UNIT_STATUS_FORM_OPTIONS;

  towerOptions(): readonly SelectOption[] {
    return this.towers().map((t) => ({ label: t.name, value: t.id }));
  }

  ngOnInit(): void {
    this.formState.initialize(this.initialModel());
  }

  ngOnDestroy(): void {
    this.formState.destroy();
  }

  nextStep(): void {
    if (this.activeIndex() < this.steps.length - 1) {
      this.activeIndex.update((i) => i + 1);
    }
  }

  backStep(): void {
    if (this.activeIndex() > 0) {
      this.activeIndex.update((i) => i - 1);
    }
  }

  goToStep(index: number): void {
    this.activeIndex.set(index);
  }

  submit(): boolean {
    if (!this.formState.validate()) {
      this.jumpToFirstErroredStep();
      return false;
    }
    const model = this.formState.model();
    if (model) {
      this.submitted.emit(model);
      this.formState.markPristine();
    }
    return true;
  }

  onTextChange<K extends keyof UnitFormModel>(field: K, value: string): void {
    this.formState.setField(field, value as UnitFormModel[K]);
  }

  onNumberChange(field: 'areaSqft' | 'floorNumber' | 'progress', value: string): void {
    this.formState.setField(field, Number(value) as UnitFormModel[typeof field]);
  }

  private jumpToFirstErroredStep(): void {
    const erroredFields = Object.keys(this.formState.errors());
    for (const [stepIndex, fields] of Object.entries(STEP_FIELD_MAP)) {
      if (fields.some((field) => erroredFields.includes(field))) {
        this.activeIndex.set(Number(stepIndex));
        return;
      }
    }
  }
}
