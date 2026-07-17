import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import type {
  EnterpriseDetailStageStatus,
  EnterpriseDetailStageStep,
} from './models/enterprise-detail.models';

/**
 * Stage Tracker — sequential process chrome (UI-REBIRTH §5).
 * Current stage description expands below the pipeline.
 */
@Component({
  selector: 'app-enterprise-stage-tracker',
  template: `
    <div class="enterprise-stage-tracker" role="list" [attr.aria-label]="ariaLabel()">
      <div class="enterprise-stage-tracker__rail">
        @for (step of steps(); track step.id; let i = $index) {
          <button
            type="button"
            class="enterprise-stage-tracker__step mpa-focus-visible"
            role="listitem"
            [class.enterprise-stage-tracker__step--active]="step.id === activeId()"
            [class]="'enterprise-stage-tracker__step--' + step.status"
            [attr.aria-current]="step.id === activeId() ? 'step' : null"
            [disabled]="step.status === 'pending' && !step.href"
            (click)="onStep(step)"
          >
            <span class="enterprise-stage-tracker__dot" aria-hidden="true">
              @if (step.status === 'completed') {
                <i class="pi pi-check"></i>
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span class="enterprise-stage-tracker__label">{{ step.label }}</span>
          </button>
          @if (i < steps().length - 1) {
            <span class="enterprise-stage-tracker__connector" aria-hidden="true"></span>
          }
        }
      </div>

      @if (activeStep(); as active) {
        <div class="enterprise-stage-tracker__detail" role="region" [attr.aria-label]="active.label">
          <div class="enterprise-stage-tracker__detail-header">
            <h2 class="enterprise-stage-tracker__detail-title">{{ active.label }}</h2>
            <span class="enterprise-stage-tracker__status">{{ statusLabel(active.status) }}</span>
          </div>
          @if (active.description) {
            <p class="enterprise-stage-tracker__detail-body">{{ active.description }}</p>
          }
          <ng-content />
        </div>
      }
    </div>
  `,
  styles: `
    .enterprise-stage-tracker {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface);
    }
    .enterprise-stage-tracker__rail {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-stage-tracker__step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--mpa-spacing-xs);
      min-width: 4.5rem;
      max-width: 7rem;
      padding: var(--mpa-spacing-xs);
      border: 0;
      background: transparent;
      color: var(--mpa-color-text-muted);
      font: inherit;
      cursor: pointer;
      border-radius: var(--mpa-radius-md);
    }
    .enterprise-stage-tracker__step:hover:not(:disabled) {
      background: var(--mpa-color-surface-muted);
      color: var(--mpa-color-text);
    }
    .enterprise-stage-tracker__step:disabled {
      cursor: default;
      opacity: 0.7;
    }
    .enterprise-stage-tracker__step--active {
      color: var(--mpa-color-text);
    }
    .enterprise-stage-tracker__dot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--mpa-avatar-size-md);
      height: var(--mpa-avatar-size-md);
      border-radius: 999px;
      border: 2px solid var(--mpa-color-border);
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      background: var(--mpa-color-surface);
    }
    .enterprise-stage-tracker__step--completed .enterprise-stage-tracker__dot {
      border-color: var(--mpa-color-success);
      background: var(--mpa-color-success);
      color: var(--mpa-color-on-success, #fff);
    }
    .enterprise-stage-tracker__step--in-progress .enterprise-stage-tracker__dot,
    .enterprise-stage-tracker__step--active .enterprise-stage-tracker__dot {
      border-color: var(--mpa-color-primary);
      color: var(--mpa-color-primary);
    }
    .enterprise-stage-tracker__step--blocked .enterprise-stage-tracker__dot,
    .enterprise-stage-tracker__step--delayed .enterprise-stage-tracker__dot {
      border-color: var(--mpa-color-danger);
      color: var(--mpa-color-danger);
    }
    .enterprise-stage-tracker__label {
      font-size: var(--mpa-font-size-xs);
      text-align: center;
      line-height: 1.3;
    }
    .enterprise-stage-tracker__connector {
      flex: 1 1 1rem;
      min-width: 0.75rem;
      height: 2px;
      margin-top: calc(var(--mpa-avatar-size-md) / 2);
      background: var(--mpa-color-border);
      align-self: flex-start;
    }
    .enterprise-stage-tracker__detail {
      padding-top: var(--mpa-spacing-md);
      border-top: 1px solid var(--mpa-color-border);
      animation: enterprise-stage-detail-fade var(--mpa-animation-duration-normal)
        var(--mpa-animation-easing-standard);
    }
    .enterprise-stage-tracker__detail-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--mpa-spacing-sm);
      margin-bottom: var(--mpa-spacing-xs);
    }
    .enterprise-stage-tracker__detail-title {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-stage-tracker__status {
      font-size: var(--mpa-font-size-xs);
      font-weight: var(--mpa-font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--mpa-color-text-muted);
    }
    .enterprise-stage-tracker__detail-body {
      margin: 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    @keyframes enterprise-stage-detail-fade {
      from {
        opacity: 0.5;
      }
      to {
        opacity: 1;
      }
    }
    @media (max-width: 640px) {
      .enterprise-stage-tracker__connector {
        display: none;
      }
      .enterprise-stage-tracker__rail {
        gap: var(--mpa-spacing-sm);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseStageTrackerComponent {
  readonly steps = input.required<readonly EnterpriseDetailStageStep[]>();
  readonly activeStepId = input<string | undefined>(undefined);
  readonly ariaLabel = input('Process stages');

  readonly stepSelect = output<string>();

  readonly activeId = computed(() => {
    const explicit = this.activeStepId();
    if (explicit) {
      return explicit;
    }
    const inProgress = this.steps().find((s) => s.status === 'in-progress' || s.status === 'delayed');
    if (inProgress) {
      return inProgress.id;
    }
    const firstPending = this.steps().find((s) => s.status === 'pending');
    return firstPending?.id ?? this.steps()[0]?.id;
  });

  readonly activeStep = computed(() => this.steps().find((s) => s.id === this.activeId()));

  statusLabel(status: EnterpriseDetailStageStatus): string {
    switch (status) {
      case 'in-progress':
        return 'In progress';
      case 'completed':
        return 'Completed';
      case 'blocked':
        return 'Blocked';
      case 'delayed':
        return 'Delayed';
      case 'skipped':
        return 'Skipped';
      default:
        return 'Pending';
    }
  }

  onStep(step: EnterpriseDetailStageStep): void {
    this.stepSelect.emit(step.id);
  }
}
