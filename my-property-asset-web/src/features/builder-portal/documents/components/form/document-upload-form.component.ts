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

import { DOCUMENT_CATEGORY_OPTIONS, DOCUMENT_VISIBILITY_OPTIONS } from '../../config/documents.config';
import { DocumentFormModel } from '../../models/document.model';
import { DocumentFormStateService } from '../../services/document-form-state.service';
import { Project } from '../../../projects/models/project.model';
import { Unit } from '../../../projects/units/models/unit.model';

const STEP_FIELDS: Record<number, (keyof DocumentFormModel)[]> = {
  0: ['name', 'customCategoryLabel', 'fileName'],
  1: ['projectId'],
};

const FILE_TYPE_OPTIONS: readonly SelectOption[] = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Image', value: 'image' },
  { label: 'Spreadsheet', value: 'spreadsheet' },
  { label: 'Word document', value: 'word' },
  { label: 'Other', value: 'other' },
];

@Component({
  selector: 'app-document-upload-form',
  imports: [
    StepperComponent,
    FormContainerComponent,
    FormSectionComponent,
    FormActionsComponent,
    InputTextComponent,
    SelectComponent,
    MessageComponent,
  ],
  providers: [DocumentFormStateService],
  templateUrl: './document-upload-form.component.html',
  styleUrl: './document-upload-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentUploadFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(DocumentFormStateService);

  readonly initialModel = input.required<DocumentFormModel>();
  readonly projects = input.required<readonly Project[]>();
  readonly units = input.required<readonly Unit[]>();

  readonly submitted = output<DocumentFormModel>();

  readonly steps: readonly WizardStep[] = [
    { id: 'basics', label: 'Basics' },
    { id: 'link', label: 'Link & visibility' },
    { id: 'review', label: 'Review' },
  ];

  readonly activeIndex = signal(0);

  readonly categoryOptions: readonly SelectOption[] = DOCUMENT_CATEGORY_OPTIONS.filter((o) => o.value !== 'all');
  readonly visibilityOptions: readonly SelectOption[] = DOCUMENT_VISIBILITY_OPTIONS.filter((o) => o.value !== 'all');
  readonly fileTypeOptions = FILE_TYPE_OPTIONS;

  projectOptions(): readonly SelectOption[] {
    return this.projects().map((p) => ({ label: p.name, value: p.id }));
  }

  unitOptions(): readonly SelectOption[] {
    const projectId = this.formState.model()?.projectId;
    const options = this.units()
      .filter((u) => !projectId || u.projectId === projectId)
      .map((u) => ({ label: `${u.unitNumber} · ${u.towerName}`, value: u.id }));
    return [{ label: 'No unit (project-level document)', value: '' }, ...options];
  }

  readonly selectedProjectName = computed(() => {
    const projectId = this.formState.model()?.projectId;
    return this.projects().find((p) => p.id === projectId)?.name ?? '—';
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

  onTextChange<K extends keyof DocumentFormModel>(field: K, value: string): void {
    this.formState.setField(field, value as DocumentFormModel[K]);
  }

  onProjectChange(value: string): void {
    this.formState.patch({ projectId: value, unitId: '' });
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
