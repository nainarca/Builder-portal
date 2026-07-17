import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ContentWrapperComponent } from '../../components/content-wrapper/content-wrapper.component';
import { PageContainerComponent } from '../../components/page-container/page-container.component';

/**
 * P0.1 §1.6 Content Area — the one region that changes per page.
 * Receives programmatic focus on route change for keyboard / SR wayfinding.
 */
@Component({
  selector: 'app-shell-content-area',
  imports: [ContentWrapperComponent, PageContainerComponent],
  templateUrl: './shell-content-area.component.html',
  styleUrl: './shell-content-area.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shell-content-area',
    id: 'mpa-main-content',
    role: 'main',
    tabindex: '-1',
  },
})
export class ShellContentAreaComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly scrollable = input(true);
  readonly fluid = input(false);

  constructor() {
    afterNextRender(() => {
      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          this.host.nativeElement.focus({ preventScroll: true });
        });
    });
  }
}
