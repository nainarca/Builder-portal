import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Checkbox } from 'primeng/checkbox';
import { InputNumber } from 'primeng/inputnumber';
import { MultiSelect } from 'primeng/multiselect';
import { RadioButton } from 'primeng/radiobutton';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { DatePickerComponent } from '../../primitives/date-picker/date-picker.component';
import { InputTextComponent } from '../../primitives/input-text/input-text.component';
import { SelectComponent } from '../../primitives/select/select.component';
import { TextareaComponent } from '../../primitives/textarea/textarea.component';
import { EnterpriseFormFieldComponent } from './form-field.component';
import { EnterpriseSelectOption } from './models/enterprise-form.models';

@Component({
  selector: 'app-enterprise-text-input',
  imports: [EnterpriseFormFieldComponent, InputTextComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [controlId]="inputId()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <app-input-text
        [value]="value()"
        type="text"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [invalid]="!!error()"
        [inputId]="inputId()"
        [name]="name()"
        [ariaLabel]="ariaLabel() || label()"
        (valueChange)="valueChange.emit($event)"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTextInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly value = input('');
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string>();
}

@Component({
  selector: 'app-enterprise-textarea-input',
  imports: [EnterpriseFormFieldComponent, TextareaComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [controlId]="inputId()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
      [maxLength]="maxLength()"
      [characterCount]="characterCount() ?? value().length"
    >
      <app-textarea
        [value]="value()"
        [rows]="rows()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [invalid]="!!error()"
        [inputId]="inputId()"
        [name]="name()"
        [ariaLabel]="ariaLabel() || label()"
        (valueChange)="valueChange.emit($event)"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseTextareaInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly value = input('');
  readonly rows = input(4);
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly characterCount = input<number | undefined>(undefined);
  readonly valueChange = output<string>();
}

@Component({
  selector: 'app-enterprise-email-input',
  imports: [EnterpriseFormFieldComponent, InputTextComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [controlId]="inputId()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <app-input-text
        [value]="value()"
        type="email"
        [placeholder]="placeholder() || 'name@example.com'"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [invalid]="!!error()"
        [inputId]="inputId()"
        [name]="name()"
        autocomplete="email"
        [ariaLabel]="ariaLabel() || label() || 'Email'"
        (valueChange)="valueChange.emit($event)"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseEmailInputComponent {
  readonly label = input('Email');
  readonly value = input('');
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string>();
}

@Component({
  selector: 'app-enterprise-phone-input',
  imports: [EnterpriseFormFieldComponent, InputTextComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [controlId]="inputId()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <app-input-text
        [value]="value()"
        type="text"
        [placeholder]="placeholder() || '+1 555 000 0000'"
        [disabled]="disabled()"
        [readonly]="readonly()"
        [invalid]="!!error()"
        [inputId]="inputId()"
        [name]="name()"
        autocomplete="tel"
        [ariaLabel]="ariaLabel() || label() || 'Phone'"
        (valueChange)="valueChange.emit($event)"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterprisePhoneInputComponent {
  readonly label = input('Phone');
  readonly value = input('');
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string>();
}

@Component({
  selector: 'app-enterprise-currency-input',
  imports: [FormsModule, InputNumber, EnterpriseFormFieldComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <p-inputnumber
        mode="currency"
        [currency]="currency()"
        [locale]="locale()"
        [disabled]="disabled() || readonly()"
        [ngModel]="value()"
        (ngModelChange)="valueChange.emit($event)"
        [attr.aria-label]="ariaLabel() || label() || 'Amount'"
        [attr.aria-invalid]="error() ? 'true' : null"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseCurrencyInputComponent {
  readonly label = input('Amount');
  readonly value = input<number | null>(null);
  readonly currency = input('USD');
  readonly locale = input('en-US');
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<number | null>();
}

@Component({
  selector: 'app-enterprise-percentage-input',
  imports: [FormsModule, InputNumber, EnterpriseFormFieldComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <p-inputnumber
        suffix="%"
        [min]="0"
        [max]="100"
        [disabled]="disabled() || readonly()"
        [ngModel]="value()"
        (ngModelChange)="valueChange.emit($event)"
        [attr.aria-label]="ariaLabel() || label() || 'Percentage'"
        [attr.aria-invalid]="error() ? 'true' : null"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterprisePercentageInputComponent {
  readonly label = input('Percentage');
  readonly value = input<number | null>(null);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<number | null>();
}

@Component({
  selector: 'app-enterprise-date-input',
  imports: [EnterpriseFormFieldComponent, DatePickerComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <app-date-picker
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled() || readonly()"
        [ariaLabel]="ariaLabel() || label() || 'Date'"
        (valueChange)="valueChange.emit($event)"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDateInputComponent {
  readonly label = input('Date');
  readonly value = input<string | null>(null);
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string | null>();
}

@Component({
  selector: 'app-enterprise-date-range-input',
  imports: [EnterpriseFormFieldComponent, DatePickerComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <div class="enterprise-date-range">
        <app-date-picker
          [value]="start()"
          [placeholder]="startPlaceholder()"
          [disabled]="disabled() || readonly()"
          [ariaLabel]="(ariaLabel() || label() || 'Date range') + ' start'"
          (valueChange)="startChange.emit($event)"
        />
        <span class="enterprise-date-range__sep" aria-hidden="true">–</span>
        <app-date-picker
          [value]="end()"
          [placeholder]="endPlaceholder()"
          [disabled]="disabled() || readonly()"
          [ariaLabel]="(ariaLabel() || label() || 'Date range') + ' end'"
          (valueChange)="endChange.emit($event)"
        />
      </div>
    </app-enterprise-form-field>
  `,
  styles: `
    .enterprise-date-range {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: var(--mpa-spacing-sm);
      align-items: center;
    }
    .enterprise-date-range__sep { color: var(--mpa-color-text-muted); }
    @media (max-width: 639px) {
      .enterprise-date-range { grid-template-columns: 1fr; }
      .enterprise-date-range__sep { display: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseDateRangeInputComponent {
  readonly label = input('Date range');
  readonly start = input<string | null>(null);
  readonly end = input<string | null>(null);
  readonly startPlaceholder = input('Start');
  readonly endPlaceholder = input('End');
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly startChange = output<string | null>();
  readonly endChange = output<string | null>();
}

@Component({
  selector: 'app-enterprise-select-input',
  imports: [EnterpriseFormFieldComponent, SelectComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [success]="success()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <app-select
        [options]="options()"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled() || readonly()"
        [ariaLabel]="ariaLabel() || label()"
        (valueChange)="valueChange.emit($event)"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseSelectInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly options = input.required<readonly EnterpriseSelectOption[]>();
  readonly value = input<string | undefined>(undefined);
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string>();
}

@Component({
  selector: 'app-enterprise-autocomplete-input',
  imports: [FormsModule, AutoComplete, EnterpriseFormFieldComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <p-autocomplete
        [suggestions]="suggestions()"
        [disabled]="disabled() || readonly()"
        [placeholder]="placeholder()"
        [ngModel]="value()"
        (ngModelChange)="valueChange.emit($event)"
        (completeMethod)="search.emit($event.query)"
        [attr.aria-label]="ariaLabel() || label()"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseAutocompleteInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly value = input<string>('');
  readonly suggestions = input<string[]>([]);
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string>();
  readonly search = output<string>();
}

@Component({
  selector: 'app-enterprise-multi-select-input',
  imports: [FormsModule, MultiSelect, EnterpriseFormFieldComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <p-multiselect
        [options]="mutableOptions()"
        optionLabel="label"
        optionValue="value"
        [placeholder]="placeholder()"
        [disabled]="disabled() || readonly()"
        [ngModel]="value()"
        (ngModelChange)="valueChange.emit($event)"
        [attr.aria-label]="ariaLabel() || label()"
      />
    </app-enterprise-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseMultiSelectInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly options = input.required<readonly EnterpriseSelectOption[]>();
  readonly value = input<string[]>([]);
  readonly placeholder = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string[]>();

  readonly mutableOptions = computed(() => [...this.options()]);
}

@Component({
  selector: 'app-enterprise-toggle-input',
  imports: [FormsModule, ToggleSwitch, EnterpriseFormFieldComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [hint]="hint()"
      [error]="error()"
      [disabled]="disabled()"
      [readonly]="readonly()"
    >
      <div class="enterprise-toggle-row">
        <p-toggleswitch
          [disabled]="disabled() || readonly()"
          [ngModel]="checked()"
          (ngModelChange)="checkedChange.emit($event)"
          [attr.aria-label]="ariaLabel() || label()"
        />
        @if (description()) {
          <span class="enterprise-toggle-row__desc">{{ description() }}</span>
        }
      </div>
    </app-enterprise-form-field>
  `,
  styles: `
    .enterprise-toggle-row { display: flex; align-items: center; gap: var(--mpa-spacing-sm); }
    .enterprise-toggle-row__desc { font-size: var(--mpa-font-size-sm); color: var(--mpa-color-text-muted); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseToggleInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly checked = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly checkedChange = output<boolean>();
}

@Component({
  selector: 'app-enterprise-checkbox-input',
  imports: [FormsModule, Checkbox, EnterpriseFormFieldComponent],
  template: `
    <app-enterprise-form-field [hint]="hint()" [error]="error()" [disabled]="disabled()">
      <div class="enterprise-checkbox-row">
        <p-checkbox
          [binary]="true"
          [disabled]="disabled() || readonly()"
          [ngModel]="checked()"
          (ngModelChange)="checkedChange.emit($event)"
          [inputId]="inputId()"
          [ariaLabel]="ariaLabel() || label()"
        />
        @if (label()) {
          <label [attr.for]="inputId()">{{ label() }}</label>
        }
      </div>
    </app-enterprise-form-field>
  `,
  styles: `
    .enterprise-checkbox-row {
      display: flex; align-items: center; gap: var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseCheckboxInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly checked = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly inputId = input<string | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly checkedChange = output<boolean>();
}

@Component({
  selector: 'app-enterprise-radio-group',
  imports: [FormsModule, RadioButton, EnterpriseFormFieldComponent],
  template: `
    <app-enterprise-form-field
      [label]="label()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [disabled]="disabled()"
    >
      <div class="enterprise-radio-group" role="radiogroup" [attr.aria-label]="ariaLabel() || label()">
        @for (option of options(); track option.value) {
          <label class="enterprise-radio-group__item">
            <p-radiobutton
              [name]="name()"
              [value]="option.value"
              [disabled]="disabled() || readonly() || !!option.disabled"
              [ngModel]="value()"
              (ngModelChange)="valueChange.emit($event)"
            />
            <span>{{ option.label }}</span>
          </label>
        }
      </div>
    </app-enterprise-form-field>
  `,
  styles: `
    .enterprise-radio-group { display: flex; flex-direction: column; gap: var(--mpa-spacing-sm); }
    .enterprise-radio-group__item {
      display: inline-flex; align-items: center; gap: var(--mpa-spacing-sm);
      font-size: var(--mpa-font-size-sm); cursor: pointer;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseRadioGroupComponent {
  readonly label = input<string | undefined>(undefined);
  readonly options = input.required<readonly EnterpriseSelectOption[]>();
  readonly value = input<string | undefined>(undefined);
  readonly name = input('enterprise-radio');
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly valueChange = output<string>();
}
