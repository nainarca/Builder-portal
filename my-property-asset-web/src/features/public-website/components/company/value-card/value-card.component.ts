import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CoreValueItem } from '../../../models/company.model';

@Component({
  selector: 'app-value-card',
  templateUrl: './value-card.component.html',
  styleUrl: './value-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueCardComponent {
  readonly value = input.required<CoreValueItem>();
}
