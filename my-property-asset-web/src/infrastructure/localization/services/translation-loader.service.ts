import { Injectable, signal } from '@angular/core';

import { DEFAULT_TRANSLATIONS } from '../config/default-translations.config';
import { TranslationDictionary } from '../models/locale.model';

@Injectable({ providedIn: 'root' })
export class TranslationLoaderService {
  private readonly dictionaries = signal<Record<string, TranslationDictionary>>({
    'en-US': DEFAULT_TRANSLATIONS,
  });

  register(locale: string, dictionary: TranslationDictionary): void {
    this.dictionaries.update((current) => ({
      ...current,
      [locale]: { ...(current[locale] ?? {}), ...dictionary },
    }));
  }

  async loadLocale(locale: string): Promise<void> {
    // Framework hook for future HTTP translation bundles.
    if (!this.dictionaries()[locale]) {
      this.register(locale, DEFAULT_TRANSLATIONS);
    }
  }

  translate(key: string, locale = 'en-US'): string {
    const dictionary = this.dictionaries()[locale] ?? DEFAULT_TRANSLATIONS;
    const value = dictionary[key];
    return typeof value === 'string' ? value : key;
  }
}
