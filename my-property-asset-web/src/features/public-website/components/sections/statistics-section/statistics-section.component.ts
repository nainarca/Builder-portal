import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';

import { RevealOnScrollDirective } from '../../../directives/reveal-on-scroll.directive';
import { PublicStatisticItem } from '../../../models/public-section.model';

@Component({
  selector: 'app-public-statistics-section',
  imports: [RevealOnScrollDirective],
  templateUrl: './statistics-section.component.html',
  styleUrl: './statistics-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicStatisticsSectionComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly sectionId = input.required<string>();
  readonly eyebrow = input('By the numbers');
  readonly title = input.required<string>();
  readonly statistics = input.required<readonly PublicStatisticItem[]>();

  readonly animatedValues = signal<Record<string, string>>({});

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.setFinalValues();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateValues();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  displayValue(stat: PublicStatisticItem): string {
    return this.animatedValues()[stat.id] ?? stat.value;
  }

  private setFinalValues(): void {
    const values: Record<string, string> = {};
    this.statistics().forEach((stat) => {
      values[stat.id] = stat.value;
    });
    this.animatedValues.set(values);
  }

  private animateValues(): void {
    this.statistics().forEach((stat) => {
      if (stat.numericValue === undefined) {
        this.animatedValues.update((current) => ({ ...current, [stat.id]: stat.value }));
        return;
      }

      const duration = 1200;
      const start = performance.now();
      const target = stat.numericValue;
      const prefix = stat.prefix ?? '';
      const suffix = stat.suffix ?? '';

      const tick = (now: number): void => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        const formatted =
          target % 1 !== 0 ? current.toFixed(1) : Math.round(current).toString();

        this.animatedValues.update((values) => ({
          ...values,
          [stat.id]: `${prefix}${formatted}${suffix}`,
        }));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    });
  }
}
