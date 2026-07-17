import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Settings section card — title, description, content projection. */
@Component({
  selector: 'app-enterprise-settings-section',
  template: `
    <section
      class="enterprise-settings-section"
      [attr.aria-labelledby]="headingId()"
    >
      <header class="enterprise-settings-section__header">
        <div class="enterprise-settings-section__titles">
          @if (icon()) {
            <i class="enterprise-settings-section__icon" [class]="icon()" aria-hidden="true"></i>
          }
          <div>
            <h2 class="enterprise-settings-section__title" [id]="headingId()">{{ title() }}</h2>
            @if (description()) {
              <p class="enterprise-settings-section__desc">{{ description() }}</p>
            }
          </div>
        </div>
        <div class="enterprise-settings-section__actions">
          <ng-content select="[sectionActions]" />
        </div>
      </header>
      <div class="enterprise-settings-section__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .enterprise-settings-section {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md);
      padding: var(--mpa-spacing-lg);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg);
      background: var(--mpa-color-surface);
    }
    .enterprise-settings-section__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--mpa-spacing-md);
      flex-wrap: wrap;
    }
    .enterprise-settings-section__titles {
      display: flex;
      align-items: flex-start;
      gap: var(--mpa-spacing-sm);
      min-width: 0;
    }
    .enterprise-settings-section__icon {
      margin-top: 0.15rem;
      color: var(--mpa-color-primary);
      font-size: 1.1rem;
    }
    .enterprise-settings-section__title {
      margin: 0;
      font-size: var(--mpa-font-size-md);
      font-weight: var(--mpa-font-weight-semibold);
      color: var(--mpa-color-text);
    }
    .enterprise-settings-section__desc {
      margin: 0.25rem 0 0;
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
      max-width: 42rem;
    }
    .enterprise-settings-section__actions:empty {
      display: none;
    }
    .enterprise-settings-section__body {
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseSettingsSectionComponent {
  readonly title = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly headingId = input('enterprise-settings-section-heading');
}
