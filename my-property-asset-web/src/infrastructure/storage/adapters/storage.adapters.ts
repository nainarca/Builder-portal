export abstract class StorageAdapter {
  abstract getItem(key: string): string | null;
  abstract setItem(key: string, value: string): void;
  abstract removeItem(key: string): void;
  abstract clear(): void;
}

export class LocalStorageAdapter extends StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }

  clear(): void {
    window.localStorage.clear();
  }
}

export class SessionStorageAdapter extends StorageAdapter {
  getItem(key: string): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.sessionStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    window.sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.sessionStorage.removeItem(key);
  }

  clear(): void {
    window.sessionStorage.clear();
  }
}
