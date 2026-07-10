import { Injectable, inject } from '@angular/core';

import { ApplicationConfigurationService } from '../../config';
import { DocumentTitleService, MetaTagService } from '../../utilities';
import { SeoMetadata } from '../models/seo.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly documentTitle = inject(DocumentTitleService);
  private readonly metaTags = inject(MetaTagService);
  private readonly configuration = inject(ApplicationConfigurationService);

  apply(metadata: SeoMetadata, path = '/'): void {
    const title = metadata.title ?? this.configuration.appTitle();
    const description =
      metadata.description ?? 'Enterprise property asset management for builders and operators.';
    const canonicalUrl = metadata.canonicalUrl ?? this.resolveCanonicalUrl(path);
    const ogImage = metadata.ogImage ?? this.defaultOgImage();
    const ogType = metadata.ogType ?? 'website';
    const twitterCard = metadata.twitterCard ?? 'summary_large_image';

    this.documentTitle.setTitle(metadata.title);
    this.metaTags.setMeta('description', description);

    if (metadata.keywords?.length) {
      this.metaTags.setMeta('keywords', metadata.keywords.join(', '));
    }

    this.metaTags.setMeta('robots', metadata.noIndex ? 'noindex, nofollow' : 'index, follow');
    this.metaTags.setLink('canonical', canonicalUrl);

    this.metaTags.setProperty('og:title', title);
    this.metaTags.setProperty('og:description', description);
    this.metaTags.setProperty('og:type', ogType);
    this.metaTags.setProperty('og:url', canonicalUrl);
    this.metaTags.setProperty('og:image', ogImage);
    this.metaTags.setProperty('og:site_name', this.configuration.appTitle());

    this.metaTags.setMeta('twitter:card', twitterCard);
    this.metaTags.setMeta('twitter:title', title);
    this.metaTags.setMeta('twitter:description', description);
    this.metaTags.setMeta('twitter:image', ogImage);

    if (metadata.twitterSite) {
      this.metaTags.setMeta('twitter:site', metadata.twitterSite);
    }

    this.applyStructuredData(metadata.structuredData ?? []);
  }

  reset(): void {
    this.documentTitle.reset();
    this.metaTags.removeStructuredData();
  }

  private applyStructuredData(hooks: SeoMetadata['structuredData']): void {
    this.metaTags.removeStructuredData();

    hooks?.forEach((hook) => {
      this.metaTags.setStructuredData(hook.id, hook.data);
    });
  }

  private resolveCanonicalUrl(path: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mypropertyasset.com';
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private defaultOgImage(): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mypropertyasset.com';
    return `${origin}/assets/branding/platform/og-image.svg`;
  }
}
