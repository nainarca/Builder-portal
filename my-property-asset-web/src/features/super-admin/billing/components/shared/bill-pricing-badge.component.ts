import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-bill-pricing-badge',
  template: `
    <span [class]="'bill-pricing-badge ' + toneClass()">
      {{ label() }}
    </span>
  `,
  styles: `
    .bill-pricing-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 700;
      letter-spacing: 0.02em;
      line-height: 1.2;
      border: 1px solid transparent;
    }

    .bill-pricing-badge--default {
      color: var(--mpa-color-text-muted);
      background: color-mix(in srgb, var(--mpa-color-text-muted) 12%, transparent);
      border-color: var(--mpa-color-border);
    }

    .bill-pricing-badge--popular {
      color: var(--mpa-color-primary);
      background: color-mix(in srgb, var(--mpa-color-primary) 14%, transparent);
      border-color: color-mix(in srgb, var(--mpa-color-primary) 28%, transparent);
    }

    .bill-pricing-badge--enterprise {
      color: var(--mpa-color-accent, var(--mpa-color-primary));
      background: color-mix(
        in srgb,
        var(--mpa-color-accent, var(--mpa-color-primary)) 14%,
        transparent
      );
      border-color: color-mix(
        in srgb,
        var(--mpa-color-accent, var(--mpa-color-primary)) 28%,
        transparent
      );
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillPricingBadgeComponent {
  readonly label = input.required<string>();
  readonly tone = input<'default' | 'popular' | 'enterprise'>('default');

  readonly toneClass = computed(() => `bill-pricing-badge--${this.tone()}`);
}
