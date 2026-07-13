import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-wl-brand-health-card',
  template: `
    <article class="wl-brand-health">
      <div
        class="wl-brand-health__ring"
        [style.background]="ringStyle()"
        role="img"
        [attr.aria-label]="score() + ' percent health'"
      >
        <span class="wl-brand-health__score">{{ score() }}%</span>
      </div>
      <div class="wl-brand-health__body">
        <span class="wl-brand-health__title">{{ title() }}</span>
        <span class="wl-brand-health__status" [style.color]="color()">{{ statusLabel() }}</span>
        <div class="wl-brand-health__bar" [attr.aria-hidden]="true">
          <span class="wl-brand-health__bar-fill" [style.width.%]="score()" [style.background]="color()"></span>
        </div>
      </div>
    </article>
  `,
  styles: `
    .wl-brand-health {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-brand-health__ring {
      position: relative;
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .wl-brand-health__ring::before {
      content: '';
      position: absolute;
      inset: 0.6rem;
      border-radius: 50%;
      background: var(--mpa-color-surface);
    }
    .wl-brand-health__score {
      position: relative;
      font-weight: 700;
      color: var(--mpa-color-text);
    }
    .wl-brand-health__body {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      flex: 1;
      min-width: 0;
    }
    .wl-brand-health__title { font-weight: 600; color: var(--mpa-color-text); }
    .wl-brand-health__status { font-size: var(--mpa-font-size-sm, 0.875rem); font-weight: 600; }
    .wl-brand-health__bar {
      height: 0.5rem;
      border-radius: 999px;
      background: var(--mpa-color-border);
      overflow: hidden;
    }
    .wl-brand-health__bar-fill { display: block; height: 100%; border-radius: 999px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlBrandHealthCardComponent {
  readonly score = input.required<number>();
  readonly title = input<string>('Brand health');

  readonly color = computed(() => {
    const value = this.score();
    if (value >= 85) return 'var(--mpa-color-success)';
    if (value >= 60) return 'var(--mpa-color-warning)';
    return 'var(--mpa-color-danger)';
  });

  readonly statusLabel = computed(() => {
    const value = this.score();
    if (value >= 85) return 'Healthy';
    if (value >= 60) return 'Needs attention';
    return 'At risk';
  });

  readonly ringStyle = computed(
    () => `conic-gradient(${this.color()} ${this.score() * 3.6}deg, var(--mpa-color-border) 0deg)`,
  );
}
