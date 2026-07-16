import { NavigationContextType } from './navigation-context.model';

export interface NavigationItemMetadata {
  description?: string;
  badge?: string;
  external?: boolean;
  target?: '_blank' | '_self';
  fragment?: string;
  analyticsName?: string;
  featureFlag?: string;
  permissions?: string[];
  visible?: boolean;
  /**
   * Optional substring / path fragment used for active highlighting when the
   * navigable `route` is only an entry point (e.g. Buildings under Projects).
   * Does not change routing — presentation only (DS-02).
   */
  activeMatch?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  route?: string | readonly string[];
  icon?: string;
  children?: readonly NavigationItem[];
  metadata?: NavigationItemMetadata;
}

export interface NavigationGroup {
  id: string;
  label?: string;
  items: readonly NavigationItem[];
}

export interface NavigationSection {
  id: string;
  label?: string;
  ariaLabel?: string;
  groups: readonly NavigationGroup[];
}

export interface NavigationConfiguration {
  context: NavigationContextType;
  topNav?: NavigationSection;
  sidebarNav?: NavigationSection;
  contextNav?: NavigationSection;
  secondaryNav?: NavigationSection;
  footerNav?: NavigationSection;
  userNav?: NavigationSection;
  quickActions?: NavigationSection;
  favorites?: NavigationSection;
  recentItems?: NavigationSection;
}

export type NavigationZone =
  | 'top'
  | 'sidebar'
  | 'context'
  | 'secondary'
  | 'footer'
  | 'user'
  | 'quickActions'
  | 'favorites'
  | 'recentItems';

export interface NavigationMetadata {
  context: NavigationContextType;
  version: string;
  homeRoute: string;
  showHomeBreadcrumb: boolean;
}
