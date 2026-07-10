import { Injectable, inject } from '@angular/core';

import { StorageService } from '../../../infrastructure/storage';
import { AUTH_STORAGE_KEYS } from '../constants/auth.constants';

@Injectable({ providedIn: 'root' })
export class RememberMeService {
  private readonly storage = inject(StorageService);

  getRememberedEmail(): string | null {
    return this.storage.get<string>(AUTH_STORAGE_KEYS.rememberedEmail);
  }

  persist(email: string, remember: boolean): void {
    if (remember) {
      this.storage.set(AUTH_STORAGE_KEYS.rememberedEmail, email.trim());
      return;
    }

    this.storage.remove(AUTH_STORAGE_KEYS.rememberedEmail);
  }
}
