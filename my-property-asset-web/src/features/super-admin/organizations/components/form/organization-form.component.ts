import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';

import {
  FormActionsComponent,
  FormContainerComponent,
  FormSectionComponent,
  InputTextComponent,
  MessageComponent,
} from '@shared/ui';

import { OrganizationFormModel } from '../../models/organization-admin.model';
import { OrganizationFormStateService } from '../../services/organization-form-state.service';

@Component({
  selector: 'app-org-form',
  imports: [
    FormContainerComponent,
    FormSectionComponent,
    FormActionsComponent,
    InputTextComponent,
    MessageComponent,
  ],
  providers: [OrganizationFormStateService],
  template: `
    @if (formState.model(); as model) {
      <app-form-container>
        @if (formState.lastAutosavedAt()) {
          <app-message severity="info" text="Draft autosaved" />
        }

        <app-form-section title="Identity" description="Core organization profile">
          <div class="org-form__field">
            <span class="org-form__label">Name *</span>
            <app-input-text
              [value]="model.name"
              [invalid]="!!formState.errors()['name']"
              (valueChange)="formState.setField('name', $event)"
            />
            @if (formState.errors()['name']) {
              <small class="org-form__error">{{ formState.errors()['name'] }}</small>
            }
          </div>
          <div class="org-form__field">
            <span class="org-form__label">Short name</span>
            <app-input-text [value]="model.shortName" (valueChange)="formState.setField('shortName', $event)" />
          </div>
          <div class="org-form__field">
            <span class="org-form__label">Slug</span>
            <app-input-text
              [value]="model.slug"
              [invalid]="!!formState.errors()['slug']"
              (valueChange)="formState.setField('slug', $event)"
            />
            @if (formState.errors()['slug']) {
              <small class="org-form__error">{{ formState.errors()['slug'] }}</small>
            }
          </div>
          <div class="org-form__field">
            <span class="org-form__label">Type</span>
            <select [value]="model.type" (change)="onSelectChange('type', $event)">
              <option value="builder">Builder</option>
              <option value="owner">Owner</option>
              <option value="partner">Partner</option>
              <option value="marketplace">Marketplace</option>
            </select>
          </div>
          <div class="org-form__field">
            <span class="org-form__label">Status</span>
            <select [value]="model.status" (change)="onSelectChange('status', $event)">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div class="org-form__field org-form__field--full">
            <span class="org-form__label">Description</span>
            <textarea
              rows="3"
              [value]="model.description"
              (input)="onTextareaChange('description', $event)"
            ></textarea>
          </div>
        </app-form-section>

        <app-form-section title="Contact & region">
          <div class="org-form__field">
            <span class="org-form__label">Contact name</span>
            <app-input-text [value]="model.contactName" (valueChange)="formState.setField('contactName', $event)" />
          </div>
          <div class="org-form__field">
            <span class="org-form__label">Contact email</span>
            <app-input-text
              type="email"
              [value]="model.contactEmail"
              [invalid]="!!formState.errors()['contactEmail']"
              (valueChange)="formState.setField('contactEmail', $event)"
            />
            @if (formState.errors()['contactEmail']) {
              <small class="org-form__error">{{ formState.errors()['contactEmail'] }}</small>
            }
          </div>
          <div class="org-form__field">
            <span class="org-form__label">Region</span>
            <app-input-text [value]="model.region" (valueChange)="formState.setField('region', $event)" />
          </div>
          <div class="org-form__field">
            <span class="org-form__label">Plan</span>
            <app-input-text [value]="model.plan" (valueChange)="formState.setField('plan', $event)" />
          </div>
        </app-form-section>

        <app-form-section title="Settings">
          <label class="org-form__field org-form__field--checkbox">
            <input type="checkbox" [checked]="model.whiteLabelEnabled" (change)="onCheckboxChange('whiteLabelEnabled', $event)" />
            White-label enabled
          </label>
          <label class="org-form__field org-form__field--checkbox">
            <input type="checkbox" [checked]="model.supportAccessEnabled" (change)="onCheckboxChange('supportAccessEnabled', $event)" />
            Support access enabled
          </label>
          <div class="org-form__field">
            <span class="org-form__label">Primary color</span>
            <input type="color" [value]="model.primaryColor" (input)="onColorChange($event)" />
          </div>
        </app-form-section>

        <app-form-actions>
          <ng-content select="[formActions]" />
        </app-form-actions>
      </app-form-container>
    }
  `,
  styles: `
    .org-form__label {
      font-size: var(--mpa-font-size-sm);
      color: var(--mpa-color-text-muted);
    }
    .org-form__error {
      color: var(--mpa-color-danger);
      font-size: var(--mpa-font-size-xs);
    }
    .org-form__field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: var(--mpa-spacing-md);
    }
    .org-form__field--full { grid-column: 1 / -1; }
    .org-form__field--checkbox {
      flex-direction: row;
      align-items: center;
      gap: var(--mpa-spacing-sm);
    }
    .org-form__field textarea,
    .org-form__field select {
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-md);
      background: var(--mpa-color-surface);
      font-family: inherit;
      font-size: var(--mpa-font-size-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationFormComponent implements OnInit, OnDestroy {
  readonly formState = inject(OrganizationFormStateService);

  readonly initialModel = input.required<OrganizationFormModel>();
  readonly submitLabel = input('Save organization');

  readonly submitted = output<OrganizationFormModel>();

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

  onSelectChange(field: 'type' | 'status', event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.formState.setField(field, value as OrganizationFormModel[typeof field]);
  }

  onTextareaChange(field: 'description', event: Event): void {
    this.formState.setField(field, (event.target as HTMLTextAreaElement).value);
  }

  onCheckboxChange(field: 'whiteLabelEnabled' | 'supportAccessEnabled', event: Event): void {
    this.formState.setField(field, (event.target as HTMLInputElement).checked);
  }

  onColorChange(event: Event): void {
    this.formState.setField('primaryColor', (event.target as HTMLInputElement).value);
  }
}
