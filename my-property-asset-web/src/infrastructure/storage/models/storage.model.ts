export type StorageBackend = 'local' | 'session' | 'memory';

export interface StorageOptions {
  backend?: StorageBackend;
  encrypt?: boolean;
}

export interface StorageEncryptionHook {
  encrypt(value: string): string;
  decrypt(value: string): string;
}
