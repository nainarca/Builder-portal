import { Injectable, inject, signal } from '@angular/core';

import { APPLICATION_CONSTANTS } from '../../config/constants/application.constants';
import { ApplicationEventBusService } from '../../events/services/application-event-bus.service';
import { ThemeService } from '../../../theme/services/theme.service';
import { STORAGE_KEYS, StorageService } from '../../storage';
import {
  ApplicationPreferences,
  DEFAULT_APPLICATION_PREFERENCES,
  DEFAULT_USER_PREFERENCES,
  UserPreferences,
} from '../models/preferences.model';

@Injectable({ providedIn: 'root' })
export class ApplicationPreferencesService {
  private readonly storage = inject(StorageService);

  private readonly preferencesSignal = signal<ApplicationPreferences>(
    this.storage.get<ApplicationPreferences>(STORAGE_KEYS.appPreferences) ??
      DEFAULT_APPLICATION_PREFERENCES,
  );

  readonly preferences = this.preferencesSignal.asReadonly();

  update(partial: Partial<ApplicationPreferences>): void {
    this.preferencesSignal.update((current) => {
      const next = { ...current, ...partial };
      this.storage.set(STORAGE_KEYS.appPreferences, next);
      return next;
    });
  }
}

@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  private readonly storage = inject(StorageService);
  private readonly eventBus = inject(ApplicationEventBusService);
  private readonly appPreferences = inject(ApplicationPreferencesService);
  private readonly themeService = inject(ThemeService);

  private readonly preferencesSignal = signal<UserPreferences>(this.loadInitial());

  readonly preferences = this.preferencesSignal.asReadonly();

  constructor() {
    const prefs = this.preferencesSignal();
    if (prefs.themeMode !== this.themeService.modePreference()) {
      this.themeService.setMode(prefs.themeMode);
    }
  }

  update(partial: Partial<UserPreferences>): void {
    this.preferencesSignal.update((current) => {
      const next = { ...current, ...partial };
      this.persist(next);
      this.publishChanges(partial, next);
      return next;
    });
  }

  synchronize(): void {
    const current = this.preferencesSignal();
    this.persist(current);
    this.eventBus.publish({
      type: 'preferences.synchronized',
      payload: current,
      timestamp: Date.now(),
    });
  }

  private loadInitial(): UserPreferences {
    const stored = this.storage.get<UserPreferences>(STORAGE_KEYS.userPreferences);
    const appDefaults = this.appPreferences.preferences();

    return {
      language: stored?.language ?? appDefaults.defaultLanguage,
      dateFormat: stored?.dateFormat ?? APPLICATION_CONSTANTS.defaultDateFormat,
      timeFormat: stored?.timeFormat ?? APPLICATION_CONSTANTS.defaultTimeFormat,
      currency: stored?.currency ?? appDefaults.defaultCurrency,
      timezone: stored?.timezone ?? appDefaults.defaultTimezone,
      themeMode: stored?.themeMode ?? DEFAULT_USER_PREFERENCES.themeMode,
    };
  }

  private persist(preferences: UserPreferences): void {
    this.storage.set(STORAGE_KEYS.userPreferences, preferences);
  }

  private publishChanges(partial: Partial<UserPreferences>, next: UserPreferences): void {
    if (partial.themeMode !== undefined) {
      this.themeService.setMode(next.themeMode);
    }

    if (partial.language !== undefined) {
      this.eventBus.publish({
        type: 'preferences.language.changed',
        payload: { language: partial.language },
        timestamp: Date.now(),
      });
    }
  }
}
