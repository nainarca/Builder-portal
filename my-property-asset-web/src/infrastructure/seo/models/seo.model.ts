export type TwitterCardType = 'summary' | 'summary_large_image';

export interface StructuredDataHook {
  readonly id: string;
  readonly data: Record<string, unknown>;
}

export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: readonly string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: TwitterCardType;
  twitterSite?: string;
  noIndex?: boolean;
  structuredData?: readonly StructuredDataHook[];
}

export interface SeoApplicationContext {
  path: string;
  metadata: SeoMetadata;
}
