import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-content-section',
  template: `<section class="ui-content-section" [attr.aria-label]="ariaLabel()"><ng-content /></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSectionComponent {
  readonly ariaLabel = input<string | undefined>(undefined);
}
