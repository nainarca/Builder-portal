import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';

import { CardComponent } from '../../composites/cards/card.component';
import {
  ENTERPRISE_FORM_SECTION_LABELS,
  EnterpriseFormSectionKind,
} from './models/enterprise-form.models';

/**
 * DS-04 Collapsible Form Section Card (P0.1 §5.3).
 */
@Component({
  selector: 'app-enterprise-form-section',
  imports: [CardComponent],
  template: `
    <app-card variant="default">
      <section class="enterprise-form-section" [attr.aria-labelledby]="headingId()">
        <header class="enterprise-form-section__header">
          <div class="enterprise-form-section__titles">
            <h3 class="enterprise-form-section__title" [id]="headingId()">{{ resolvedTitle() }}</h3>
            @if (description()) {
              <p class="enterprise-form-section__description">{{ description() }}</p>
            }
          </div>
          @if (collapsible()) {
            <button
              type="button"
              class="enterprise-form-section__toggle mpa-focus-visible"
              [attr.aria-expanded]="expanded()"
              [attr.aria-controls]="bodyId()"
              (click)="toggle()"
            >
              <i
                class="pi"
                [class.pi-chevron-down]="expanded()"
                [class.pi-chevron-right]="!expanded()"
                aria-hidden="true"
              ></i>
              <span class="enterprise-form-section__toggle-label">
                {{ expanded() ? 'Collapse' : 'Expand' }}
              </span>
            </button>
          }
        </header>

        @if (expanded()) {
          <div class="enterprise-form-section__body" [id]="bodyId()">
            <div
              class="enterprise-form-section__fields"
              [class.enterprise-form-section__fields--two-col]="columns() === 2"
            >
              <ng-content />
            </div>
          </div>
        }
      </section>
    </app-card>
  `,
  styleUrl: './styles/form-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseFormSectionComponent {
  private static nextId = 0;
  private readonly uid = ++EnterpriseFormSectionComponent.nextId;

  readonly kind = input<EnterpriseFormSectionKind>('custom');
  readonly title = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly collapsible = input(true);
  readonly initiallyExpanded = input(true);
  /** Desktop paired fields; collapses to 1 column under 768px via CSS. */
  readonly columns = input<1 | 2>(1);

  private readonly expandedSignal = signal(true);
  private syncedInitial = false;

  constructor() {
    effect(() => {
      const initial = this.initiallyExpanded();
      if (!this.syncedInitial) {
        this.expandedSignal.set(initial);
        this.syncedInitial = true;
      }
    });
  }

  readonly expanded = this.expandedSignal.asReadonly();
  readonly headingId = computed(() => `enterprise-form-section-title-${this.uid}`);
  readonly bodyId = computed(() => `enterprise-form-section-body-${this.uid}`);
  readonly resolvedTitle = computed(
    () => this.title() ?? ENTERPRISE_FORM_SECTION_LABELS[this.kind()],
  );

  toggle(): void {
    this.expandedSignal.update((value) => !value);
  }
}
