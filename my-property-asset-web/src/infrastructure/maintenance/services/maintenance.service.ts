import { Injectable, signal } from '@angular/core';

import { MaintenanceState, SystemAnnouncement } from '../models/maintenance.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly state = signal<MaintenanceState>({
    enabled: false,
    title: 'Scheduled maintenance',
    message: 'The platform is temporarily unavailable while we perform upgrades.',
  });

  readonly maintenance = this.state.asReadonly();

  enable(partial?: Partial<MaintenanceState>): void {
    this.state.update((current) => ({
      ...current,
      enabled: true,
      ...partial,
    }));
  }

  disable(): void {
    this.state.update((current) => ({ ...current, enabled: false }));
  }

  updateMessage(message: string, estimatedReturn?: string): void {
    this.state.update((current) => ({
      ...current,
      message,
      estimatedReturn,
    }));
  }
}

@Injectable({ providedIn: 'root' })
export class SystemAnnouncementService {
  private readonly announcement = signal<SystemAnnouncement | null>(null);

  readonly activeAnnouncement = this.announcement.asReadonly();

  publish(announcement: SystemAnnouncement): void {
    this.announcement.set(announcement);
  }

  dismiss(id: string): void {
    if (this.announcement()?.id === id) {
      this.announcement.set(null);
    }
  }

  clear(): void {
    this.announcement.set(null);
  }
}
