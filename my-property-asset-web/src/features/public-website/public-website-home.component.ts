import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PLATFORM_BRAND } from '@theme/config';
import { ThemeService } from '@theme/services/theme.service';
import {
  PUBLIC_BENEFITS,
  PUBLIC_FAQ,
  PUBLIC_FEATURES,
  PUBLIC_FINAL_CTA,
  PUBLIC_HERO_CONTENT,
  PUBLIC_PRICING_PREVIEW,
  PUBLIC_SECTION_IDS,
  PUBLIC_STATISTICS,
  PUBLIC_STEPS,
  PUBLIC_TESTIMONIALS,
  PUBLIC_WEBSITE_BRAND,
} from './config/public-website.config';
import { PublicBenefitsSectionComponent } from './components/sections/benefits-section/benefits-section.component';
import { PublicContactFormComponent } from './components/contact-form/contact-form.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { PublicFaqSectionComponent } from './components/sections/faq-section/faq-section.component';
import { PublicFeaturesSectionComponent } from './components/sections/features-section/features-section.component';
import { PublicHeroSectionComponent } from './components/sections/hero-section/hero-section.component';
import { PublicHowItWorksSectionComponent } from './components/sections/how-it-works-section/how-it-works-section.component';
import { PublicPricingPreviewSectionComponent } from './components/sections/pricing-preview-section/pricing-preview-section.component';
import { PublicStatisticsSectionComponent } from './components/sections/statistics-section/statistics-section.component';
import { PublicTestimonialsSectionComponent } from './components/sections/testimonials-section/testimonials-section.component';

@Component({
  selector: 'app-public-website-home',
  imports: [
    PublicHeroSectionComponent,
    PublicFeaturesSectionComponent,
    PublicBenefitsSectionComponent,
    PublicStatisticsSectionComponent,
    PublicHowItWorksSectionComponent,
    PublicTestimonialsSectionComponent,
    PublicPricingPreviewSectionComponent,
    PublicFaqSectionComponent,
    PublicCtaSectionComponent,
    PublicContactFormComponent,
  ],
  templateUrl: './public-website-home.component.html',
  styleUrl: './public-website-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicWebsiteHome {
  private readonly theme = inject(ThemeService);

  readonly hero = PUBLIC_HERO_CONTENT;
  readonly brand = PUBLIC_WEBSITE_BRAND;
  readonly features = PUBLIC_FEATURES;
  readonly benefits = PUBLIC_BENEFITS;
  readonly statistics = PUBLIC_STATISTICS;
  readonly steps = PUBLIC_STEPS;
  readonly testimonials = PUBLIC_TESTIMONIALS;
  readonly pricing = PUBLIC_PRICING_PREVIEW;
  readonly faq = PUBLIC_FAQ;
  readonly finalCta = PUBLIC_FINAL_CTA;
  readonly sectionIds = PUBLIC_SECTION_IDS;

  readonly logoSrc = computed(() => {
    const mode = this.theme.resolvedMode();
    const fallback = PLATFORM_BRAND.logo?.src ?? 'assets/branding/platform/logo.svg';
    return mode === 'dark'
      ? (PLATFORM_BRAND.logoVariants?.dark?.src ?? fallback)
      : (PLATFORM_BRAND.logoVariants?.light?.src ?? fallback);
  });
}
