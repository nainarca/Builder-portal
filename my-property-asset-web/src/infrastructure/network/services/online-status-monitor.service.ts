import { Injectable, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

import { NotificationService } from '../../notification/services/notification.service';

@Injectable({ providedIn: 'root' })
export class OnlineStatusMonitorService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);

  private readonly onlineState = signal(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  private wasOffline = false;

  readonly isOnline = this.onlineState.asReadonly();

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    fromEvent(window, 'online')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onlineState.set(true);
        if (this.wasOffline) {
          this.notificationService.connectionRecovered();
        }
        this.wasOffline = false;
      });

    fromEvent(window, 'offline')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onlineState.set(false);
        this.wasOffline = true;
      });
  }
}
