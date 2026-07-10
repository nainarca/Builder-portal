import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalLoadingService {
  private readonly pendingCount = signal(0);

  readonly isLoading = computed(() => this.pendingCount() > 0);
  readonly pending = this.pendingCount.asReadonly();

  start(): void {
    this.pendingCount.update((count) => count + 1);
  }

  stop(): void {
    this.pendingCount.update((count) => Math.max(0, count - 1));
  }

  reset(): void {
    this.pendingCount.set(0);
  }

  async track<T>(operation: () => Promise<T>): Promise<T> {
    this.start();
    try {
      return await operation();
    } finally {
      this.stop();
    }
  }
}
