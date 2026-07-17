import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  HELP_FEATURED_ARTICLES,
  HELP_PAGE_HERO,
  HELP_POPULAR_TOPICS,
  HELP_SUPPORT_CTA,
} from './config/help-page.config';
import { ArticleCardComponent } from './components/support/article-card/article-card.component';
import { CategoryCardComponent } from './components/support/category-card/category-card.component';
import { PageHeroBannerComponent } from './components/company/page-hero-banner/page-hero-banner.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { SupportSearchBarComponent } from './components/support/support-search-bar/support-search-bar.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';
import { EnterpriseHelpCenterComponent } from '@shared/ui';

@Component({
  selector: 'app-public-help-center-page',
  imports: [
    EnterpriseHelpCenterComponent,
    PageHeroBannerComponent,
    SupportSearchBarComponent,
    CategoryCardComponent,
    ArticleCardComponent,
    PublicCtaSectionComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './public-help-center-page.component.html',
  styleUrl: './public-help-center-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHelpCenterPage {
  readonly hero = HELP_PAGE_HERO;
  readonly categories = HELP_CATEGORIES;
  readonly popularTopics = HELP_POPULAR_TOPICS;
  readonly featuredArticles = HELP_FEATURED_ARTICLES;
  readonly supportCta = HELP_SUPPORT_CTA;
  readonly allArticles = HELP_ARTICLES;

  readonly searchQuery = signal('');

  readonly filteredArticles = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.allArticles;
    }

    return this.allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.categoryId.toLowerCase().includes(query),
    );
  });

  readonly showSearchResults = computed(() => this.searchQuery().trim().length > 0);
}
