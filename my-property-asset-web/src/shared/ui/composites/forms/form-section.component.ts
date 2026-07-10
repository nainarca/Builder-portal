import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let formSectionCounter = 0;

@Component({
  selector: 'app-form-section',
  template: `
    <section class="ui-form-section" [attr.aria-labelledby]="resolvedSectionId()">
      @if (title()) {
        <h3 class="mpa-heading-sm m-0" [id]="resolvedSectionId()">{{ title() }}</h3>
      }
      @if (description()) {
        <p class="mpa-body-md m-0">{{ description() }}</p>
      }
      <ng-content />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSectionComponent {
  private readonly generatedId = `form-section-${++formSectionCounter}`;

  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly sectionId = input<string | undefined>(undefined);

  resolvedSectionId(): string {
    return this.sectionId() ?? this.generatedId;
  }
}
