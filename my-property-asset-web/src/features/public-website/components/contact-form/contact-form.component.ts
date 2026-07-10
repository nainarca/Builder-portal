import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonComponent, FormContainerComponent, InputTextComponent } from '@shared/ui';
import { ContactFormService } from '../../services/contact-form.service';

@Component({
  selector: 'app-public-contact-form',
  imports: [FormContainerComponent, InputTextComponent, ButtonComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicContactFormComponent {
  private readonly form = inject(ContactFormService);

  readonly state = this.form.state;

  updateField(field: 'name' | 'email' | 'company' | 'message', value: string): void {
    this.form.updateField(field, value);
  }

  async submit(): Promise<void> {
    await this.form.submit();
  }
}
