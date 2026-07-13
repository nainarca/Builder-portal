import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';

import { FormActionsComponent, FormContainerComponent, FormSectionComponent, InputTextComponent, MessageComponent } from '@shared/ui';

import { BuilderFormModel } from '../../models/builder-admin.model';
import { BuilderFormStateService } from '../../services/builder-form-state.service';

@Component({
  selector: 'app-bldr-form',
  imports: [FormContainerComponent, FormSectionComponent, FormActionsComponent, InputTextComponent, MessageComponent],
  providers: [BuilderFormStateService],
  template: `
    @if (formState.model(); as model) {
      <app-form-container>
        @if (formState.lastAutosavedAt()) { <app-message severity="info" text="Draft autosaved" /> }

        <app-form-section title="Company" description="Builder company profile">
          <div class="bldr-form__field"><span class="bldr-form__label">Company name *</span>
            <app-input-text [value]="model.companyName" [invalid]="!!formState.errors()['companyName']" (valueChange)="formState.setField('companyName', $event)" />
            @if (formState.errors()['companyName']) { <small class="bldr-form__error">{{ formState.errors()['companyName'] }}</small> }
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Trading name</span>
            <app-input-text [value]="model.tradingName" (valueChange)="formState.setField('tradingName', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Registration number</span>
            <app-input-text [value]="model.registrationNumber" (valueChange)="formState.setField('registrationNumber', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Registered date</span>
            <app-input-text [value]="model.registeredAt" (valueChange)="formState.setField('registeredAt', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Status</span>
            <select [value]="model.status" (change)="onSelect('status', $event)">
              <option value="pending">Pending</option><option value="active">Active</option>
              <option value="inactive">Inactive</option><option value="archived">Archived</option>
            </select>
          </div>
        </app-form-section>

        <app-form-section title="Primary contact">
          <div class="bldr-form__field"><span class="bldr-form__label">Name *</span>
            <app-input-text [value]="model.primaryContactName" [invalid]="!!formState.errors()['primaryContactName']" (valueChange)="formState.setField('primaryContactName', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Email *</span>
            <app-input-text type="email" [value]="model.primaryContactEmail" [invalid]="!!formState.errors()['primaryContactEmail']" (valueChange)="formState.setField('primaryContactEmail', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Phone</span>
            <app-input-text [value]="model.primaryContactPhone" (valueChange)="formState.setField('primaryContactPhone', $event)" />
          </div>
        </app-form-section>

        <app-form-section title="Business address">
          <div class="bldr-form__field"><span class="bldr-form__label">Street</span>
            <app-input-text [value]="model.street" (valueChange)="formState.setField('street', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">City</span>
            <app-input-text [value]="model.city" (valueChange)="formState.setField('city', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">State</span>
            <app-input-text [value]="model.state" (valueChange)="formState.setField('state', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Postal code</span>
            <app-input-text [value]="model.postalCode" (valueChange)="formState.setField('postalCode', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Country</span>
            <app-input-text [value]="model.country" (valueChange)="formState.setField('country', $event)" />
          </div>
        </app-form-section>

        <app-form-section title="Organization & branding">
          <div class="bldr-form__field"><span class="bldr-form__label">Organization ID</span>
            <app-input-text [value]="model.organizationId" (valueChange)="formState.setField('organizationId', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Region</span>
            <app-input-text [value]="model.region" (valueChange)="formState.setField('region', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Plan</span>
            <app-input-text [value]="model.plan" (valueChange)="formState.setField('plan', $event)" />
          </div>
          <label class="bldr-form__field bldr-form__field--checkbox">
            <input type="checkbox" [checked]="model.whiteLabelEnabled" (change)="onCheck('whiteLabelEnabled', $event)" /> White-label enabled
          </label>
          <div class="bldr-form__field"><span class="bldr-form__label">Primary color</span>
            <input type="color" [value]="model.primaryColor" (input)="onColor('primaryColor', $event)" />
          </div>
          <div class="bldr-form__field"><span class="bldr-form__label">Secondary color</span>
            <input type="color" [value]="model.secondaryColor" (input)="onColor('secondaryColor', $event)" />
          </div>
        </app-form-section>

        <app-form-actions><ng-content select="[formActions]" /></app-form-actions>
      </app-form-container>
    }
  `,
  styles: `
    .bldr-form__label { font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
    .bldr-form__error { color: var(--mpa-color-danger); font-size: var(--mpa-font-size-xs); }
    .bldr-form__field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: var(--mpa-spacing-md); font-size: var(--mpa-font-size-sm); }
    .bldr-form__field select { padding: 0.55rem 0.75rem; border: 1px solid var(--mpa-color-border); border-radius: var(--mpa-radius-md); background: var(--mpa-color-surface); }
    .bldr-form__field--checkbox { flex-direction: row; align-items: center; gap: var(--mpa-spacing-sm); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(BuilderFormStateService);
  readonly initialModel = input.required<BuilderFormModel>();
  readonly submitted = output<BuilderFormModel>();

  ngOnInit(): void { this.formState.initialize(this.initialModel()); }
  ngOnDestroy(): void { this.formState.destroy(); }

  submit(): boolean {
    if (!this.formState.validate()) return false;
    const model = this.formState.model();
    if (model) { this.submitted.emit(model); this.formState.markPristine(); }
    return true;
  }

  onSelect(field: 'status', e: Event): void {
    this.formState.setField(field, (e.target as HTMLSelectElement).value as BuilderFormModel[typeof field]);
  }
  onCheck(field: 'whiteLabelEnabled', e: Event): void {
    this.formState.setField(field, (e.target as HTMLInputElement).checked);
  }
  onColor(field: 'primaryColor' | 'secondaryColor', e: Event): void {
    this.formState.setField(field, (e.target as HTMLInputElement).value);
  }
}
