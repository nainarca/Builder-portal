import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { OfficeLocation } from '../../../models/company.model';

@Component({
  selector: 'app-office-card',
  templateUrl: './office-card.component.html',
  styleUrl: './office-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeCardComponent {
  readonly office = input.required<OfficeLocation>();
}
