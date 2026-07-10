import { Injectable, inject } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

import { LoadingManagerService } from './loading-manager.service';

@Injectable({ providedIn: 'root' })
export class RouterLoadingService {
  private readonly router = inject(Router);
  private readonly loadingManager = inject(LoadingManagerService);

  private stopPageLoading: (() => void) | null = null;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.stopPageLoading?.();
        this.stopPageLoading = this.loadingManager.start('page');
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.stopPageLoading?.();
        this.stopPageLoading = null;
      }
    });
  }
}
