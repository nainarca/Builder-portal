import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LEGAL_HUB_DOCUMENTS, LEGAL_HUB_HERO, LEGAL_SUPPORT_CTA } from './config/legal-page.config';
import { PageHeroBannerComponent } from './components/company/page-hero-banner/page-hero-banner.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-public-legal-hub-page',
  imports: [RouterLink, PageHeroBannerComponent, PublicCtaSectionComponent, RevealOnScrollDirective],
  templateUrl: './public-legal-hub-page.component.html',
  styleUrl: './public-legal-hub-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLegalHubPage {
  readonly hero = LEGAL_HUB_HERO;
  readonly documents = LEGAL_HUB_DOCUMENTS;
  readonly supportCta = LEGAL_SUPPORT_CTA;
}
