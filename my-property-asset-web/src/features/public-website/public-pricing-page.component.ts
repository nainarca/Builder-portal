import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  PRICING_COMPARISON_FEATURES,
  PRICING_ENTERPRISE_OFFER,
  PRICING_FAQ,
  PRICING_FINAL_CTA,
  PRICING_PAGE_HERO,
  PRICING_PLANS,
  PRICING_SECTION_IDS,
  PRICING_TRUST_HIGHLIGHTS,
} from './config/pricing-page.config';
import { PricingComparisonSectionComponent } from './components/pricing/pricing-comparison-section/pricing-comparison-section.component';
import { PricingEnterpriseSectionComponent } from './components/pricing/pricing-enterprise-section/pricing-enterprise-section.component';
import { PricingHeroSectionComponent } from './components/pricing/pricing-hero-section/pricing-hero-section.component';
import { PricingPlansSectionComponent } from './components/pricing/pricing-plans-section/pricing-plans-section.component';
import { PricingTrustSectionComponent } from './components/pricing/pricing-trust-section/pricing-trust-section.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { PublicFaqSectionComponent } from './components/sections/faq-section/faq-section.component';

@Component({
  selector: 'app-public-pricing-page',
  imports: [
    PricingHeroSectionComponent,
    PricingPlansSectionComponent,
    PricingComparisonSectionComponent,
    PublicFaqSectionComponent,
    PricingEnterpriseSectionComponent,
    PricingTrustSectionComponent,
    PublicCtaSectionComponent,
  ],
  templateUrl: './public-pricing-page.component.html',
  styleUrl: './public-pricing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicPricingPage {
  readonly hero = PRICING_PAGE_HERO;
  readonly plans = PRICING_PLANS;
  readonly comparison = PRICING_COMPARISON_FEATURES;
  readonly faq = PRICING_FAQ;
  readonly enterprise = PRICING_ENTERPRISE_OFFER;
  readonly trust = PRICING_TRUST_HIGHLIGHTS;
  readonly finalCta = PRICING_FINAL_CTA;
  readonly sectionIds = PRICING_SECTION_IDS;
}
