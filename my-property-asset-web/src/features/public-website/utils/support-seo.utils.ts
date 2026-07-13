import { StructuredDataHook } from '../../../infrastructure/seo/models/seo.model';
import { HelpArticle, LegalDocument } from '../models/support.model';
import { PublicFaqItem } from '../models/public-section.model';

const SITE_ORIGIN = 'https://mypropertyasset.com';

export function createBreadcrumbSchema(
  items: readonly { name: string; path: string }[],
): StructuredDataHook {
  return {
    id: 'breadcrumb',
    data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${SITE_ORIGIN}${item.path}`,
      })),
    },
  };
}

export function createArticleSchema(article: HelpArticle): StructuredDataHook {
  return {
    id: 'article',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      url: `${SITE_ORIGIN}/help/articles/${article.slug}`,
      dateModified: new Date().toISOString().split('T')[0],
      author: {
        '@type': 'Organization',
        name: 'MyPropertyAsset',
      },
      publisher: {
        '@type': 'Organization',
        name: 'MyPropertyAsset',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_ORIGIN}/assets/branding/platform/logo.svg`,
        },
      },
    },
  };
}

export function createFaqPageSchema(items: readonly PublicFaqItem[]): StructuredDataHook {
  return {
    id: 'faq-page',
    data: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  };
}

export function createLegalWebPageSchema(document: LegalDocument): StructuredDataHook {
  return {
    id: 'legal-page',
    data: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: document.title,
      description: document.description,
      url: `${SITE_ORIGIN}/legal/${document.slug}`,
      dateModified: document.lastUpdated,
      isPartOf: {
        '@type': 'WebSite',
        name: 'MyPropertyAsset',
        url: SITE_ORIGIN,
      },
    },
  };
}

export function createOrganizationSchema(): StructuredDataHook {
  return {
    id: 'organization',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'MyPropertyAsset',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/assets/branding/platform/logo.svg`,
      description:
        'Enterprise property asset management platform for builders, owners, managers, and investors.',
    },
  };
}
