import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationStateService {
  private readonly mobileMenuOpenSignal = signal(false);
  private readonly drawerOpenSignal = signal(false);
  private readonly overlayOpenSignal = signal(false);
  private readonly sidebarCollapsedSignal = signal(false);

  readonly mobileMenuOpen = this.mobileMenuOpenSignal.asReadonly();
  readonly drawerOpen = this.drawerOpenSignal.asReadonly();
  readonly overlayOpen = this.overlayOpenSignal.asReadonly();
  readonly sidebarCollapsed = this.sidebarCollapsedSignal.asReadonly();

  openMobileNavigation(): void {
    this.mobileMenuOpenSignal.set(true);
    this.overlayOpenSignal.set(true);
  }

  closeMobileNavigation(): void {
    this.mobileMenuOpenSignal.set(false);
    this.overlayOpenSignal.set(false);
  }

  toggleMobileNavigation(): void {
    this.mobileMenuOpenSignal.update((open) => !open);
    this.overlayOpenSignal.set(!this.mobileMenuOpenSignal());
  }

  openDrawer(): void {
    this.drawerOpenSignal.set(true);
    this.overlayOpenSignal.set(true);
  }

  closeDrawer(): void {
    this.drawerOpenSignal.set(false);
    this.overlayOpenSignal.set(false);
  }

  toggleDrawer(): void {
    this.drawerOpenSignal.update((open) => !open);
    this.overlayOpenSignal.set(this.drawerOpenSignal());
  }

  openOverlay(): void {
    this.overlayOpenSignal.set(true);
  }

  closeOverlay(): void {
    this.overlayOpenSignal.set(false);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedSignal.set(collapsed);
  }

  toggleSidebarCollapsed(): void {
    this.sidebarCollapsedSignal.update((collapsed) => !collapsed);
  }
}
