import { LayoutType } from '../../layouts/models/layout.types';
import { NavigationContextType } from './navigation-context.model';
import { StructuredDataHook, TwitterCardType } from '../../infrastructure/seo/models/seo.model';

export interface SeoRouteMetadata {
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

export interface BreadcrumbRouteMetadata {
  label?: string;
  skip?: boolean;
  link?: boolean;
}

export interface RouteMetadata {
  title?: string;
  icon?: string;
  description?: string;
  permissions?: readonly string[];
  roles?: readonly string[];
  portal?: string;
  organizationContext?: boolean;
  layout?: LayoutType;
  visible?: boolean;
  breadcrumb?: string | BreadcrumbRouteMetadata;
  featureFlag?: string;
  analyticsName?: string;
  seo?: SeoRouteMetadata;
  navigationContext?: NavigationContextType;
}

export const ROUTE_METADATA_KEYS: readonly (keyof RouteMetadata)[] = [
  'title',
  'icon',
  'description',
  'permissions',
  'roles',
  'portal',
  'organizationContext',
  'layout',
  'visible',
  'breadcrumb',
  'featureFlag',
  'analyticsName',
  'seo',
  'navigationContext',
] as const;
