import { PublicCtaAction, PublicTrustBadge } from './public-section.model';

export type AuthEntryIntent = 'signin' | 'get-started';

export interface ConversionFeatureHighlight {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface ConversionBenefitItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface ConversionJourneyStep {
  readonly id: string;
  readonly step: number;
  readonly title: string;
  readonly description: string;
}

export interface ConversionSuccessHighlight {
  readonly id: string;
  readonly metric: string;
  readonly label: string;
}

export interface ConversionSecurityMessage {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface AuthEntryExperience {
  readonly intent: AuthEntryIntent;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly ctaLabel: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly highlights: readonly string[];
}

export interface ConversionPlaceholderEntry {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: 'coming-soon' | 'available';
  readonly icon: string;
}

export interface ConversionAttributionParams {
  readonly utm_source?: string;
  readonly utm_medium?: string;
  readonly utm_campaign?: string;
  readonly utm_term?: string;
  readonly utm_content?: string;
  readonly ref?: string;
  readonly campaign?: string;
}

export interface ConversionCtaContext {
  readonly returnUrl?: string;
  readonly intent?: AuthEntryIntent;
  readonly analyticsName?: string;
}

export interface ConversionCtaLink extends PublicCtaAction {
  readonly returnUrl?: string;
  readonly intent?: AuthEntryIntent;
}

export type ConversionTrustBadge = PublicTrustBadge;

export interface ConversionAnalyticsEvent {
  readonly name: string;
  readonly surface: 'public-website' | 'authentication';
  readonly intent?: AuthEntryIntent;
  readonly returnUrl?: string;
  readonly attribution?: ConversionAttributionParams;
}
