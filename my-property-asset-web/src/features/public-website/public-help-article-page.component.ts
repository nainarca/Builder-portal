import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../infrastructure/seo/services/seo.service';
import { findHelpArticleBySlug, HELP_ARTICLES } from './config/help-page.config';
import { HelpArticle, TocItem } from './models/support.model';
import {
  createArticleSchema,
  createBreadcrumbSchema,
  createOrganizationSchema,
} from './utils/support-seo.utils';
import { ArticleCardComponent } from './components/support/article-card/article-card.component';
import { BackToTopButtonComponent } from './components/support/back-to-top-button/back-to-top-button.component';
import { ReadingProgressBarComponent } from './components/support/reading-progress-bar/reading-progress-bar.component';
import { TableOfContentsComponent } from './components/support/table-of-contents/table-of-contents.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-public-help-article-page',
  imports: [
    RouterLink,
    TableOfContentsComponent,
    ReadingProgressBarComponent,
    BackToTopButtonComponent,
    ArticleCardComponent,
    RevealOnScrollDirective,
  ],
  templateUrl: './public-help-article-page.component.html',
  styleUrl: './public-help-article-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHelpArticlePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  readonly article = signal<HelpArticle | undefined>(undefined);
  readonly activeSectionId = signal<string | undefined>(undefined);

  readonly tocItems = computed<readonly TocItem[]>(() => {
    const current = this.article();
    if (!current) {
      return [];
    }

    return current.sections.map((section) => ({
      id: section.id,
      label: section.heading,
      level: section.level,
    }));
  });

  readonly relatedArticles = computed(() => {
    const current = this.article();
    if (!current) {
      return [];
    }

    return current.relatedSlugs
      .map((slug) => HELP_ARTICLES.find((a) => a.slug === slug))
      .filter((a): a is HelpArticle => a !== undefined);
  });

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const found = findHelpArticleBySlug(slug);
    this.article.set(found);

    if (found) {
      this.applySeo(found);
    }

    this.destroyRef.onDestroy(() => this.seo.reset());
  }

  private applySeo(article: HelpArticle): void {
    const path = `/help/articles/${article.slug}`;

    this.seo.apply(
      {
        title: `${article.title} — MyPropertyAsset Help`,
        description: article.excerpt,
        canonicalUrl: `https://mypropertyasset.com${path}`,
        ogType: 'article',
        twitterCard: 'summary_large_image',
        twitterSite: '@mypropertyasset',
        structuredData: [
          createOrganizationSchema(),
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Help Center', path: '/help' },
            { name: article.title, path },
          ]),
          createArticleSchema(article),
        ],
      },
      path,
    );
  }
}
