import { Injectable, inject } from '@angular/core';

import { MemoryStorageAdapter } from '../adapters/memory-storage.adapter';
import { LocalStorageAdapter, SessionStorageAdapter, StorageAdapter } from '../adapters/storage.adapters';
import { StorageEncryptionHookService } from '../hooks/storage-encryption.hook';
import { StorageBackend, StorageOptions } from '../models/storage.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly encryptionHook = inject(StorageEncryptionHookService);
  private readonly local = new LocalStorageAdapter();
  private readonly session = new SessionStorageAdapter();
  private readonly memory = new MemoryStorageAdapter();

  get<T>(key: string, options?: StorageOptions): T | null {
    const raw = this.resolveAdapter(options?.backend).getItem(key);
    if (!raw) {
      return null;
    }

    const decoded = options?.encrypt ? this.encryptionHook.decrypt(raw) : raw;

    try {
      return JSON.parse(decoded) as T;
    } catch {
      return decoded as T;
    }
  }

  set<T>(key: string, value: T, options?: StorageOptions): void {
    const serialized = JSON.stringify(value);
    const encoded = options?.encrypt ? this.encryptionHook.encrypt(serialized) : serialized;
    this.resolveAdapter(options?.backend).setItem(key, encoded);
  }

  remove(key: string, backend: StorageBackend = 'local'): void {
    this.resolveAdapter(backend).removeItem(key);
  }

  clear(backend: StorageBackend = 'local'): void {
    this.resolveAdapter(backend).clear();
  }

  private resolveAdapter(backend: StorageBackend = 'local'): StorageAdapter {
    switch (backend) {
      case 'session':
        return this.session;
      case 'memory':
        return this.memory;
      default:
        return this.local;
    }
  }
}
