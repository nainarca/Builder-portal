import { Injectable, inject, signal } from '@angular/core';

import { StorageService } from '@infrastructure/storage';

export type CookieConsentStatus = 'pending' | 'accepted' | 'declined';

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly storage = inject(StorageService);
  private readonly statusSignal = signal<CookieConsentStatus>('pending');

  private static readonly STORAGE_KEY = 'mpa-cookie-consent';

  readonly status = this.statusSignal.asReadonly();
  readonly visible = signal(false);

  constructor() {
    this.restore();
  }

  initialize(): void {
    if (this.statusSignal() === 'pending') {
      this.visible.set(true);
    }
  }

  accept(): void {
    this.persist('accepted');
    this.visible.set(false);
  }

  decline(): void {
    this.persist('declined');
    this.visible.set(false);
  }

  hasAnalyticsConsent(): boolean {
    return this.statusSignal() === 'accepted';
  }

  private restore(): void {
    const stored = this.storage.get<CookieConsentStatus>(CookieConsentService.STORAGE_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      this.statusSignal.set(stored);
    }
  }

  private persist(status: CookieConsentStatus): void {
    this.statusSignal.set(status);
    this.storage.set(CookieConsentService.STORAGE_KEY, status);
  }
}
