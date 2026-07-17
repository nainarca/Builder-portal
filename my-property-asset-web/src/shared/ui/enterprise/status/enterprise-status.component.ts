import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { BadgeComponent } from '../../primitives/badge/badge.component';
import { ChipComponent } from '../../primitives/chip/chip.component';
import { TagComponent } from '../../primitives/tag/tag.component';
import { StatusBadgeComponent } from '../../composites/notification/status-badge.component';
import { EnterpriseHealthLevel } from '../models/enterprise.models';

/** Re-export friendly aliases for DS-03 inventory. */
@Component({
  selector: 'app-enterprise-badge',
  imports: [BadgeComponent],
  template: `<app-badge [value]="value()" [severity]="severity()" [size]="size()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseBadgeComponent {
  readonly value = input<string | undefined>(undefined);
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>('secondary');
  readonly size = input<'large' | 'xlarge' | undefined>(undefined);
}

@Component({
  selector: 'app-enterprise-chip',
  imports: [ChipComponent],
  template: `<app-chip [label]="label()" [icon]="icon()" [removable]="removable()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseChipComponent {
  readonly label = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly removable = input(false);
}

@Component({
  selector: 'app-pill',
  imports: [TagComponent],
  template: `<app-tag [value]="label()" [severity]="severity()" [rounded]="true" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillComponent {
  readonly label = input.required<string>();
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>('secondary');
  readonly icon = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-enterprise-tag',
  imports: [TagComponent],
  template: `<app-tag [value]="label()" [severity]="severity()" [rounded]="rounded()" [icon]="icon()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTagComponent {
  readonly label = input.required<string>();
  readonly severity = input<'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'>('secondary');
  readonly rounded = input(false);
  readonly icon = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-progress-status',
  template: `
    <div
      class="enterprise-progress-status"
      role="progressbar"
      [attr.aria-valuenow]="clamped()"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-label]="label() || 'Progress ' + clamped() + ' percent'"
    >
      @if (label()) {
        <div class="enterprise-progress-status__header">
          <span>{{ label() }}</span>
          <span class="enterprise-progress-status__value">{{ clamped() }}%</span>
        </div>
      }
      <div class="enterprise-progress-status__track">
        <div
          class="enterprise-progress-status__fill"
          [class.enterprise-progress-status__fill--warning]="tone() === 'warning'"
          [class.enterprise-progress-status__fill--danger]="tone() === 'danger'"
          [style.width.%]="clamped()"
        ></div>
      </div>
      @if (detail()) {
        <p class="enterprise-progress-status__detail">{{ detail() }}</p>
      }
    </div>
  `,
  styles: `
    .enterprise-progress-status { display: flex; flex-direction: column; gap: var(--mpa-spacing-xs); width: 100%; }
    .enterprise-progress-status__header {
      display: flex; justify-content: space-between; gap: var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text);
    }
    .enterprise-progress-status__value { font-variant-numeric: tabular-nums; font-weight: var(--mpa-font-weight-semibold); }
    .enterprise-progress-status__track {
      height: 0.5rem; border-radius: var(--mpa-radius-full); background: var(--mpa-color-surface-muted); overflow: hidden;
    }
    .enterprise-progress-status__fill {
      height: 100%; border-radius: inherit; background: var(--mpa-color-primary); transition: width var(--mpa-transition-normal);
    }
    .enterprise-progress-status__fill--warning { background: var(--mpa-color-warning); }
    .enterprise-progress-status__fill--danger { background: var(--mpa-color-danger); }
    .enterprise-progress-status__detail { margin: 0; font-size: var(--mpa-font-size-xs); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressStatusComponent {
  readonly value = input.required<number>();
  readonly label = input<string | undefined>(undefined);
  readonly detail = input<string | undefined>(undefined);
  readonly tone = input<'default' | 'warning' | 'danger'>('default');
  readonly clamped = computed(() => Math.max(0, Math.min(100, Math.round(this.value()))));
}

@Component({
  selector: 'app-health-indicator',
  imports: [StatusBadgeComponent],
  template: `
    <div class="enterprise-health-indicator" [attr.aria-label]="'Health: ' + label()">
      <span
        class="enterprise-health-indicator__dot"
        [class.enterprise-health-indicator__dot--healthy]="level() === 'healthy'"
        [class.enterprise-health-indicator__dot--warning]="level() === 'warning'"
        [class.enterprise-health-indicator__dot--critical]="level() === 'critical'"
        [class.enterprise-health-indicator__dot--offline]="level() === 'offline' || level() === 'unknown'"
        aria-hidden="true"
      ></span>
      <app-status-badge [label]="label()" [severity]="severity()" [icon]="icon()" />
    </div>
  `,
  styles: `
    .enterprise-health-indicator { display: inline-flex; align-items: center; gap: var(--mpa-spacing-sm); }
    .enterprise-health-indicator__dot {
      width: 0.55rem; height: 0.55rem; border-radius: var(--mpa-radius-full); background: var(--mpa-color-text-muted);
    }
    .enterprise-health-indicator__dot--healthy { background: var(--mpa-color-success); }
    .enterprise-health-indicator__dot--warning { background: var(--mpa-color-warning); }
    .enterprise-health-indicator__dot--critical { background: var(--mpa-color-danger); }
    .enterprise-health-indicator__dot--offline { background: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthIndicatorComponent {
  readonly level = input<EnterpriseHealthLevel>('unknown');
  readonly label = computed(() => {
    switch (this.level()) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Needs attention';
      case 'critical':
        return 'Critical';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  });
  readonly severity = computed(() => {
    switch (this.level()) {
      case 'healthy':
        return 'success' as const;
      case 'warning':
        return 'warn' as const;
      case 'critical':
        return 'danger' as const;
      default:
        return 'secondary' as const;
    }
  });
  readonly icon = computed(() => {
    switch (this.level()) {
      case 'healthy':
        return 'pi pi-check-circle';
      case 'warning':
        return 'pi pi-exclamation-triangle';
      case 'critical':
        return 'pi pi-times-circle';
      case 'offline':
        return 'pi pi-minus-circle';
      default:
        return 'pi pi-question-circle';
    }
  });
}
