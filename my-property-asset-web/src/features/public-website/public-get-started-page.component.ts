import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  AUTH_ENTRY_EXPERIENCES,
  CONVERSION_BENEFITS,
  CONVERSION_FEATURE_HIGHLIGHTS,
  CONVERSION_JOURNEY_STEPS,
  CONVERSION_PLACEHOLDER_ENTRIES,
  CONVERSION_SECURITY_MESSAGES,
  CONVERSION_SUCCESS_HIGHLIGHTS,
  CONVERSION_TRUST_BADGES,
  GET_STARTED_FINAL_CTA,
  GET_STARTED_PAGE_HERO,
} from './config/conversion-entry.config';
import { AuthEntryIntent } from './models/conversion.model';
import { ConversionCtaLinkComponent } from './components/conversion/conversion-cta-link/conversion-cta-link.component';
import { ConversionFeatureCardComponent } from './components/conversion/conversion-feature-card/conversion-feature-card.component';
import { ConversionJourneyTimelineComponent } from './components/conversion/conversion-journey-timeline/conversion-journey-timeline.component';
import { ConversionTrustBadgeComponent } from './components/conversion/conversion-trust-badge/conversion-trust-badge.component';
import { PageHeroBannerComponent } from './components/company/page-hero-banner/page-hero-banner.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { WelcomeBannerComponent } from './components/conversion/welcome-banner/welcome-banner.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-public-get-started-page',
  imports: [
    PageHeroBannerComponent,
    WelcomeBannerComponent,
    ConversionCtaLinkComponent,
    ConversionTrustBadgeComponent,
    ConversionFeatureCardComponent,
    ConversionJourneyTimelineComponent,
    PublicCtaSectionComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './public-get-started-page.component.html',
  styleUrl: './public-get-started-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicGetStartedPage {
  readonly hero = GET_STARTED_PAGE_HERO;
  readonly trustBadges = CONVERSION_TRUST_BADGES;
  readonly features = CONVERSION_FEATURE_HIGHLIGHTS;
  readonly benefits = CONVERSION_BENEFITS;
  readonly successHighlights = CONVERSION_SUCCESS_HIGHLIGHTS;
  readonly journeySteps = CONVERSION_JOURNEY_STEPS;
  readonly placeholders = CONVERSION_PLACEHOLDER_ENTRIES;
  readonly securityMessages = CONVERSION_SECURITY_MESSAGES;
  readonly finalCta = GET_STARTED_FINAL_CTA;

  readonly activeIntent = signal<AuthEntryIntent>('get-started');

  readonly activeExperience = computed(() => AUTH_ENTRY_EXPERIENCES[this.activeIntent()]);

  setIntent(intent: AuthEntryIntent): void {
    this.activeIntent.set(intent);
  }
}
