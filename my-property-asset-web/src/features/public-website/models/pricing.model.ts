export type BillingPeriod = 'monthly' | 'annual';

export type PricingPlanId = 'free' | 'starter' | 'professional' | 'enterprise';

export interface PricingPlanPrice {
  readonly monthly: number | null;
  readonly annual: number | null;
  readonly currency?: string;
  readonly customLabel?: string;
}

export interface PricingPlan {
  readonly id: PricingPlanId;
  readonly name: string;
  readonly description: string;
  readonly prices: PricingPlanPrice;
  readonly features: readonly string[];
  readonly ctaLabel: string;
  readonly ctaRoute: string;
  readonly ctaAnalyticsName?: string;
  readonly popular?: boolean;
  readonly recommended?: boolean;
  readonly badge?: string;
}

export interface PricingComparisonFeature {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly availability: Readonly<Record<PricingPlanId, boolean | string>>;
}

export interface PricingTrustHighlight {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface PricingEnterpriseOffer {
  readonly title: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly ctaLabel: string;
  readonly ctaRoute: string;
  readonly ctaAnalyticsName?: string;
}
