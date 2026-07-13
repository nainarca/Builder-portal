import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-cfg-preview-panel',
  template: `
    <section class="cfg-preview">
      <header class="cfg-preview__header">
        <div class="cfg-preview__heading">
          <h3 class="cfg-preview__title">{{ title() }}</h3>
          @if (description()) {
            <p class="cfg-preview__description">{{ description() }}</p>
          }
        </div>
        <span class="cfg-preview__tag" aria-hidden="true">
          <i class="pi pi-eye"></i> Preview
        </span>
      </header>
      <div class="cfg-preview__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .cfg-preview {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm, 0.75rem);
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-background, #f4f6f9);
      border: 1px dashed var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }
    .cfg-preview__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
    .cfg-preview__heading {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .cfg-preview__title {
      margin: 0;
      font-size: var(--mpa-font-size-md, 1rem);
      font-weight: 600;
      color: var(--mpa-color-text);
    }
    .cfg-preview__description {
      margin: 0;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
      line-height: 1.4;
    }
    .cfg-preview__tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      flex: none;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      border: 1px solid var(--mpa-color-border);
      background: var(--mpa-color-surface);
      color: var(--mpa-color-text-muted);
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .cfg-preview__body {
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md, 0.5rem);
      padding: var(--mpa-spacing-md, 1rem);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CfgPreviewPanelComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
