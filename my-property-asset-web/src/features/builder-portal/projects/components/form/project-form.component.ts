import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';

import {
  DatePickerComponent,
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

import { PROJECT_HIERARCHY_OPTIONS, PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from '../../config/projects.config';
import { ProjectFormModel, ProjectHierarchy, ProjectType } from '../../models/project.model';
import { ProjectFormStateService } from '../../services/project-form-state.service';
import {
  allowedHierarchiesForProjectType,
  defaultHierarchyForProjectType,
} from '../../buildings/utils/project-building-compatibility';

const STEP_FIELD_MAP: Record<number, (keyof ProjectFormModel)[]> = {
  0: ['name', 'projectType', 'hierarchy'],
  1: ['city', 'launchDate', 'expectedCompletionDate', 'latitude', 'longitude'],
  2: ['status'],
};

@Component({
  selector: 'app-proj-form',
  imports: [
    StepperComponent,
    FormContainerComponent,
    FormSectionComponent,
    FormActionsComponent,
    InputTextComponent,
    SelectComponent,
    DatePickerComponent,
    MessageComponent,
  ],
  providers: [ProjectFormStateService],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(ProjectFormStateService);

  readonly initialModel = input.required<ProjectFormModel>();

  readonly submitted = output<ProjectFormModel>();

  readonly steps: readonly WizardStep[] = [
    { id: 'basics', label: 'Basics' },
    { id: 'location', label: 'Location & timeline' },
    { id: 'status', label: 'Status & media' },
    { id: 'review', label: 'Review' },
  ];

  readonly activeIndex = signal(0);

  readonly statusOptions: readonly SelectOption[] = PROJECT_STATUS_OPTIONS.filter(
    (o) => o.value !== 'all' && o.value !== 'archived',
  );
  readonly typeOptions: readonly SelectOption[] = PROJECT_TYPE_OPTIONS.filter((o) => o.value !== 'all');
  readonly allHierarchyOptions: readonly SelectOption[] = PROJECT_HIERARCHY_OPTIONS;

  hierarchyOptionsFor(type: ProjectType): readonly SelectOption[] {
    const allowed = new Set(allowedHierarchiesForProjectType(type));
    return this.allHierarchyOptions.filter((o) => allowed.has(o.value as ProjectHierarchy));
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

  onTextChange<K extends keyof ProjectFormModel>(field: K, value: string): void {
    if (field === 'projectType') {
      const nextType = value as ProjectType;
      const nextHierarchy = defaultHierarchyForProjectType(nextType);
      this.formState.patch({ projectType: nextType, hierarchy: nextHierarchy });
      return;
    }
    this.formState.setField(field, value as ProjectFormModel[K]);
  }

  onTextareaChange(field: 'description', event: Event): void {
    this.formState.setField(field, (event.target as HTMLTextAreaElement).value);
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
