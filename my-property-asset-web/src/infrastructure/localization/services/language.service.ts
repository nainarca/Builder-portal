import { Injectable, inject, signal } from '@angular/core';

import { UserPreferencesService } from '../../preferences';
import { ApplicationEventBusService } from '../../events';
import { DEFAULT_LOCALES, LocaleConfiguration } from '../models/locale.model';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly preferences = inject(UserPreferencesService);
  private readonly eventBus = inject(ApplicationEventBusService);

  private readonly activeLocale = signal<LocaleConfiguration>(DEFAULT_LOCALES[0]);

  readonly locale = this.activeLocale.asReadonly();
  readonly isRtl = () => this.activeLocale().direction === 'rtl';

  constructor() {
    this.applyLocale(this.preferences.preferences().language);

    this.eventBus.on('preferences.language.changed', (event) => {
      const payload = event.payload as { language: string } | undefined;
      if (payload?.language) {
        this.applyLocale(payload.language);
      }
    });
  }

  setLanguage(code: string): void {
    this.preferences.update({ language: code });
    this.applyLocale(code);
  }

  listLocales(): LocaleConfiguration[] {
    return DEFAULT_LOCALES;
  }

  private applyLocale(code: string): void {
    const locale = DEFAULT_LOCALES.find((entry) => entry.code === code) ?? DEFAULT_LOCALES[0];
    this.activeLocale.set(locale);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale.code;
      document.documentElement.dir = locale.direction;
    }
  }
}
