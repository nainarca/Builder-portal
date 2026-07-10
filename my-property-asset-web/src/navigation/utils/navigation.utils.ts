import { ActivatedRouteSnapshot } from '@angular/router';

import { BreadcrumbItem, BreadcrumbRouteMetadata, NavigationItem, RouteMetadata } from '../models';

export function isRouteMetadata(value: unknown): value is RouteMetadata {
  return typeof value === 'object' && value !== null;
}

export function readRouteMetadata(route: ActivatedRouteSnapshot): RouteMetadata {
  return (route.data ?? {}) as RouteMetadata;
}

export function flattenNavigationItems(items: readonly NavigationItem[]): NavigationItem[] {
  const result: NavigationItem[] = [];

  for (const item of items) {
    result.push(item);

    if (item.children?.length) {
      result.push(...flattenNavigationItems(item.children));
    }
  }

  return result;
}

export function resolveRouteCommands(route: string | readonly string[]): string[] {
  if (typeof route === 'string') {
    return route.startsWith('/') ? [route] : ['/', route];
  }

  return [...route];
}

export function resolveBreadcrumbLabel(
  breadcrumb: string | BreadcrumbRouteMetadata | undefined,
  fallback?: string,
): string | undefined {
  if (typeof breadcrumb === 'string') {
    return breadcrumb;
  }

  if (breadcrumb?.label) {
    return breadcrumb.label;
  }

  return fallback;
}

export function shouldSkipBreadcrumb(
  breadcrumb: string | BreadcrumbRouteMetadata | undefined,
): boolean {
  return typeof breadcrumb === 'object' && breadcrumb?.skip === true;
}

export function buildRouteUrl(segments: string[]): string {
  return `/${segments.filter(Boolean).join('/')}`.replace(/\/+/g, '/');
}

export function createBreadcrumbItem(
  id: string,
  label: string,
  route?: string | readonly string[],
  options?: Partial<BreadcrumbItem>,
): BreadcrumbItem {
  return {
    id,
    label,
    route,
    ...options,
  };
}

export function isNavigationItemVisible(
  item: NavigationItem,
  options?: {
    isFeatureEnabled?: (flag: string) => boolean;
    hasPermission?: (requirements: readonly string[]) => boolean;
  },
): boolean {
  if (item.metadata?.visible === false) {
    return false;
  }

  const isFeatureEnabled = options?.isFeatureEnabled ?? (() => true);
  const flag = item.metadata?.featureFlag;
  if (flag && !isFeatureEnabled(flag)) {
    return false;
  }

  const permissions = item.metadata?.permissions;
  if (permissions?.length) {
    const hasPermission = options?.hasPermission ?? (() => true);
    if (!hasPermission(permissions)) {
      return false;
    }
  }

  return true;
}

export function filterVisibleNavigationItems(
  items: readonly NavigationItem[],
  options?: {
    isFeatureEnabled?: (flag: string) => boolean;
    hasPermission?: (requirements: readonly string[]) => boolean;
  },
): NavigationItem[] {
  return items.filter((item) => isNavigationItemVisible(item, options));
}
