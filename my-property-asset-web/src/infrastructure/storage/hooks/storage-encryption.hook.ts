import { Injectable } from '@angular/core';

import { StorageEncryptionHook } from '../models/storage.model';

@Injectable({ providedIn: 'root' })
export class StorageEncryptionHookService implements StorageEncryptionHook {
  private enabled = false;

  enable(): void {
    this.enabled = true;
  }

  encrypt(value: string): string {
    if (!this.enabled) {
      return value;
    }

    return btoa(value);
  }

  decrypt(value: string): string {
    if (!this.enabled) {
      return value;
    }

    try {
      return atob(value);
    } catch {
      return value;
    }
  }
}
