import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-cfg-settings-group',
  template: `
    <section class="cfg-group">
      <header class="cfg-group__header">
        <h3 class="cfg-group__title">{{ title() }}</h3>
        @if (description()) {
          <p class="cfg-group__description">{{ description() }}</p>
        }
      </header>
      <div class="cfg-group__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .cfg-group {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm, 0.75rem);
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
    }
    .cfg-group__header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .cfg-group__title {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-group__description {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.4;
    }
    .cfg-group__body {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm, 0.75rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgSettingsGroupComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
