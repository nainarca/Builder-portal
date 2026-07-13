import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-wl-typography-viewer',
  template: `
    <div class="wl-typography-viewer" [style.font-family]="fontFamily()">
      <p class="wl-typography-viewer__heading" [style.font-weight]="headingWeight()">
        {{ headingSample() }}
      </p>
      <p class="wl-typography-viewer__body" [style.font-weight]="bodyWeight()">
        {{ bodySample() }}
      </p>
      <span class="wl-typography-viewer__family">{{ fontFamily() }}</span>
    </div>
  `,
  styles: `
    .wl-typography-viewer {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .wl-typography-viewer__heading {
      margin: 0;
      font-size: 1.5rem;
      line-height: 1.25;
      color: var(--mpa-color-text);
    }
    .wl-typography-viewer__body {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.9375rem);
      line-height: 1.5;
      color: var(--mpa-color-text-muted);
    }
    .wl-typography-viewer__family {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      color: var(--mpa-color-text-muted);
      border-top: 1px solid var(--mpa-color-border);
      padding-top: 0.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WlTypographyViewerComponent {
  readonly fontFamily = input.required<string>();
  readonly headingWeight = input<string>('600');
  readonly bodyWeight = input<string>('400');
  readonly headingSample = input<string>('The quick brown fox');
  readonly bodySample = input<string>(
    'Pack my box with five dozen liquor jugs. Typography sets the tone for every brand surface.',
  );
}
