import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import { ButtonComponent, CheckboxComponent } from '@shared/ui';

@Component({
  selector: 'app-terms-acceptance-panel',
  imports: [DatePipe, CheckboxComponent, ButtonComponent],
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Terms &amp; conditions</h3>
      @if (alreadyAccepted()) {
        <p class="mpa-body-md m-0">
          <i class="pi pi-check-circle terms-acceptance__accepted-icon" aria-hidden="true"></i>
          Accepted{{ acceptedAt() ? ' on ' + (acceptedAt() | date: 'medium') : '' }}.
        </p>
      } @else {
        <p class="mpa-body-md">
          By accepting, the owner confirms they have reviewed the property, unit, document, and inspection summaries
          above and agree to proceed with the handover.
        </p>
        <app-checkbox
          [checked]="agreed()"
          label="I have reviewed the above and agree to the terms &amp; conditions"
          (checkedChange)="agreed.set($event)"
        />
        <div class="terms-acceptance__actions">
          <app-button label="Accept &amp; continue" icon="pi pi-check" [disabled]="!agreed()" (clicked)="accept.emit()" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsAcceptancePanelComponent {
  readonly alreadyAccepted = input.required<boolean>();
  readonly acceptedAt = input<string | undefined>(undefined);

  readonly accept = output<void>();

  readonly agreed = signal(false);
}
