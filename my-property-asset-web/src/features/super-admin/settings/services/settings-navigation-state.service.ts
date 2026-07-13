import { Injectable, computed, inject, signal } from '@angular/core';

import { ApplicationConfigurationService } from '../../../../infrastructure/config/services/application-configuration.service';
import {
  DEFAULT_FAVORITE_IDS,
  DEFAULT_PINNED_IDS,
  MOCK_SETTINGS_CHANGES,
  SETTINGS_CATEGORIES,
  SETTINGS_SEARCH_INDEX,
} from '../config/settings.config';
import { SettingsCategoryId, SettingsSearchItem } from '../models/settings-admin.model';

const STORAGE_KEY = 'mpa-sa-settings-nav-state';

interface PersistedNavState {
  favorites: string[];
  pinned: string[];
}

@Injectable({ providedIn: 'root' })
export class SettingsNavigationStateService {
  private readonly appConfig = inject(ApplicationConfigurationService);

  readonly searchQuery = signal('');
  readonly favorites = signal<readonly string[]>([...DEFAULT_FAVORITE_IDS]);
  readonly pinned = signal<readonly string[]>([...DEFAULT_PINNED_IDS]);
  readonly activeCategory = signal<SettingsCategoryId | null>(null);

  readonly categories = SETTINGS_CATEGORIES;
  readonly recentChanges = MOCK_SETTINGS_CHANGES;

  readonly searchResults = computed(() => this.filterSearch(this.searchQuery()));
  readonly favoriteItems = computed(() =>
    this.resolveItems(this.favorites()),
  );
  readonly pinnedItems = computed(() =>
    this.resolveItems(this.pinned()),
  );

  readonly environmentSummary = computed(() => ({
    name: this.appConfig.configuration().environmentName,
    version: this.appConfig.appVersion(),
    apiBaseUrl: this.appConfig.apiBaseUrl(),
    runtimeLoaded: this.appConfig.isRuntimeLoaded(),
  }));

  constructor() {
    this.restore();
  }

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setActiveCategory(category: SettingsCategoryId | null): void {
    this.activeCategory.set(category);
  }

  toggleFavorite(id: string): void {
    this.favorites.update((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id],
    );
    this.persist();
  }

  togglePinned(id: string): void {
    this.pinned.update((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    );
    this.persist();
  }

  isFavorite(id: string): boolean {
    return this.favorites().includes(id);
  }

  isPinned(id: string): boolean {
    return this.pinned().includes(id);
  }

  private filterSearch(query: string): SettingsSearchItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SETTINGS_SEARCH_INDEX.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q)),
    );
  }

  private resolveItems(ids: readonly string[]): SettingsSearchItem[] {
    return ids
      .map((id) => SETTINGS_SEARCH_INDEX.find((item) => item.id === id))
      .filter((item): item is SettingsSearchItem => !!item);
  }

  private persist(): void {
    const state: PersistedNavState = {
      favorites: [...this.favorites()],
      pinned: [...this.pinned()],
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private restore(): void {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedNavState;
      if (parsed.favorites?.length) this.favorites.set(parsed.favorites);
      if (parsed.pinned?.length) this.pinned.set(parsed.pinned);
    } catch {
      // ignore corrupt state
    }
  }
}
