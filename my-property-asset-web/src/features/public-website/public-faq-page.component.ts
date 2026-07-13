import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  FAQ_CATEGORIES,
  FAQ_FEATURED_QUESTIONS,
  FAQ_PAGE_HERO,
  FAQ_SUPPORT_CTA,
} from './config/faq-page.config';
import { FaqAccordionComponent } from './components/support/faq-accordion/faq-accordion.component';
import { PageHeroBannerComponent } from './components/company/page-hero-banner/page-hero-banner.component';
import { PublicCtaSectionComponent } from './components/sections/cta-section/cta-section.component';
import { SupportSearchBarComponent } from './components/support/support-search-bar/support-search-bar.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-public-faq-page',
  imports: [
    PageHeroBannerComponent,
    SupportSearchBarComponent,
    FaqAccordionComponent,
    PublicCtaSectionComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './public-faq-page.component.html',
  styleUrl: './public-faq-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFaqPage {
  readonly hero = FAQ_PAGE_HERO;
  readonly categories = FAQ_CATEGORIES;
  readonly featuredQuestions = FAQ_FEATURED_QUESTIONS;
  readonly supportCta = FAQ_SUPPORT_CTA;

  readonly searchQuery = signal('');
  readonly activeCategory = signal<string | 'all'>('all');

  readonly filteredCategories = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const categoryFilter = this.activeCategory();

    return this.categories
      .filter((category) => categoryFilter === 'all' || category.id === categoryFilter)
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          if (!query) {
            return true;
          }
          return (
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((category) => category.items.length > 0);
  });

  readonly totalResults = computed(() =>
    this.filteredCategories().reduce((sum, cat) => sum + cat.items.length, 0),
  );

  setCategory(categoryId: string): void {
    this.activeCategory.set(categoryId);
  }

  showAllCategories(): void {
    this.activeCategory.set('all');
  }
}
