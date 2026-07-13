import { PublicCtaAction, PublicFaqItem } from './public-section.model';

export interface HelpCategory {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly articleCount: number;
}

export interface HelpArticleSection {
  readonly id: string;
  readonly heading: string;
  readonly level: 2 | 3;
  readonly paragraphs: readonly string[];
}

export interface HelpArticle {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly categoryId: string;
  readonly readTime: string;
  readonly featured?: boolean;
  readonly popular?: boolean;
  readonly sections: readonly HelpArticleSection[];
  readonly relatedSlugs: readonly string[];
}

export interface FaqCategory {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly description: string;
  readonly items: readonly PublicFaqItem[];
}

export interface LegalSection {
  readonly id: string;
  readonly heading: string;
  readonly level: 2 | 3;
  readonly paragraphs: readonly string[];
  readonly listItems?: readonly string[];
}

export interface LegalDocument {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly lastUpdated: string;
  readonly sections: readonly LegalSection[];
}

export interface SupportPageHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly primaryCta?: PublicCtaAction;
  readonly secondaryCta?: PublicCtaAction;
}

export interface TocItem {
  readonly id: string;
  readonly label: string;
  readonly level: 2 | 3;
}
