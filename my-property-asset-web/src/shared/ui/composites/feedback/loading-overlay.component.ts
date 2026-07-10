import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SpinnerComponent } from '../../primitives/spinner/spinner.component';

@Component({
  selector: 'app-loading-overlay',
  imports: [SpinnerComponent],
  template: `
  @if (visible()) {
    <div class="ui-loading-overlay" role="status" aria-live="polite" [attr.aria-label]="label()">
      <app-spinner [overlay]="true" [ariaLabel]="label()" />
    </div>
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-loading-overlay-host',
    '[style.position]': "'relative'",
    '[style.display]': "'block'",
  },
})
export class LoadingOverlayComponent {
  readonly visible = input(true);
  readonly label = input('Loading');
}
