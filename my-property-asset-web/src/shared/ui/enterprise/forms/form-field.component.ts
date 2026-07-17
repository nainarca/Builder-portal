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

      <div
        class="enterprise-form-field__control"
        [class.enterprise-form-field__control--affix]="!!prefix() || !!suffix()"
      >
        @if (prefix()) {
          <span class="enterprise-form-field__prefix" aria-hidden="true">{{ prefix() }}</span>
        }
        <div class="enterprise-form-field__input-slot">
          <ng-content />
        </div>
        @if (suffix()) {
          <span class="enterprise-form-field__suffix" aria-hidden="true">{{ suffix() }}</span>
        }
      </div>

      @if (maxLength() != null) {
        <p class="enterprise-form-field__counter" aria-live="polite">
          {{ characterCount() ?? 0 }} / {{ maxLength() }}
        </p>
      }

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
  readonly prefix = input<string | undefined>(undefined);
  readonly suffix = input<string | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly characterCount = input<number | undefined>(undefined);

  readonly hintId = computed(() => `enterprise-form-hint-${this.uid}`);
  readonly errorId = computed(() => `enterprise-form-error-${this.uid}`);
  readonly successId = computed(() => `enterprise-form-success-${this.uid}`);
}
