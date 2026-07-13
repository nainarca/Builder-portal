import { Injectable, signal } from '@angular/core';

import { ConversionAttributionParams } from '../models/conversion.model';

const STORAGE_KEY = 'mpa-conversion-attribution';

const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'ref',
  'campaign',
] as const;

@Injectable({ providedIn: 'root' })
export class ConversionAttributionService {
  private readonly attributionSignal = signal<ConversionAttributionParams>({});

  readonly attribution = this.attributionSignal.asReadonly();

  captureFromUrl(url: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const parsed = new URL(url, window.location.origin);
    const captured: Record<string, string> = { ...this.attributionSignal() };
    let hasNew = false;

    TRACKED_PARAMS.forEach((key) => {
      const value = parsed.searchParams.get(key);
      if (value) {
        captured[key] = value;
        hasNew = true;
      }
    });

    if (hasNew) {
      this.attributionSignal.set(captured as ConversionAttributionParams);
      this.persist(captured as ConversionAttributionParams);
    }
  }

  initialize(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        this.attributionSignal.set(JSON.parse(stored) as ConversionAttributionParams);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    this.captureFromUrl(window.location.href);
  }

  buildQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};
    const attribution = this.attributionSignal();

    TRACKED_PARAMS.forEach((key) => {
      const value = attribution[key];
      if (value) {
        params[key] = value;
      }
    });

    return params;
  }

  private persist(attribution: ConversionAttributionParams): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  }
}
