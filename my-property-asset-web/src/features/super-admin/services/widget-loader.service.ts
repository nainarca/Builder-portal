import { Injectable, signal } from '@angular/core';

import { DashboardWidgetId } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class WidgetLoaderService {
  private readonly loadingWidgets = signal<ReadonlySet<DashboardWidgetId>>(new Set());
  private readonly refreshedAt = signal<Partial<Record<DashboardWidgetId, string>>>({});

  readonly loading = this.loadingWidgets.asReadonly();
  readonly lastRefreshed = this.refreshedAt.asReadonly();

  isLoading(id: DashboardWidgetId): boolean {
    return this.loadingWidgets().has(id);
  }

  getLastRefreshed(id: DashboardWidgetId): string | undefined {
    return this.refreshedAt()[id];
  }

  async refreshWidget(id: DashboardWidgetId): Promise<void> {
    this.setLoading(id, true);
    await this.simulateLoad();
    this.refreshedAt.update((current) => ({
      ...current,
      [id]: new Date().toISOString(),
    }));
    this.setLoading(id, false);
  }

  async refreshAll(ids: readonly DashboardWidgetId[]): Promise<void> {
    const refreshable = ids.filter((id) => id !== 'quick-actions' && id !== 'announcements');
    refreshable.forEach((id) => this.setLoading(id, true));
    await this.simulateLoad();
    const timestamp = new Date().toISOString();
    this.refreshedAt.update((current) => {
      const next = { ...current };
      refreshable.forEach((id) => {
        next[id] = timestamp;
      });
      return next;
    });
    refreshable.forEach((id) => this.setLoading(id, false));
  }

  private setLoading(id: DashboardWidgetId, loading: boolean): void {
    this.loadingWidgets.update((current) => {
      const next = new Set(current);
      if (loading) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  private simulateLoad(): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, 600);
    });
  }
}
