import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CONTACT_BUSINESS_HOURS,
  CONTACT_CHANNELS,
  CONTACT_DEPARTMENTS,
  CONTACT_FAQ_LINKS,
  CONTACT_FINAL_CTA,
  CONTACT_MAP_PLACEHOLDER,
  CONTACT_OFFICES,
  CONTACT_PAGE_HERO,
} from './config/contact-page.config';
import { PUBLIC_SOCIAL_LINKS } from './config/public-footer.config';
import { ContactChannelCardComponent } from './components/company/contact-channel-card/contact-channel-card.component';
import { ContactInfoCardComponent } from './components/company/contact-info-card/contact-info-card.component';
import { LocationPlaceholderComponent } from './components/company/location-placeholder/location-placeholder.component';
import { OfficeCardComponent } from './components/company/office-card/office-card.component';
import { PageHeroBannerComponent } from './components/company/page-hero-banner/page-hero-banner.component';
import { SocialLinksRowComponent } from './components/company/social-links-row/social-links-row.component';
import { PublicContactFormComponent } from './components/contact-form/contact-form.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-public-contact-page',
  imports: [
    RouterLink,
    PageHeroBannerComponent,
    PublicContactFormComponent,
    ContactChannelCardComponent,
    ContactInfoCardComponent,
    OfficeCardComponent,
    LocationPlaceholderComponent,
    SocialLinksRowComponent,
    PublicCtaSectionComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './public-contact-page.component.html',
  styleUrl: './public-contact-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicContactPage {
  readonly hero = CONTACT_PAGE_HERO;
  readonly channels = CONTACT_CHANNELS;
  readonly businessHours = CONTACT_BUSINESS_HOURS;
  readonly offices = CONTACT_OFFICES;
  readonly departments = CONTACT_DEPARTMENTS;
  readonly faqLinks = CONTACT_FAQ_LINKS;
  readonly mapPlaceholder = CONTACT_MAP_PLACEHOLDER;
  readonly socialLinks = PUBLIC_SOCIAL_LINKS;
  readonly finalCta = CONTACT_FINAL_CTA;
}
