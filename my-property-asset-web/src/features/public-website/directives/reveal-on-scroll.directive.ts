import { Directive, ElementRef, inject, input, OnDestroy, OnInit, signal } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  host: {
    '[class.is-revealed]': 'revealed()',
    '[class.reveal-on-scroll]': 'true',
    '[style.--reveal-delay]': 'delay() + "ms"',
  },
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);

  readonly delay = input(0, { alias: 'appRevealOnScrollDelay' });
  readonly threshold = input(0.15, { alias: 'appRevealOnScrollThreshold' });

  readonly revealed = signal(false);

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealed.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.revealed.set(true);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: this.threshold(), rootMargin: '0px 0px -8% 0px' },
    );

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
