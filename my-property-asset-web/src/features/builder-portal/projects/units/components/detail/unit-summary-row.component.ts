import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UnitSummaryPlaceholders } from '../../models/unit.model';

@Component({
  selector: 'app-unit-summary-row',
  imports: [RouterLink],
  template: `
    <section class="unit-summary-row" aria-label="Related module summaries">
      @for (item of items(); track item.label) {
        @if (item.route) {
          <a class="unit-summary-widget unit-summary-widget--link" [routerLink]="item.route" [queryParams]="item.queryParams">
            <i class="unit-summary-widget__icon" [class]="item.icon" aria-hidden="true"></i>
            <div>
              <p class="unit-summary-widget__value">{{ item.value }}</p>
              <p class="unit-summary-widget__label">{{ item.label }}</p>
            </div>
          </a>
        } @else {
          <article class="unit-summary-widget">
            <i class="unit-summary-widget__icon" [class]="item.icon" aria-hidden="true"></i>
            <div>
              <p class="unit-summary-widget__value">{{ item.value }}</p>
              <p class="unit-summary-widget__label">{{ item.label }}</p>
            </div>
          </article>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitSummaryRowComponent {
  readonly summary = input.required<UnitSummaryPlaceholders>();
  readonly ownerName = input<string | undefined>(undefined);
  readonly ownerId = input<string | undefined>(undefined);
  readonly unitId = input<string | undefined>(undefined);

  readonly items = computed(() => {
    const s = this.summary();
    const name = this.ownerName();
    const id = this.ownerId();
    const unit = this.unitId();
    return [
      {
        label: 'Owner',
        value: name ?? (s.ownerAssigned ? 'Assigned' : 'Unassigned'),
        icon: 'pi pi-user',
        route: name && id ? ['/builder-portal/owners', id] : undefined,
      },
      {
        label: 'Documents',
        value: String(s.documentsCount),
        icon: 'pi pi-file',
        route: unit ? ['/builder-portal/documents'] : undefined,
        queryParams: unit ? { unitId: unit } : undefined,
      },
      { label: 'Handover', value: this.handoverLabel(s.handoverStatus), icon: 'pi pi-key' },
      { label: 'Open snags', value: String(s.openSnags), icon: 'pi pi-exclamation-triangle' },
      { label: 'Upcoming appointments', value: String(s.upcomingAppointments), icon: 'pi pi-map-marker' },
    ];
  });

  private handoverLabel(status: UnitSummaryPlaceholders['handoverStatus']): string {
    const map: Record<UnitSummaryPlaceholders['handoverStatus'], string> = {
      'not-started': 'Not started',
      'in-progress': 'In progress',
      completed: 'Completed',
    };
    return map[status];
  }
}
