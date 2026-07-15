import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';

import { FormActionsComponent, FormContainerComponent, FormSectionComponent, InputTextComponent } from '@shared/ui';

import { OwnerFormModel } from '../../models/owner.model';
import { OwnerFormStateService } from '../../services/owner-form-state.service';

@Component({
  selector: 'app-owner-profile-form',
  imports: [FormContainerComponent, FormSectionComponent, FormActionsComponent, InputTextComponent],
  templateUrl: './owner-profile-form.component.html',
  styleUrl: './owner-profile-form.component.scss',
  providers: [OwnerFormStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerProfileFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(OwnerFormStateService);

  readonly initialModel = input.required<OwnerFormModel>();

  readonly submitted = output<OwnerFormModel>();

  ngOnInit(): void {
    this.formState.initialize(this.initialModel());
  }

  ngOnDestroy(): void {
    this.formState.destroy();
  }

  submit(): boolean {
    if (!this.formState.validate()) {
      return false;
    }
    const model = this.formState.model();
    if (model) {
      this.submitted.emit(model);
      this.formState.markPristine();
    }
    return true;
  }

  onTextChange<K extends keyof OwnerFormModel>(field: K, value: string): void {
    this.formState.setField(field, value as OwnerFormModel[K]);
  }
}
