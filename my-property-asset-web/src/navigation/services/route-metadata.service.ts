import { Injectable, inject, signal } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { RouteMetadata } from '../models';
import { readRouteMetadata } from '../utils';

@Injectable({ providedIn: 'root' })
export class RouteMetadataService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly leafMetadataSignal = signal<RouteMetadata>({});

  readonly leafMetadata = this.leafMetadataSignal.asReadonly();

  readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.leafMetadataSignal.set(this.readLeafMetadata());
    });

    this.leafMetadataSignal.set(this.readLeafMetadata());
  }

  readLeafMetadata(): RouteMetadata {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return readRouteMetadata(route);
  }

  readMergedMetadata(): RouteMetadata {
    const merged: RouteMetadata = {};
    let current: ActivatedRouteSnapshot | null = this.activatedRoute.snapshot.root;

    while (current) {
      Object.assign(merged, readRouteMetadata(current));
      current = current.firstChild;
    }

    return merged;
  }

  getLeafRouteSnapshot() {
    let route = this.activatedRoute.snapshot;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }
}
