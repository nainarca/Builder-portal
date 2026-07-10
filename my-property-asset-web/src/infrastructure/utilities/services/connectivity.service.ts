import { Injectable, inject } from '@angular/core';

import { OnlineStatusMonitorService } from '../../network';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private readonly onlineStatus = inject(OnlineStatusMonitorService);

  readonly isOnline = this.onlineStatus.isOnline;
}
