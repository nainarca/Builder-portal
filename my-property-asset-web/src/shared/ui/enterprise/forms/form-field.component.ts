import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * DS-04 Form Field chrome — label, required, hint, error, success (P0.1 §5.4–5.6).
 */
@Component({
  selector: 'app-enterprise-form-field',
  template: `
    <div
      class="enterprise-form-field"
      [class.enterprise-form-field--invalid]="!!error()"
      [class.enterprise-form-field--success]="success() && !error()"
      [class.enterprise-form-field--disabled]="disabled()"
      [class.enterprise-form-field--readonly]="readonly()"
    >
      @if (label()) {
        <label class="enterprise-form-field__label" [attr.for]="controlId()">
          <span>{{ label() }}</span>
          @if (required()) {
            <span class="enterprise-form-field__required" aria-hidden="true">*</span>
            <span class="enterprise-form-field__sr">required</span>
          }
        </label>
      }

      <div class="enterprise-form-field__control">
        <ng-content />
      </div>

      @if (error()) {
        <p class="enterprise-form-field__error" [id]="errorId()" role="alert">{{ error() }}</p>
      } @else if (hint()) {
        <p class="enterprise-form-field__hint" [id]="hintId()">{{ hint() }}</p>
      } @else if (success()) {
        <p class="enterprise-form-field__success" [id]="successId()">
          <i class="pi pi-check" aria-hidden="true"></i>
          {{ successMessage() || 'Looks good' }}
        </p>
      }
    </div>
  `,
  styleUrl: './styles/form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormFieldComponent {
  private static nextId = 0;
  private readonly uid = ++EnterpriseFormFieldComponent.nextId;

  readonly label = input<string | undefined>(undefined);
  readonly controlId = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly hint = input<string | undefined>(undefined);
  readonly error = input<string | null | undefined>(undefined);
  readonly success = input(false);
  readonly successMessage = input<string | undefined>(undefined);
  readonly disabled = input(false);
  readonly readonly = input(false);

  readonly hintId = computed(() => `enterprise-form-hint-${this.uid}`);
  readonly errorId = computed(() => `enterprise-form-error-${this.uid}`);
  readonly successId = computed(() => `enterprise-form-success-${this.uid}`);
}
