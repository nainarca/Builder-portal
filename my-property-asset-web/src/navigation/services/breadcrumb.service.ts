import { Injectable, computed, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { BreadcrumbConfiguration, BreadcrumbTrail } from '../models';
import { NAVIGATION_METADATA } from '../config';
import { generateBreadcrumbs } from '../utils';
import { RouteMetadataService } from './route-metadata.service';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly routeMetadataService = inject(RouteMetadataService);

  private readonly configuration: BreadcrumbConfiguration = {
    homeLabel: 'Home',
    homeRoute: NAVIGATION_METADATA.homeRoute,
    showHome: NAVIGATION_METADATA.showHomeBreadcrumb,
  };

  private readonly navigationTick = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => Date.now()),
      startWith(Date.now()),
    ),
    { initialValue: Date.now() },
  );

  readonly trail = computed((): BreadcrumbTrail => {
    this.navigationTick();
    const snapshot = this.routeMetadataService.getLeafRouteSnapshot().root;
    return generateBreadcrumbs(snapshot, this.configuration);
  });

  readonly items = computed(() => this.trail().items);

  updateConfiguration(configuration: Partial<BreadcrumbConfiguration>): void {
    Object.assign(this.configuration, configuration);
  }
}
