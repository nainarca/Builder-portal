import { PublicCtaAction, PublicFaqItem } from './public-section.model';

export interface PageHeroContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly primaryCta?: PublicCtaAction;
  readonly secondaryCta?: PublicCtaAction;
}

export interface CompanyStoryContent {
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface MissionVisionItem {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
}

export interface CoreValueItem {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface WhyUsItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface TimelineEvent {
  readonly id: string;
  readonly year: string;
  readonly title: string;
  readonly description: string;
}

export interface PlatformHighlight {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface TechStackItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
}

export interface RoadmapItem {
  readonly id: string;
  readonly quarter: string;
  readonly title: string;
  readonly status: 'planned' | 'in-progress' | 'completed';
}

export interface LeadershipMember {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly initials: string;
}

export interface AwardItem {
  readonly id: string;
  readonly title: string;
  readonly organization: string;
  readonly year: string;
}

export interface CustomerSuccessItem {
  readonly id: string;
  readonly metric: string;
  readonly label: string;
  readonly description: string;
}

export interface SecurityHighlight {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface OfficeLocation {
  readonly id: string;
  readonly city: string;
  readonly region: string;
  readonly address: string;
  readonly timezone: string;
  readonly isPrimary?: boolean;
}

export interface ContactChannel {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly href?: string;
}

export interface BusinessHours {
  readonly weekdays: string;
  readonly weekends: string;
  readonly timezone: string;
}

export interface ContactDepartment {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly email: string;
  readonly phone?: string;
  readonly ctaLabel: string;
}

export interface FaqQuickLink extends PublicFaqItem {
  readonly route?: string;
  readonly fragment?: string;
}
