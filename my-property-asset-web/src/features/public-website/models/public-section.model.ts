export interface PublicFeatureItem {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly highlight?: string;
}

export interface PublicAudienceBenefit {
  readonly id: string;
  readonly audience: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly outcomes: readonly string[];
}

export interface PublicStatisticItem {
  readonly id: string;
  readonly value: string;
  readonly numericValue?: number;
  readonly suffix?: string;
  readonly prefix?: string;
  readonly label: string;
  readonly hint?: string;
}

export interface PublicStepItem {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly icon?: string;
}

export interface PublicTestimonialItem {
  readonly id: string;
  readonly quote: string;
  readonly author: string;
  readonly role: string;
  readonly organization: string;
  readonly initials?: string;
}

export interface PublicTrustedLogo {
  readonly id: string;
  readonly name: string;
  readonly category: 'builder' | 'partner' | 'client';
  readonly initials: string;
}

export interface PublicTrustBadge {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
}

export interface PublicFooterLink {
  readonly id: string;
  readonly label: string;
  readonly route: string;
  readonly fragment?: string;
  readonly external?: boolean;
}

export interface PublicFooterColumn {
  readonly id: string;
  readonly title: string;
  readonly links: readonly PublicFooterLink[];
}

export interface PublicSocialLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: string;
}

export interface PublicCtaAction {
  readonly label: string;
  readonly route: string;
  readonly fragment?: string;
  readonly variant?: 'primary' | 'secondary';
  readonly analyticsName?: string;
  readonly intent?: 'signin' | 'get-started';
  readonly returnUrl?: string;
}

// Legacy aliases retained for foundation components not yet migrated
export interface PublicBenefitItem {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
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
