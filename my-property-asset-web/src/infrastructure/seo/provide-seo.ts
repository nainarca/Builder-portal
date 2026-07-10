import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { RouteMetadataService } from '@navigation/services';
import { SeoService } from './services/seo.service';
import { SeoMetadata } from './models/seo.model';
import { RouteMetadata } from '@navigation/models';

function toSeoMetadata(metadata: RouteMetadata): SeoMetadata {
  return {
    title: metadata.seo?.title ?? metadata.title,
    description: metadata.seo?.description ?? metadata.description,
    keywords: metadata.seo?.keywords,
    canonicalUrl: metadata.seo?.canonicalUrl,
    ogImage: metadata.seo?.ogImage,
    ogType: metadata.seo?.ogType,
    twitterCard: metadata.seo?.twitterCard,
    twitterSite: metadata.seo?.twitterSite,
    noIndex: metadata.seo?.noIndex,
    structuredData: metadata.seo?.structuredData,
  };
}

export function provideSeo(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const router = inject(Router);
      const routeMetadata = inject(RouteMetadataService);
      const seo = inject(SeoService);

      const applyCurrent = (): void => {
        const metadata = routeMetadata.readLeafMetadata();
        seo.apply(toSeoMetadata(metadata), router.url.split('?')[0] ?? '/');
      };

      router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        applyCurrent();
      });

      applyCurrent();
    }),
  ]);
}
