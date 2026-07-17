import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { StepperComponent } from '../../../composites/forms/stepper.component';
import { EnterpriseButtonComponent } from '../../buttons/enterprise-button.component';
import { StickyActionBarComponent } from '../../section/enterprise-section.component';
import {
  EnterpriseWizardPhase,
  EnterpriseWizardStep,
  ValidationIssue,
} from '../models/enterprise-form.models';
import { EnterpriseValidationSummaryComponent } from '../form-actions.component';

/**
 * DS-04 Enterprise Wizard — progress, step body, draft, review, confirmation, completion.
 */
@Component({
  selector: 'app-enterprise-wizard',
  imports: [
    StepperComponent,
    EnterpriseButtonComponent,
    StickyActionBarComponent,
    EnterpriseValidationSummaryComponent,
  ],
  template: `
    <div class="enterprise-wizard" [attr.aria-busy]="saving()">
      @if (phase() === 'steps') {
        <div class="enterprise-wizard__progress-meta" aria-live="polite">
          Step {{ activeIndex() + 1 }} of {{ steps().length }}
          @if (activeStep(); as step) {
            <span> — {{ step.label }}</span>
          }
        </div>

        <app-stepper
          [steps]="steps()"
          [activeIndex]="activeIndex()"
          (next)="onNext()"
          (back)="previous.emit()"
          (stepChange)="stepChange.emit($event)"
        >
          <ng-content />

          <div finalStepActions class="enterprise-wizard__final">
            @if (showReview()) {
              <app-enterprise-button
                variant="primary"
                label="Review"
                [disabled]="!canProceed()"
                (clicked)="review.emit()"
              />
            } @else {
              <ng-content select="[wizardFinalActions]" />
            }
          </div>
        </app-stepper>

        <app-enterprise-validation-summary [issues]="validationIssues()" />

        <app-sticky-action-bar ariaLabel="Wizard actions">
          <div stickyActions class="enterprise-wizard__sticky">
            @if (showSaveDraft()) {
              <app-enterprise-button
                variant="outline"
                label="Save Draft"
                [loading]="savingDraft()"
                [disabled]="saving()"
                (clicked)="saveDraft.emit($event)"
              />
            }
            @if (showSaveAndContinue()) {
              <app-enterprise-button
                variant="secondary"
                label="Save & Continue"
                [loading]="saving()"
                [disabled]="!canProceed()"
                (clicked)="saveAndContinue.emit($event)"
              />
            }
            <app-enterprise-button
              variant="ghost"
              label="Cancel"
              [disabled]="saving()"
              (clicked)="cancel.emit($event)"
            />
          </div>
        </app-sticky-action-bar>
      }

      @if (phase() === 'review') {
        <section class="enterprise-wizard__panel" aria-labelledby="wizard-review-title">
          <h2 id="wizard-review-title" class="enterprise-wizard__panel-title">Review</h2>
          <p class="enterprise-wizard__panel-copy">Confirm the details below before submitting.</p>
          <ng-content select="[wizardReview]" />
          <div class="enterprise-wizard__panel-actions">
            <app-enterprise-button variant="ghost" label="Back" (clicked)="backToSteps.emit()" />
            <app-enterprise-button
              variant="primary"
              [label]="confirmLabel()"
              [loading]="saving()"
              (clicked)="confirm.emit()"
            />
          </div>
        </section>
      }

      @if (phase() === 'confirmation') {
        <section class="enterprise-wizard__panel" aria-labelledby="wizard-confirm-title">
          <h2 id="wizard-confirm-title" class="enterprise-wizard__panel-title">Confirm</h2>
          <p class="enterprise-wizard__panel-copy">{{ confirmationMessage() }}</p>
          <ng-content select="[wizardConfirmation]" />
          <div class="enterprise-wizard__panel-actions">
            <app-enterprise-button variant="ghost" label="Back" (clicked)="review.emit()" />
            <app-enterprise-button
              variant="primary"
              [label]="submitLabel()"
              [loading]="saving()"
              (clicked)="submit.emit()"
            />
          </div>
        </section>
      }

      @if (phase() === 'completion') {
        <section class="enterprise-wizard__panel enterprise-wizard__panel--complete" aria-labelledby="wizard-done-title">
          <i class="pi pi-check-circle enterprise-wizard__complete-icon" aria-hidden="true"></i>
          <h2 id="wizard-done-title" class="enterprise-wizard__panel-title">{{ completionTitle() }}</h2>
          <p class="enterprise-wizard__panel-copy">{{ completionMessage() }}</p>
          <ng-content select="[wizardCompletion]" />
          <div class="enterprise-wizard__panel-actions">
            <app-enterprise-button
              variant="primary"
              [label]="completionActionLabel()"
              (clicked)="completionAction.emit($event)"
            />
          </div>
        </section>
      }
    </div>
  `,
  styleUrl: './wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseWizardComponent {
  readonly steps = input.required<readonly EnterpriseWizardStep[]>();
  readonly activeIndex = input(0);
  readonly phase = input<EnterpriseWizardPhase>('steps');
  readonly canProceed = input(true);
  readonly validationIssues = input<ValidationIssue[]>([]);
  readonly saving = input(false);
  readonly savingDraft = input(false);
  readonly showSaveDraft = input(true);
  readonly showSaveAndContinue = input(false);
  readonly showReview = input(true);

  readonly confirmLabel = input('Continue');
  readonly submitLabel = input('Submit');
  readonly confirmationMessage = input('Ready to submit? You can still go back and edit.');
  readonly completionTitle = input('All done');
  readonly completionMessage = input('Your changes were saved successfully.');
  readonly completionActionLabel = input('Done');

  readonly next = output<void>();
  readonly previous = output<void>();
  readonly stepChange = output<number>();
  readonly saveDraft = output<MouseEvent>();
  readonly saveAndContinue = output<MouseEvent>();
  readonly cancel = output<MouseEvent>();
  readonly review = output<void>();
  readonly backToSteps = output<void>();
  readonly confirm = output<void>();
  readonly submit = output<void>();
  readonly completionAction = output<MouseEvent>();

  readonly activeStep = computed(() => this.steps()[this.activeIndex()] ?? null);

  onNext(): void {
    if (this.canProceed()) {
      this.next.emit();
    }
  }
}
