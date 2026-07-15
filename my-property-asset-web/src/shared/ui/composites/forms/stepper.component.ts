import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ButtonComponent } from '../../primitives/button/button.component';

export interface WizardStep {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
}

@Component({
  selector: 'app-stepper',
  imports: [ButtonComponent],
  template: `
    <nav class="ui-stepper" aria-label="Progress">
      <ol class="ui-stepper__list">
        @for (step of steps(); track step.id; let i = $index) {
          <li
            class="ui-stepper__item"
            [class.ui-stepper__item--active]="i === activeIndex()"
            [class.ui-stepper__item--complete]="i < activeIndex()"
          >
            <button
              type="button"
              class="ui-stepper__marker"
              [attr.aria-current]="i === activeIndex() ? 'step' : null"
              [disabled]="i > activeIndex()"
              (click)="onStepClick(i)"
            >
              @if (i < activeIndex()) {
                <i class="pi pi-check" aria-hidden="true"></i>
              } @else {
                {{ i + 1 }}
              }
            </button>
            <span class="ui-stepper__label">{{ step.label }}</span>
          </li>
        }
      </ol>
    </nav>

    <div class="ui-stepper__body">
      <ng-content />
    </div>

    <div class="ui-stepper__actions">
      <app-button
        label="Back"
        icon="pi pi-arrow-left"
        [outlined]="true"
        [disabled]="isFirst()"
        (clicked)="back.emit()"
      />
      @if (!isLast()) {
        <app-button label="Next" icon="pi pi-arrow-right" iconPos="right" (clicked)="next.emit()" />
      } @else {
        <ng-content select="[finalStepActions]" />
      }
    </div>
  `,
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  readonly steps = input.required<readonly WizardStep[]>();
  readonly activeIndex = input(0);

  readonly next = output<void>();
  readonly back = output<void>();
  readonly stepChange = output<number>();

  readonly isFirst = computed(() => this.activeIndex() === 0);
  readonly isLast = computed(() => this.activeIndex() === this.steps().length - 1);

  onStepClick(index: number): void {
    if (index <= this.activeIndex()) {
      this.stepChange.emit(index);
    }
  }
}
