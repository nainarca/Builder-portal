import { Injectable, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { NavigationContextType, NavigationZone } from '../models';
import { NavigationEvent, NavigationEventPayload } from '../events';
import { NavigationRegistry } from '../registry';
import { NavigationStateService } from './navigation-state.service';
import { RouteMetadataService } from './route-metadata.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly router = inject(Router);
  private readonly registry = inject(NavigationRegistry);
  private readonly state = inject(NavigationStateService);
  private readonly routeMetadataService = inject(RouteMetadataService);

  private readonly contextSignal = signal<NavigationContextType>('public-website');
  private readonly activeRouteSignal = signal<string>(this.router.url);
  private readonly eventsSignal = signal<NavigationEvent[]>([]);

  readonly context = this.contextSignal.asReadonly();
  readonly activeRoute = this.activeRouteSignal.asReadonly();
  readonly events = this.eventsSignal.asReadonly();

  readonly configuration = computed(() => this.registry.get(this.contextSignal()));

  readonly topNav = computed(() => this.registry.getSection(this.contextSignal(), 'top'));
  readonly sidebarNav = computed(() => this.registry.getSection(this.contextSignal(), 'sidebar'));
  readonly contextNav = computed(() => this.registry.getSection(this.contextSignal(), 'context'));
  readonly secondaryNav = computed(() =>
    this.registry.getSection(this.contextSignal(), 'secondary'),
  );
  readonly footerNav = computed(() => this.registry.getSection(this.contextSignal(), 'footer'));
  readonly userNav = computed(() => this.registry.getSection(this.contextSignal(), 'user'));
  readonly quickActions = computed(() =>
    this.registry.getSection(this.contextSignal(), 'quickActions'),
  );
  readonly favorites = computed(() => this.registry.getSection(this.contextSignal(), 'favorites'));
  readonly recentItems = computed(() =>
    this.registry.getSection(this.contextSignal(), 'recentItems'),
  );

  readonly currentMetadata = computed(() => this.routeMetadataService.leafMetadata());

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.activeRouteSignal.set(this.router.url);
      this.syncContextFromRoute();
    });

    this.syncContextFromRoute();
  }

  setContext(context: NavigationContextType): void {
    this.contextSignal.set(context);
    this.pushEvent({
      type: 'contextChanged',
      payload: { context },
    });
  }

  refreshContext(): void {
    const current = this.contextSignal();
    this.contextSignal.set(current);
    this.pushEvent({
      type: 'contextChanged',
      payload: { context: current, refreshed: true },
    });
  }

  getSection(zone: NavigationZone) {
    return this.registry.getSection(this.contextSignal(), zone);
  }

  isRouteActive(route: string | readonly string[]): boolean {
    const target = typeof route === 'string' ? route : `/${route.filter(Boolean).join('/')}`;
    const normalizedTarget = target.startsWith('/') ? target : `/${target}`;
    const current = this.activeRouteSignal();

    return current === normalizedTarget || current.startsWith(`${normalizedTarget}/`);
  }

  notifyItemActivated(payload: NavigationEventPayload): void {
    this.pushEvent({ type: 'navigate', payload });
    this.state.closeMobileNavigation();
    this.state.closeDrawer();
    this.state.closeOverlay();
  }

  navigateToItem(payload: NavigationEventPayload): void {
    if (payload.item.route) {
      const commands =
        typeof payload.item.route === 'string'
          ? payload.item.route.startsWith('/')
            ? [payload.item.route]
            : ['/', payload.item.route]
          : ['/', ...payload.item.route.filter(Boolean)];

      void this.router.navigate(commands);
    }

    this.notifyItemActivated(payload);
  }

  toggleZone(zone: NavigationZone, open: boolean): void {
    this.pushEvent({
      type: 'zoneToggled',
      payload: { zone, open },
    });
  }

  private syncContextFromRoute(): void {
    const metadata = this.routeMetadataService.readMergedMetadata();

    if (metadata.navigationContext) {
      this.contextSignal.set(metadata.navigationContext);
    }
  }

  private pushEvent(event: NavigationEvent): void {
    this.eventsSignal.update((events) => [...events.slice(-49), event]);
  }
}
