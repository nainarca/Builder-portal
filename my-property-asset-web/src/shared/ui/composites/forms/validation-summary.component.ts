import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ValidationIssue } from '../../models';

@Component({
  selector: 'app-validation-summary',
  template: `
    @if (issues().length) {
      <div class="ui-validation-summary" role="alert" aria-live="polite">
        <p class="ui-validation-summary__title">{{ title() }}</p>
        <ul class="ui-validation-summary__list">
          @for (issue of issues(); track issue.field + issue.message) {
            <li>{{ issue.message }}</li>
          }
        </ul>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationSummaryComponent {
  readonly title = input('Please correct the following:');
  readonly issues = input<ValidationIssue[]>([]);
}
