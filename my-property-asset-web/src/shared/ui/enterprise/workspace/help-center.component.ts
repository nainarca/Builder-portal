import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Help center layout shell — FAQ / docs / contact placeholders + content projection.
 */
@Component({
  selector: 'app-enterprise-help-center',
  template: `
    <div class="enterprise-help-center" [attr.aria-label]="ariaLabel()">
      @if (title() || description()) {
        <header class="enterprise-help-center__header">
          @if (title()) {
            <h1 class="enterprise-help-center__title">{{ title() }}</h1>
          }
          @if (description()) {
            <p class="enterprise-help-center__desc">{{ description() }}</p>
          }
        </header>
      }

      <div class="enterprise-help-center__body">
        <ng-content />
      </div>

      @if (showPlaceholders()) {
        <section class="enterprise-help-center__aside" aria-label="Help resources">
          <article class="enterprise-help-center__card">
            <h2>FAQ</h2>
            <p>{{ faqPlaceholder() }}</p>
          </article>
          <article class="enterprise-help-center__card">
            <h2>Documentation</h2>
            <p>{{ docsPlaceholder() }}</p>
            @if (docsHref()) {
              <a [href]="docsHref()" target="_blank" rel="noopener noreferrer">Open documentation</a>
            }
          </article>
          <article class="enterprise-help-center__card">
            <h2>Contact support</h2>
            <p>{{ supportPlaceholder() }}</p>
          </article>
        </section>
      }
    </div>
  `,
  styles: `
    .enterprise-help-center {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xl);
      width: 100%;
    }
    .enterprise-help-center__header {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-xs);
      max-width: 40rem;
    }
    .enterprise-help-center__title {
      margin: 0;
      font-size: var(--mpa-font-size-xl);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--mpa-color-text);
    }
    .enterprise-help-center__desc {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-help-center__aside {
      display: grid;
      gap: var(--mpa-spacing-md);
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    }
    .enterprise-help-center__card {
      padding: var(--mpa-spacing-md);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface);
    }
    .enterprise-help-center__card h2 {
      margin: 0 0 var(--mpa-spacing-xs);
      font-size: var(--mpa-font-size-sm);
      font-weight: var(--mpa-font-weight-semibold);
    }
    .enterprise-help-center__card p {
      margin: 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .enterprise-help-center__card a {
      display: inline-block;
      margin-top: var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseHelpCenterComponent {
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly ariaLabel = input('Help center');
  readonly showPlaceholders = input(true);
  readonly faqPlaceholder = input('Common questions will appear here.');
  readonly docsPlaceholder = input('Product documentation links will appear here.');
  readonly supportPlaceholder = input('Contact support options will appear here.');
  readonly docsHref = input<string | undefined>(undefined);
}
