import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

export interface ViewportSize {
  width: number;
  height: number;
}

@Injectable({ providedIn: 'root' })
export class WindowResizeService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly viewport = signal<ViewportSize>(this.readViewport());

  readonly size = this.viewport.asReadonly();

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.viewport.set(this.readViewport()));
  }

  private readViewport(): ViewportSize {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }

    return { width: window.innerWidth, height: window.innerHeight };
  }
}
