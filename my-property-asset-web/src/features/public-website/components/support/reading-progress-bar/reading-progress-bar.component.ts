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
  selector: 'app-reading-progress-bar',
  templateUrl: './reading-progress-bar.component.html',
  styleUrl: './reading-progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingProgressBarComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly progress = signal(0);

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    fromEvent(window, 'scroll', { passive: true })
      .pipe(throttleTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateProgress());
  }

  private updateProgress(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    this.progress.set(value);
  }
}
