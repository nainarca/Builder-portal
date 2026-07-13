import { Injectable, signal } from '@angular/core';

import { SUPER_ADMIN_DASHBOARD_WIDGETS } from '../config/super-admin-dashboard.config';
import {
  DashboardPreferences,
  DashboardWidgetDefinition,
  DashboardWidgetId,
} from '../models/dashboard.model';

const STORAGE_KEY = 'mpa-sa-dashboard-preferences';

const DEFAULT_PREFERENCES: DashboardPreferences = {
  visibleWidgets: SUPER_ADMIN_DASHBOARD_WIDGETS.filter((w) => w.defaultVisible).map((w) => w.id),
  pinnedActions: [],
  favoriteActions: [],
};

@Injectable({ providedIn: 'root' })
export class DashboardPreferencesService {
  private readonly preferencesSignal = signal<DashboardPreferences>(this.load());

  readonly preferences = this.preferencesSignal.asReadonly();

  readonly visibleWidgets = signal<readonly DashboardWidgetDefinition[]>(
    this.resolveVisibleWidgets(this.preferencesSignal().visibleWidgets),
  );

  isWidgetVisible(id: DashboardWidgetId): boolean {
    return this.preferencesSignal().visibleWidgets.includes(id);
  }

  setWidgetVisibility(id: DashboardWidgetId, visible: boolean): void {
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
    this.preferencesSignal.set(DEFAULT_PREFERENCES);
    this.visibleWidgets.set(this.resolveVisibleWidgets(DEFAULT_PREFERENCES.visibleWidgets));
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private update(preferences: DashboardPreferences): void {
    this.preferencesSignal.set(preferences);
    this.visibleWidgets.set(this.resolveVisibleWidgets(preferences.visibleWidgets));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }

  private load(): DashboardPreferences {
    if (typeof sessionStorage === 'undefined') {
      return DEFAULT_PREFERENCES;
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PREFERENCES;
    }

    try {
      return { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as DashboardPreferences) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  }

  private resolveVisibleWidgets(ids: readonly DashboardWidgetId[]): readonly DashboardWidgetDefinition[] {
    return SUPER_ADMIN_DASHBOARD_WIDGETS.filter((widget) => ids.includes(widget.id)).sort(
      (a, b) => a.order - b.order,
    );
  }
}
