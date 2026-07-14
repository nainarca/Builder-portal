import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { BillingAddressDraft } from '../../models/billing-admin.model';
import { BillingAdminStoreService } from '../../services/billing-admin-store.service';
import { BillingViewStateService } from '../../services/billing-view-state.service';

@Component({
  selector: 'app-bill-address-form',
  imports: [ButtonComponent],
  template: `
    <section class="bill-address-form" aria-label="Billing address">
      <header class="bill-address-form__header">
        <div>
          <h2 class="bill-address-form__title">Billing address</h2>
          <p class="bill-address-form__subtitle">
            Used on invoices and tax documents. Unsaved changes are blocked by navigation guard.
          </p>
        </div>
        @if (viewState.dirtyAddress()) {
          <span class="bill-address-form__dirty">Unsaved changes</span>
        }
      </header>

      <form class="bill-address-form__form" (submit)="$event.preventDefault(); save()">
        <label class="bill-address-form__field">
          <span class="bill-address-form__label">Address line</span>
          <input
            class="bill-address-form__input"
            type="text"
            [value]="draft().line1"
            (input)="patch('line1', $event)"
          />
        </label>

        <div class="bill-address-form__row">
          <label class="bill-address-form__field">
            <span class="bill-address-form__label">City</span>
            <input
              class="bill-address-form__input"
              type="text"
              [value]="draft().city"
              (input)="patch('city', $event)"
            />
          </label>
          <label class="bill-address-form__field">
            <span class="bill-address-form__label">Region</span>
            <input
              class="bill-address-form__input"
              type="text"
              [value]="draft().region"
              (input)="patch('region', $event)"
            />
          </label>
        </div>

        <div class="bill-address-form__row">
          <label class="bill-address-form__field">
            <span class="bill-address-form__label">Postal code</span>
            <input
              class="bill-address-form__input"
              type="text"
              [value]="draft().postalCode"
              (input)="patch('postalCode', $event)"
            />
          </label>
          <label class="bill-address-form__field">
            <span class="bill-address-form__label">Country</span>
            <input
              class="bill-address-form__input"
              type="text"
              [value]="draft().country"
              (input)="patch('country', $event)"
            />
          </label>
        </div>

        <label class="bill-address-form__field">
          <span class="bill-address-form__label">Tax ID</span>
          <input
            class="bill-address-form__input"
            type="text"
            [value]="draft().taxId"
            (input)="patch('taxId', $event)"
          />
        </label>

        <div class="bill-address-form__actions">
          <app-button
            label="Save address"
            icon="pi pi-save"
            type="submit"
            [disabled]="!viewState.dirtyAddress()"
          />
        </div>
      </form>
    </section>
  `,
  styles: `
    .bill-address-form {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-md, 1.25rem);
      padding: var(--mpa-spacing-md, 1.25rem);
      background: var(--mpa-color-surface);
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-lg, 0.75rem);
    }

    .bill-address-form__header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .bill-address-form__title {
      margin: 0 0 0.25rem;
      font-size: var(--mpa-font-size-lg, 1.125rem);
      font-weight: 700;
      color: var(--mpa-color-text);
    }

    .bill-address-form__subtitle {
      margin: 0;
      max-width: 36rem;
      font-size: var(--mpa-font-size-sm, 0.875rem);
      color: var(--mpa-color-text-muted);
    }

    .bill-address-form__dirty {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--mpa-color-warning) 18%, transparent);
      color: var(--mpa-color-warning);
    }

    .bill-address-form__form {
      display: flex;
      flex-direction: column;
      gap: var(--mpa-spacing-sm, 0.85rem);
    }

    .bill-address-form__row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
      gap: var(--mpa-spacing-sm, 0.85rem);
    }

    .bill-address-form__field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .bill-address-form__label {
      font-size: var(--mpa-font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--mpa-color-text-muted);
    }

    .bill-address-form__input {
      padding: 0.65rem 0.75rem;
      border: 1px solid var(--mpa-color-border);
      border-radius: var(--mpa-radius-sm, 0.375rem);
      background: var(--mpa-color-background, #f4f6f9);
      color: var(--mpa-color-text);
      font: inherit;
      font-size: var(--mpa-font-size-sm, 0.875rem);
    }

    .bill-address-form__input:focus {
      outline: none;
      border-color: var(--mpa-color-primary);
      box-shadow: 0 0 0 1px var(--mpa-color-primary);
    }

    .bill-address-form__actions {
      display: flex;
      justify-content: flex-start;
      padding-top: 0.35rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillAddressFormComponent {
  private readonly store = inject(BillingAdminStoreService);
  readonly viewState = inject(BillingViewStateService);

  readonly draft = signal<BillingAddressDraft>({ ...this.store.billingAddress() });

  patch(field: keyof BillingAddressDraft, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.draft.update((current) => ({ ...current, [field]: value }));
    this.viewState.markAddressDirty(true);
  }

  save(): void {
    this.store.updateBillingAddress(this.draft());
    this.viewState.markAddressDirty(false);
  }

  /** Ready for route `canDeactivate` wiring alongside `billingUnsavedChangesGuard`. */
  canDeactivate(): boolean {
    if (!this.viewState.dirtyAddress()) return true;
    return window.confirm('You have unsaved billing address changes. Leave without saving?');
  }
}
