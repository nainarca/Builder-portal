import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, throttleTime } from 'rxjs';

@Component({
  selector: 'app-back-to-top-button',
  templateUrl: './back-to-top-button.component.html',
  styleUrl: './back-to-top-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackToTopButtonComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly visible = signal(false);

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    fromEvent(window, 'scroll', { passive: true })
      .pipe(throttleTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.visible.set(window.scrollY > 400);
      });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
