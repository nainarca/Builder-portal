import { Routes } from '@angular/router';

import {
  PUBLIC_ABOUT_METADATA,
  PUBLIC_COMPANY_METADATA,
  PUBLIC_CONTACT_METADATA,
  PUBLIC_FAQ_METADATA,
  PUBLIC_GET_STARTED_METADATA,
  PUBLIC_HELP_ARTICLE_METADATA,
  PUBLIC_HELP_METADATA,
  PUBLIC_HOME_METADATA,
  PUBLIC_LEGAL_DOCUMENT_METADATA,
  PUBLIC_LEGAL_METADATA,
  PUBLIC_PRICING_METADATA,
} from '../../core/constants/route-metadata.constants';
import { PublicLayoutComponent } from '../../layouts/public/public-layout.component';
import { navigationResolver } from '../../navigation/resolvers';
import { PublicAboutPage } from './public-about-page.component';
import { PublicCompanyPage } from './public-company-page.component';
import { PublicContactPage } from './public-contact-page.component';
import { PublicFaqPage } from './public-faq-page.component';
import { PublicGetStartedPage } from './public-get-started-page.component';
import { PublicHelpArticlePage } from './public-help-article-page.component';
import { PublicHelpCenterPage } from './public-help-center-page.component';
import { PublicLegalDocumentPage } from './public-legal-document-page.component';
import { PublicLegalHubPage } from './public-legal-hub-page.component';
import { PublicPricingPage } from './public-pricing-page.component';
import { PublicWebsiteHome } from './public-website-home.component';

export const PUBLIC_WEBSITE_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    resolve: { navigation: navigationResolver },
    data: {
      layout: 'public',
      navigationContext: 'public-website',
    },
    children: [
      {
        path: '',
        component: PublicWebsiteHome,
        data: PUBLIC_HOME_METADATA,
      },
      {
        path: 'pricing',
        component: PublicPricingPage,
        data: PUBLIC_PRICING_METADATA,
      },
      {
        path: 'about',
        component: PublicAboutPage,
        data: PUBLIC_ABOUT_METADATA,
      },
      {
        path: 'company',
        component: PublicCompanyPage,
        data: PUBLIC_COMPANY_METADATA,
      },
      {
        path: 'contact',
        component: PublicContactPage,
        data: PUBLIC_CONTACT_METADATA,
      },
      {
        path: 'get-started',
        component: PublicGetStartedPage,
        data: PUBLIC_GET_STARTED_METADATA,
      },
      {
        path: 'help',
        component: PublicHelpCenterPage,
        data: PUBLIC_HELP_METADATA,
      },
      {
        path: 'help/articles/:slug',
        component: PublicHelpArticlePage,
        data: PUBLIC_HELP_ARTICLE_METADATA,
      },
      {
        path: 'faq',
        component: PublicFaqPage,
        data: PUBLIC_FAQ_METADATA,
      },
      {
        path: 'legal',
        component: PublicLegalHubPage,
        data: PUBLIC_LEGAL_METADATA,
      },
      {
        path: 'legal/:slug',
        component: PublicLegalDocumentPage,
        data: PUBLIC_LEGAL_DOCUMENT_METADATA,
      },
    ],
  },
];
