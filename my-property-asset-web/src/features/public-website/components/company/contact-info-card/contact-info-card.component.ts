import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ContactDepartment } from '../../../models/company.model';

@Component({
  selector: 'app-contact-info-card',
  templateUrl: './contact-info-card.component.html',
  styleUrl: './contact-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactInfoCardComponent {
  readonly department = input.required<ContactDepartment>();
}
