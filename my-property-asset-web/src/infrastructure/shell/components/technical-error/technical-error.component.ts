import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-technical-error',
  template: `
    <details class="platform-technical-error">
      <summary>{{ summary() }}</summary>
      <pre class="platform-technical-error__detail">{{ detail() }}</pre>
    </details>
  `,
  styles: `
    .platform-technical-error {
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface-muted);
      font-size: var(--mpa-font-size-sm);
    }

    .platform-technical-error__detail {
      margin: var(--mpa-spacing-sm) 0 0;
      overflow: auto;
      white-space: pre-wrap;
      color: var(--mpa-color-text-muted);
      font-family: var(--mpa-font-family-mono);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicalErrorComponent {
  readonly summary = input('Technical details');
  readonly detail = input('');
}
