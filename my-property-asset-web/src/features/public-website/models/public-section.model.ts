export interface PublicFeatureItem {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface PublicBenefitItem {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface PublicStatisticItem {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly hint?: string;
}

export interface PublicStepItem {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
}

export interface PublicTestimonialItem {
  readonly id: string;
  readonly quote: string;
  readonly author: string;
  readonly role: string;
  readonly organization: string;
}

export interface PublicPricingTier {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly period: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly highlighted?: boolean;
  readonly ctaLabel: string;
}

export interface PublicFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface PublicCtaAction {
  readonly label: string;
  readonly route: string;
  readonly fragment?: string;
  readonly variant?: 'primary' | 'secondary';
  readonly analyticsName?: string;
}
