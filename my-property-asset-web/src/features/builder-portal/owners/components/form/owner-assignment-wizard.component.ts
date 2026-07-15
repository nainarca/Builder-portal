import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, input, output, signal } from '@angular/core';

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

import { Project } from '../../../projects/models/project.model';
import { Unit } from '../../../projects/units/models/unit.model';
import { Owner, OwnerAssignmentFormModel } from '../../models/owner.model';
import { OwnerAssignmentFormStateService } from '../../services/owner-assignment-form-state.service';

const STEP_FIELDS: Record<number, string[]> = {
  0: ['existingOwnerId', 'newOwner.firstName', 'newOwner.lastName', 'newOwner.email', 'newOwner.phone'],
  1: ['projectId', 'unitId'],
};

@Component({
  selector: 'app-owner-assignment-wizard',
  imports: [
    StepperComponent,
    FormContainerComponent,
    FormSectionComponent,
    FormActionsComponent,
    InputTextComponent,
    SelectComponent,
    MessageComponent,
  ],
  providers: [OwnerAssignmentFormStateService],
  templateUrl: './owner-assignment-wizard.component.html',
  styleUrl: './owner-assignment-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerAssignmentWizardComponent implements OnInit, OnDestroy {
  readonly formState = inject(OwnerAssignmentFormStateService);

  readonly initialModel = input.required<OwnerAssignmentFormModel>();
  readonly existingOwners = input.required<readonly Owner[]>();
  readonly projects = input.required<readonly Project[]>();
  readonly availableUnits = input.required<readonly Unit[]>();

  readonly submitted = output<OwnerAssignmentFormModel>();

  readonly steps: readonly WizardStep[] = [
    { id: 'owner', label: 'Owner' },
    { id: 'unit', label: 'Unit' },
    { id: 'preview', label: 'Invitation preview' },
    { id: 'review', label: 'Review' },
  ];

  readonly activeIndex = signal(0);

  ownerOptions(): readonly SelectOption[] {
    return this.existingOwners().map((o) => ({ label: `${o.firstName} ${o.lastName} (${o.email})`, value: o.id }));
  }

  projectOptions(): readonly SelectOption[] {
    return this.projects().map((p) => ({ label: p.name, value: p.id }));
  }

  unitOptions(): readonly SelectOption[] {
    const projectId = this.formState.model()?.projectId;
    return this.availableUnits()
      .filter((unit) => !projectId || unit.projectId === projectId)
      .map((unit) => ({ label: `${unit.unitNumber} · ${unit.towerName} (${unit.configuration})`, value: unit.id }));
  }

  readonly selectedProjectName = computed(() => {
    const projectId = this.formState.model()?.projectId;
    return this.projects().find((p) => p.id === projectId)?.name ?? '—';
  });

  readonly selectedUnitNumber = computed(() => {
    const unitId = this.formState.model()?.unitId;
    return this.availableUnits().find((u) => u.id === unitId)?.unitNumber ?? '—';
  });

  readonly previewName = computed(() => {
    const model = this.formState.model();
    if (!model) {
      return '';
    }
    if (model.ownerMode === 'new') {
      return model.newOwner.firstName || 'there';
    }
    return this.existingOwners().find((o) => o.id === model.existingOwnerId)?.firstName ?? 'there';
  });

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

  setOwnerMode(mode: 'existing' | 'new'): void {
    this.formState.setField('ownerMode', mode);
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

  onProjectChange(value: string): void {
    this.formState.patch({ projectId: value, unitId: '' });
  }

  onUnitChange(value: string): void {
    this.formState.setField('unitId', value);
  }

  onExistingOwnerChange(value: string): void {
    this.formState.setField('existingOwnerId', value);
  }

  onNewOwnerFieldChange(field: keyof OwnerAssignmentFormModel['newOwner'], value: string): void {
    this.formState.setNewOwnerField(field, value);
  }

  onNotesChange(value: string): void {
    this.formState.setField('notes', value);
  }

  private jumpToFirstErroredStep(): void {
    const erroredFields = Object.keys(this.formState.errors());
    for (const [stepIndex, fields] of Object.entries(STEP_FIELDS)) {
      if (fields.some((field) => erroredFields.includes(field))) {
        this.activeIndex.set(Number(stepIndex));
        return;
      }
    }
  }
}
