import { Injectable, inject } from '@angular/core';

import { UserPreferencesService } from '../../preferences';

@Injectable({ providedIn: 'root' })
export class LocaleFormattingService {
  private readonly preferences = inject(UserPreferencesService);

  formatDate(value: Date | number, options?: Intl.DateTimeFormatOptions): string {
    const prefs = this.preferences.preferences();
    return new Intl.DateTimeFormat(prefs.language, {
      dateStyle: prefs.dateFormat as Intl.DateTimeFormatOptions['dateStyle'],
      timeZone: prefs.timezone,
      ...options,
    }).format(value);
  }

  formatTime(value: Date | number, options?: Intl.DateTimeFormatOptions): string {
    const prefs = this.preferences.preferences();
    return new Intl.DateTimeFormat(prefs.language, {
      timeStyle: prefs.timeFormat as Intl.DateTimeFormatOptions['timeStyle'],
      timeZone: prefs.timezone,
      ...options,
    }).format(value);
  }

  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const prefs = this.preferences.preferences();
    return new Intl.NumberFormat(prefs.language, options).format(value);
  }

  formatCurrency(value: number, currency?: string): string {
    const prefs = this.preferences.preferences();
    return new Intl.NumberFormat(prefs.language, {
      style: 'currency',
      currency: currency ?? prefs.currency,
    }).format(value);
  }
}
