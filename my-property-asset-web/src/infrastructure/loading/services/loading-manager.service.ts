import { Injectable, Signal, computed, signal } from '@angular/core';

import { LoadingScope } from '../models/loading.model';

@Injectable({ providedIn: 'root' })
export class LoadingManagerService {
  private readonly scopeCounts = signal<Record<string, number>>({});

  readonly globalLoading = computed(() => (this.scopeCounts()['global'] ?? 0) > 0);
  readonly pageLoading = computed(() => (this.scopeCounts()['page'] ?? 0) > 0);

  isScopeLoading(scope: LoadingScope): Signal<boolean> {
    return computed(() => (this.scopeCounts()[scope] ?? 0) > 0);
  }

  isLoading(scope: LoadingScope): boolean {
    return (this.scopeCounts()[scope] ?? 0) > 0;
  }

  start(scope: LoadingScope = 'global'): () => void {
    this.scopeCounts.update((counts) => ({
      ...counts,
      [scope]: (counts[scope] ?? 0) + 1,
    }));

    let stopped = false;

    return () => {
      if (stopped) {
        return;
      }

      stopped = true;
      this.scopeCounts.update((counts) => ({
        ...counts,
        [scope]: Math.max(0, (counts[scope] ?? 0) - 1),
      }));
    };
  }

  async track<T>(scope: LoadingScope, operation: () => Promise<T>): Promise<T> {
    const stop = this.start(scope);
    try {
      return await operation();
    } finally {
      stop();
    }
  }

  reset(scope?: LoadingScope): void {
    if (!scope) {
      this.scopeCounts.set({});
      return;
    }

    this.scopeCounts.update((counts) => {
      const next = { ...counts };
      delete next[scope];
      return next;
    });
  }
}
