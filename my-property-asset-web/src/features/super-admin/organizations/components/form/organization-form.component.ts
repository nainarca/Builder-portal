import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';

import {
  EnterpriseCheckboxInputComponent,
  EnterpriseEmailInputComponent,
  EnterpriseFormFieldComponent,
  EnterpriseFormLayoutComponent,
  EnterpriseFormSectionComponent,
  EnterpriseSelectInputComponent,
  EnterpriseTextareaInputComponent,
  EnterpriseTextInputComponent,
  FormActionsComponent,
  InformationAlertComponent,
} from '@shared/ui';

import { OrganizationAdminStatus, OrganizationFormModel } from '../../models/organization-admin.model';
import { OrganizationFormStateService } from '../../services/organization-form-state.service';
import { OrganizationType } from '@core/organization-context/models/organization.model';

const TYPE_OPTIONS = [
  { label: 'Builder', value: 'builder' },
  { label: 'Owner', value: 'owner' },
  { label: 'Partner', value: 'partner' },
  { label: 'Marketplace', value: 'marketplace' },
];

const STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Archived', value: 'archived' },
];

@Component({
  selector: 'app-org-form',
  imports: [
    EnterpriseFormLayoutComponent,
    EnterpriseFormSectionComponent,
    EnterpriseTextInputComponent,
    EnterpriseTextareaInputComponent,
    EnterpriseEmailInputComponent,
    EnterpriseSelectInputComponent,
    EnterpriseCheckboxInputComponent,
    EnterpriseFormFieldComponent,
    InformationAlertComponent,
    FormActionsComponent,
  ],
  providers: [OrganizationFormStateService],
  template: `
    @if (formState.model(); as model) {
      <app-enterprise-form-layout width="default">
        @if (formState.lastAutosavedAt()) {
          <app-information-alert message="Draft autosaved locally for this session." />
        }

        <app-enterprise-form-section kind="general" title="Identity" description="Core organization profile" [columns]="2">
          <app-enterprise-text-input
            label="Name"
            [value]="model.name"
            [required]="true"
            [error]="formState.errors()['name']"
            (valueChange)="formState.setField('name', $event)"
          />
          <app-enterprise-text-input
            label="Short name"
            [value]="model.shortName"
            (valueChange)="formState.setField('shortName', $event)"
          />
          <app-enterprise-text-input
            label="Slug"
            [value]="model.slug"
            hint="Used in URLs and workspace routing."
            [error]="formState.errors()['slug']"
            (valueChange)="formState.setField('slug', $event)"
          />
          <app-enterprise-select-input
            label="Type"
            [options]="typeOptions"
            [value]="model.type"
            (valueChange)="onTypeChange($event)"
          />
          <app-enterprise-select-input
            label="Status"
            [options]="statusOptions"
            [value]="model.status"
            (valueChange)="onStatusChange($event)"
          />
          <app-enterprise-textarea-input
            label="Description"
            [value]="model.description"
            [rows]="3"
            (valueChange)="formState.setField('description', $event)"
          />
        </app-enterprise-form-section>

        <app-enterprise-form-section kind="address" title="Contact & region" description="Primary contacts and commercial metadata" [columns]="2">
          <app-enterprise-text-input
            label="Contact name"
            [value]="model.contactName"
            (valueChange)="formState.setField('contactName', $event)"
          />
          <app-enterprise-email-input
            label="Contact email"
            [value]="model.contactEmail"
            [error]="formState.errors()['contactEmail']"
            (valueChange)="formState.setField('contactEmail', $event)"
          />
          <app-enterprise-text-input
            label="Region"
            [value]="model.region"
            (valueChange)="formState.setField('region', $event)"
          />
          <app-enterprise-text-input
            label="Plan"
            [value]="model.plan"
            (valueChange)="formState.setField('plan', $event)"
          />
        </app-enterprise-form-section>

        <app-enterprise-form-section kind="configuration" title="Settings" description="White-label and support access" [columns]="2">
          <app-enterprise-checkbox-input
            label="White-label enabled"
            [checked]="model.whiteLabelEnabled"
            (checkedChange)="formState.setField('whiteLabelEnabled', $event)"
          />
          <app-enterprise-checkbox-input
            label="Support access enabled"
            [checked]="model.supportAccessEnabled"
            (checkedChange)="formState.setField('supportAccessEnabled', $event)"
          />
          <app-enterprise-form-field label="Primary color" hint="Brand accent for organization avatar and theme preview.">
            <input
              type="color"
              class="org-form__color"
              [value]="model.primaryColor"
              aria-label="Primary brand color"
              (input)="onColorChange($event)"
            />
          </app-enterprise-form-field>
        </app-enterprise-form-section>

        <app-form-actions>
          <ng-content select="[formActions]" />
        </app-form-actions>
      </app-enterprise-form-layout>
    }
  `,
  styles: `
    .org-form__color {
      width: 3rem;
      height: 2.25rem;
      padding: 0;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface);
      cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(OrganizationFormStateService);

  readonly initialModel = input.required<OrganizationFormModel>();
  readonly submitLabel = input('Save organization');

  readonly submitted = output<OrganizationFormModel>();

  readonly typeOptions = TYPE_OPTIONS;
  readonly statusOptions = STATUS_OPTIONS;

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

  onColorChange(event: Event): void {
    this.formState.setField('primaryColor', (event.target as HTMLInputElement).value);
  }

  onTypeChange(value: string): void {
    this.formState.setField('type', value as OrganizationType);
  }

  onStatusChange(value: string): void {
    this.formState.setField('status', value as OrganizationAdminStatus);
  }
}
