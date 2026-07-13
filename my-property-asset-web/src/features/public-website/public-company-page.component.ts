import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  COMPANY_AWARDS,
  COMPANY_CUSTOMER_SUCCESS,
  COMPANY_FINAL_CTA,
  COMPANY_LEADERSHIP,
  COMPANY_MILESTONES,
  COMPANY_OVERVIEW,
  COMPANY_PAGE_HERO,
  COMPANY_SECURITY,
  COMPANY_STATISTICS,
  COMPANY_TRUST_BADGES,
} from './config/company-page.config';
import { CompanyTimelineComponent } from './components/company/company-timeline/company-timeline.component';
import { PageHeroBannerComponent } from './components/company/page-hero-banner/page-hero-banner.component';
import { StatHighlightCardComponent } from './components/company/stat-highlight-card/stat-highlight-card.component';
import { TeamCardComponent } from './components/company/team-card/team-card.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-public-company-page',
  imports: [
    PageHeroBannerComponent,
    TeamCardComponent,
    StatHighlightCardComponent,
    CompanyTimelineComponent,
    PublicCtaSectionComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './public-company-page.component.html',
  styleUrl: './public-company-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicCompanyPage {
  readonly hero = COMPANY_PAGE_HERO;
  readonly overview = COMPANY_OVERVIEW;
  readonly leadership = COMPANY_LEADERSHIP;
  readonly statistics = COMPANY_STATISTICS;
  readonly milestones = COMPANY_MILESTONES;
  readonly awards = COMPANY_AWARDS;
  readonly customerSuccess = COMPANY_CUSTOMER_SUCCESS;
  readonly security = COMPANY_SECURITY;
  readonly trustBadges = COMPANY_TRUST_BADGES;
  readonly finalCta = COMPANY_FINAL_CTA;
}
