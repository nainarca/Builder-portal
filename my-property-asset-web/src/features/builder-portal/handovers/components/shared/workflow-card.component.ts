import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-workflow-card',
  template: `
    <section class="workflow-card" [attr.aria-label]="title()">
      <h3 class="workflow-card__title">{{ title() }}</h3>
      <ng-content />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowCardComponent {
  readonly title = input('Handover workflow');
}
