import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  ABOUT_COMPANY_STORY,
  ABOUT_CORE_VALUES,
  ABOUT_FINAL_CTA,
  ABOUT_JOURNEY,
  ABOUT_MISSION_VISION,
  ABOUT_PAGE_HERO,
  ABOUT_PLATFORM_HIGHLIGHTS,
  ABOUT_ROADMAP,
  ABOUT_TECH_STACK,
  ABOUT_WHY_US,
} from './config/about-page.config';
import { CompanyTimelineComponent } from './components/company/company-timeline/company-timeline.component';
import { PageHeroBannerComponent } from './components/company/page-hero-banner/page-hero-banner.component';
import { ValueCardComponent } from './components/company/value-card/value-card.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-public-about-page',
  imports: [
    PageHeroBannerComponent,
    CompanyTimelineComponent,
    ValueCardComponent,
    PublicCtaSectionComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './public-about-page.component.html',
  styleUrl: './public-about-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicAboutPage {
  readonly hero = ABOUT_PAGE_HERO;
  readonly story = ABOUT_COMPANY_STORY;
  readonly missionVision = ABOUT_MISSION_VISION;
  readonly coreValues = ABOUT_CORE_VALUES;
  readonly whyUs = ABOUT_WHY_US;
  readonly journey = ABOUT_JOURNEY;
  readonly platformHighlights = ABOUT_PLATFORM_HIGHLIGHTS;
  readonly techStack = ABOUT_TECH_STACK;
  readonly roadmap = ABOUT_ROADMAP;
  readonly finalCta = ABOUT_FINAL_CTA;
}
