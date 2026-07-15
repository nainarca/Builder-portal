import { Injectable, inject, signal } from '@angular/core';

import {
  BuilderDashboardWidgetId,
  DashboardPreferences,
  DashboardWidgetDefinition,
} from '../models/dashboard.model';
import { WidgetRegistryService } from './widget-registry.service';

const STORAGE_KEY = 'mpa-bp-dashboard-preferences';

@Injectable({ providedIn: 'root' })
export class DashboardPreferencesService {
  private readonly registry = inject(WidgetRegistryService);

  private readonly defaultPreferences: DashboardPreferences = {
    visibleWidgets: this.registry.getAll().filter((w) => w.defaultVisible).map((w) => w.id),
    pinnedActions: [],
    favoriteActions: [],
  };

  private readonly preferencesSignal = signal<DashboardPreferences>(this.load());

  readonly preferences = this.preferencesSignal.asReadonly();

  readonly visibleWidgets = signal<readonly DashboardWidgetDefinition[]>(
    this.resolveVisibleWidgets(this.preferencesSignal().visibleWidgets),
  );

  isWidgetVisible(id: BuilderDashboardWidgetId): boolean {
    return this.preferencesSignal().visibleWidgets.includes(id);
  }

  setWidgetVisibility(id: BuilderDashboardWidgetId, visible: boolean): void {
    const current = this.preferencesSignal();
    const visibleWidgets = visible
      ? [...new Set([...current.visibleWidgets, id])]
      : current.visibleWidgets.filter((widgetId) => widgetId !== id);

    this.update({ ...current, visibleWidgets });
  }

  togglePinnedAction(actionId: string): void {
    const current = this.preferencesSignal();
    const pinned = current.pinnedActions.includes(actionId)
      ? current.pinnedActions.filter((id) => id !== actionId)
      : [...current.pinnedActions, actionId];

    this.update({ ...current, pinnedActions: pinned });
  }

  toggleFavoriteAction(actionId: string): void {
    const current = this.preferencesSignal();
    const favorites = current.favoriteActions.includes(actionId)
      ? current.favoriteActions.filter((id) => id !== actionId)
      : [...current.favoriteActions, actionId];

    this.update({ ...current, favoriteActions: favorites });
  }

  markRefreshed(): void {
    this.update({
      ...this.preferencesSignal(),
      lastRefreshedAt: new Date().toISOString(),
    });
  }

  reset(): void {
    this.preferencesSignal.set(this.defaultPreferences);
    this.visibleWidgets.set(this.resolveVisibleWidgets(this.defaultPreferences.visibleWidgets));
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private update(preferences: DashboardPreferences): void {
    this.preferencesSignal.set(preferences);
    this.visibleWidgets.set(this.resolveVisibleWidgets(preferences.visibleWidgets));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }

  private load(): DashboardPreferences {
    if (typeof sessionStorage === 'undefined') {
      return this.defaultPreferences;
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return this.defaultPreferences;
    }

    try {
      return { ...this.defaultPreferences, ...(JSON.parse(raw) as DashboardPreferences) };
    } catch {
      return this.defaultPreferences;
    }
  }

  private resolveVisibleWidgets(
    ids: readonly BuilderDashboardWidgetId[],
  ): readonly DashboardWidgetDefinition[] {
    return this.registry
      .getAll()
      .filter((widget) => ids.includes(widget.id))
      .sort((a, b) => a.order - b.order);
  }
}
