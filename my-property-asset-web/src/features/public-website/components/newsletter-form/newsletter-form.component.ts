import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ButtonComponent, FormContainerComponent, InputTextComponent } from '@shared/ui';
import { NewsletterFormService } from '../../services/newsletter-form.service';

@Component({
  selector: 'app-public-newsletter-form',
  imports: [FormContainerComponent, InputTextComponent, ButtonComponent],
  templateUrl: './newsletter-form.component.html',
  styleUrl: './newsletter-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicNewsletterFormComponent {
  private readonly form = inject(NewsletterFormService);

  readonly state = this.form.state;

  updateEmail(email: string): void {
    this.form.updateEmail(email);
  }

  async submit(): Promise<void> {
    await this.form.submit();
  }
}
