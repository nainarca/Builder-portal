import { ActivatedRouteSnapshot } from '@angular/router';

import { BreadcrumbConfiguration, BreadcrumbItem, BreadcrumbTrail } from '../models';
import {
  buildRouteUrl,
  createBreadcrumbItem,
  readRouteMetadata,
  resolveBreadcrumbLabel,
  shouldSkipBreadcrumb,
} from './navigation.utils';

function collectRouteChain(root: ActivatedRouteSnapshot): ActivatedRouteSnapshot[] {
  const chain: ActivatedRouteSnapshot[] = [];
  let current: ActivatedRouteSnapshot | null = root;

  while (current) {
    chain.push(current);
    current = current.firstChild;
  }

  return chain;
}

export function generateBreadcrumbs(
  root: ActivatedRouteSnapshot,
  configuration: BreadcrumbConfiguration = {},
): BreadcrumbTrail {
  const items: BreadcrumbItem[] = [];
  const showHome = configuration.showHome ?? true;
  const homeRoute = configuration.homeRoute ?? '/';
  const homeLabel = configuration.homeLabel ?? 'Home';

  if (showHome) {
    items.push(
      createBreadcrumbItem('breadcrumb-home', homeLabel, homeRoute, {
        isHome: true,
        icon: 'pi pi-home',
      }),
    );
  }

  const chain = collectRouteChain(root);
  const urlSegments: string[] = [];

  for (const snapshot of chain) {
    if (snapshot.url.length) {
      urlSegments.push(...snapshot.url.map((segment) => segment.path));
    }

    const metadata = readRouteMetadata(snapshot);

    if (shouldSkipBreadcrumb(metadata.breadcrumb)) {
      continue;
    }

    const label = resolveBreadcrumbLabel(metadata.breadcrumb, metadata.title);

    if (!label) {
      continue;
    }

    const routePath = buildRouteUrl(urlSegments);

    items.push(
      createBreadcrumbItem(
        `breadcrumb-${routePath || snapshot.routeConfig?.path || 'root'}`,
        label,
        routePath,
        {
          icon: metadata.icon,
        },
      ),
    );
  }

  if (items.length > 0) {
    const lastIndex = items.length - 1;
    items[lastIndex] = { ...items[lastIndex], isActive: true };
  }

  const maxItems = configuration.maxItems;

  if (maxItems && items.length > maxItems) {
    return {
      items: items.slice(items.length - maxItems),
      configuration,
    };
  }

  return {
    items,
    configuration,
  };
}
