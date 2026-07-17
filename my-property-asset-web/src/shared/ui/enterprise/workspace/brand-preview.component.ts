import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { EnterpriseBrandPreviewData } from './models/enterprise-workspace.models';

/**
 * Brand preview chrome — logo, theme swatches, display name (presentation).
 * Hosts keep live white-label preview logic; this is the shared surface.
 */
@Component({
  selector: 'app-enterprise-brand-preview',
  template: `
    <figure
      class="enterprise-brand-preview"
      [attr.aria-label]="ariaLabel()"
    >
      <div
        class="enterprise-brand-preview__canvas"
        [style.--brand-primary]="primaryColor() || null"
        [style.--brand-secondary]="secondaryColor() || null"
      >
        <div class="enterprise-brand-preview__mark">
          @if (logoUrl()) {
            <img [src]="logoUrl()!" [alt]="displayName() + ' logo'" />
          } @else {
            <span aria-hidden="true">{{ shortName() || initials() }}</span>
          }
        </div>
        <figcaption class="enterprise-brand-preview__caption">
          <strong>{{ displayName() }}</strong>
          @if (tagline()) {
            <span>{{ tagline() }}</span>
          }
        </figcaption>
        <div class="enterprise-brand-preview__swatches" aria-label="Brand colors">
          <span
            class="enterprise-brand-preview__swatch"
            [style.background]="primaryColor() || 'var(--mpa-color-primary)'"
            title="Primary"
          ></span>
          <span
            class="enterprise-brand-preview__swatch"
            [style.background]="secondaryColor() || 'var(--mpa-color-secondary, var(--mpa-color-surface-muted))'"
            title="Secondary"
          ></span>
        </div>
      </div>
      <div class="enterprise-brand-preview__slot">
        <ng-content />
      </div>
    </figure>
  `,
  styles: `
    .enterprise-brand-preview {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
    }
    .enterprise-brand-preview__canvas {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-lg);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background:
        linear-gradient(
          135deg,
          color-mix(in srgb, var(--brand-primary, var(--mpa-color-primary)) 12%, var(--mpa-color-surface)),
          var(--mpa-color-surface)
        );
    }
    .enterprise-brand-preview__mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      overflow: hidden;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--brand-primary, var(--mpa-color-primary));
    }
    .enterprise-brand-preview__mark img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .enterprise-brand-preview__caption {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .enterprise-brand-preview__caption strong {
      font-size: var(--mpa-font-size-md);
      color: var(--mpa-color-text);
    }
    .enterprise-brand-preview__caption span {
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-brand-preview__swatches {
      display: flex;
      gap: var(--mpa-spacing-xs);
    }
    .enterprise-brand-preview__swatch {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 999px;
      border: 1px solid var(--mpa-color-border);
    }
    .enterprise-brand-preview__slot:empty {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseBrandPreviewComponent {
  readonly displayName = input.required<string>();
  readonly shortName = input<string | undefined>(undefined);
  readonly logoUrl = input<string | null | undefined>(undefined);
  readonly primaryColor = input<string | undefined>(undefined);
  readonly secondaryColor = input<string | undefined>(undefined);
  readonly tagline = input<string | undefined>(undefined);
  readonly ariaLabel = input('Brand preview');

  initials(): string {
    return this.displayName()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('');
  }

  static fromData(data: EnterpriseBrandPreviewData): EnterpriseBrandPreviewData {
    return data;
  }
}
