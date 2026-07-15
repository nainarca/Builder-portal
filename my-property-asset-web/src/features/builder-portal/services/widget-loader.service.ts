import { Injectable, inject, signal } from '@angular/core';

import { BuilderDashboardWidgetId } from '../models/dashboard.model';
import { WidgetRegistryService } from './widget-registry.service';

@Injectable({ providedIn: 'root' })
export class WidgetLoaderService {
  private readonly registry = inject(WidgetRegistryService);

  private readonly loadingWidgets = signal<ReadonlySet<BuilderDashboardWidgetId>>(new Set());
  private readonly refreshedAt = signal<Partial<Record<BuilderDashboardWidgetId, string>>>({});

  readonly loading = this.loadingWidgets.asReadonly();
  readonly lastRefreshed = this.refreshedAt.asReadonly();

  isLoading(id: BuilderDashboardWidgetId): boolean {
    return this.loadingWidgets().has(id);
  }

  getLastRefreshed(id: BuilderDashboardWidgetId): string | undefined {
    return this.refreshedAt()[id];
  }

  async refreshWidget(id: BuilderDashboardWidgetId): Promise<void> {
    this.setLoading(id, true);
    await this.simulateLoad();
    this.refreshedAt.update((current) => ({
      ...current,
      [id]: new Date().toISOString(),
    }));
    this.setLoading(id, false);
  }

  async refreshAll(ids: readonly BuilderDashboardWidgetId[]): Promise<void> {
    const refreshable = ids.filter((id) => this.registry.getById(id)?.refreshable ?? false);
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

  private setLoading(id: BuilderDashboardWidgetId, loading: boolean): void {
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
