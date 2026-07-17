import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { StepperComponent, WizardStep } from '../../composites/forms/stepper.component';
import type { EnterpriseWizardStep } from './models/enterprise-form.models';

/**
 * Step indicator — accessible progress chrome for wizards (UI-IMP-05 / P0.1 §2.3).
 * Thin presentation wrapper over the shared stepper list (body/actions optional).
 */
@Component({
  selector: 'app-enterprise-step-indicator',
  imports: [StepperComponent],
  template: `
    <div class="enterprise-step-indicator">
      @if (showMeta()) {
        <p class="enterprise-step-indicator__meta" aria-live="polite">
          Step {{ activeIndex() + 1 }} of {{ steps().length }}
          @if (activeLabel()) {
            <span> — {{ activeLabel() }}</span>
          }
        </p>
      }
      <app-stepper
        [steps]="steps()"
        [activeIndex]="activeIndex()"
        (next)="next.emit()"
        (back)="back.emit()"
        (stepChange)="stepChange.emit($event)"
      >
        <ng-content />
        <ng-content select="[finalStepActions]" finalStepActions />
      </app-stepper>
    </div>
  `,
  styles: `
    .enterprise-step-indicator__meta {
      margin: 0 0 var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseStepIndicatorComponent {
  readonly steps = input.required<readonly EnterpriseWizardStep[] | readonly WizardStep[]>();
  readonly activeIndex = input(0);
  readonly showMeta = input(true);

  readonly next = output<void>();
  readonly back = output<void>();
  readonly stepChange = output<number>();

  activeLabel(): string | undefined {
    return this.steps()[this.activeIndex()]?.label;
  }
}
