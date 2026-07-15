import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import { ButtonComponent, InputTextComponent } from '@shared/ui';

import { Signature, SignatureParty } from '../../models/approval.model';

const PARTY_LABELS: Record<SignatureParty, string> = { owner: 'Owner', builder: 'Builder', witness: 'Witness' };
const PARTY_ICONS: Record<SignatureParty, string> = { owner: 'pi pi-user', builder: 'pi pi-building', witness: 'pi pi-eye' };

@Component({
  selector: 'app-signature-card',
  imports: [DatePipe, ButtonComponent, InputTextComponent],
  template: `
    <div class="handover-info-panel signature-card" [class.signature-card--signed]="signature().status === 'signed'">
      <div class="signature-card__header">
        <span class="handover-icon"><i [class]="icon()" aria-hidden="true"></i></span>
        <div class="signature-card__title-group">
          <p class="signature-card__title">{{ label() }} signature</p>
          <span class="signature-card__flag">{{ mandatory() ? 'Mandatory' : 'Optional' }}</span>
        </div>
        <span class="signature-card__status" [class.signature-card__status--signed]="signature().status === 'signed'">
          {{ signature().status === 'signed' ? 'Signed' : 'Pending' }}
        </span>
      </div>

      @if (signature().status === 'signed') {
        <p class="mpa-body-md m-0">
          <i class="pi pi-check-circle signature-card__signed-icon" aria-hidden="true"></i>
          Signed by {{ signature().signedByName }} on {{ signature().signedAt | date: 'medium' }}
        </p>
      } @else if (defaultName(); as name) {
        <app-button [label]="'Sign as ' + name" icon="pi pi-pencil" (clicked)="sign.emit(name)" />
      } @else {
        <div class="signature-card__witness-form">
          <app-input-text [value]="witnessName()" placeholder="Witness name" ariaLabel="Witness name" (valueChange)="witnessName.set($event)" />
          <app-button label="Sign" icon="pi pi-pencil" [disabled]="!witnessName().trim()" (clicked)="sign.emit(witnessName().trim())" />
        </div>
      }

      <p class="signature-card__provider-note">
        <i class="pi pi-info-circle" aria-hidden="true"></i>
        Future signature provider integration point (e.g. DocuSign, Adobe Sign) — this is a mock signature for foundation purposes.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureCardComponent {
  readonly party = input.required<SignatureParty>();
  readonly signature = input.required<Signature>();
  readonly mandatory = input(true);
  readonly defaultName = input<string | undefined>(undefined);

  readonly sign = output<string>();

  readonly witnessName = signal('');

  readonly label = computed(() => PARTY_LABELS[this.party()]);
  readonly icon = computed(() => PARTY_ICONS[this.party()]);
}
