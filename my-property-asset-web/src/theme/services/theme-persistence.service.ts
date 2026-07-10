import { Injectable } from '@angular/core';

import { THEME_ENGINE_CONFIG } from '../config';
import { ThemeModePreference, ThemePersistenceState } from '../models';

@Injectable({ providedIn: 'root' })
export class ThemePersistenceService {
  private readonly storageKey = THEME_ENGINE_CONFIG.persistenceKey;

  load(): ThemePersistenceState | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = window.localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as ThemePersistenceState;
    } catch {
      return null;
    }
  }

  save(state: ThemePersistenceState): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  clear(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(this.storageKey);
  }
}

export function isSupportedThemeMode(mode: string): mode is ThemeModePreference {
  return THEME_ENGINE_CONFIG.supportedModes.includes(mode as ThemeModePreference);
}
