import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Shell global search trigger — P0.1 §1.1 / UI-REBIRTH §2 foundation.
 * Opens a search surface with ⌘K / Ctrl+K. Full command-palette record jump is Phase 3.
 */
@Component({
  selector: 'app-shell-global-search',
  imports: [ReactiveFormsModule],
  templateUrl: './shell-global-search.component.html',
  styleUrl: './shell-global-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-global-search',
  },
})
export class ShellGlobalSearchComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private readonly queryInput = viewChild<ElementRef<HTMLInputElement>>('queryInput');

  readonly open = signal(false);
  readonly query = new FormControl('', { nonNullable: true });
  readonly shortcutLabel = this.resolveShortcutLabel();

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.close());
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    const isPalette =
      (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.altKey;
    if (isPalette) {
      event.preventDefault();
      this.toggle();
      return;
    }

    if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.close();
    }
  }

  toggle(): void {
    if (this.open()) {
      this.close();
      return;
    }
    this.openPanel();
  }

  openPanel(): void {
    this.open.set(true);
    queueMicrotask(() => this.queryInput()?.nativeElement.focus());
  }

  close(): void {
    this.open.set(false);
    this.query.reset('');
  }

  private resolveShortcutLabel(): string {
    if (typeof navigator === 'undefined') {
      return 'Ctrl K';
    }
    const platform = navigator.platform ?? '';
    const isApple = /Mac|iPhone|iPad|iPod/i.test(platform);
    return isApple ? '⌘K' : 'Ctrl K';
  }
}
