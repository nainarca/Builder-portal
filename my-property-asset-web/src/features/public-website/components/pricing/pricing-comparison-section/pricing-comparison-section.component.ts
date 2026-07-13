import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PricingComparisonFeature, PricingPlanId } from '../../../models/pricing.model';

const PLAN_LABELS: Record<PricingPlanId, string> = {
  free: 'Free',
  starter: 'Starter',
  professional: 'Professional',
  enterprise: 'Enterprise',
};

@Component({
  selector: 'app-pricing-comparison-section',
  imports: [RevealOnScrollDirective],
  templateUrl: './pricing-comparison-section.component.html',
  styleUrl: './pricing-comparison-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingComparisonSectionComponent {
  readonly sectionId = input.required<string>();
  readonly title = input('Compare plans');
  readonly description = input('See exactly what is included at every tier.');
  readonly features = input.required<readonly PricingComparisonFeature[]>();
  readonly planIds = input<readonly PricingPlanId[]>(['free', 'starter', 'professional', 'enterprise']);

  readonly expandedMobile = signal(false);

  readonly categories = computed(() => {
    const cats = new Set(this.features().map((f) => f.category));
    return Array.from(cats);
  });

  readonly planLabels = PLAN_LABELS;

  featuresByCategory(category: string): PricingComparisonFeature[] {
    return this.features().filter((f) => f.category === category);
  }

  formatAvailability(value: boolean | string): string {
    if (value === true) {
      return 'Included';
    }
    if (value === false) {
      return '—';
    }
    return value;
  }

  isIncluded(value: boolean | string): boolean {
    return value === true || (typeof value === 'string' && value !== '—');
  }

  toggleMobile(): void {
    this.expandedMobile.update((v) => !v);
  }
}
