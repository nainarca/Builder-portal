import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectSummaryCounts } from '../../models/project.model';

@Component({
  selector: 'app-proj-summary-row',
  imports: [RouterLink],
  template: `
    <section class="proj-summary-row" aria-label="Related module summaries">
      @for (item of items(); track item.label) {
        @if (item.route) {
          <a class="proj-summary-widget proj-summary-widget--link" [routerLink]="item.route">
            <i class="proj-summary-widget__icon" [class]="item.icon" aria-hidden="true"></i>
            <div>
              <p class="proj-summary-widget__value">{{ item.value }}</p>
              <p class="proj-summary-widget__label">{{ item.label }}</p>
            </div>
          </a>
        } @else {
          <article class="proj-summary-widget">
            <i class="proj-summary-widget__icon" [class]="item.icon" aria-hidden="true"></i>
            <div>
              <p class="proj-summary-widget__value">{{ item.value }}</p>
              <p class="proj-summary-widget__label">{{ item.label }}</p>
            </div>
          </article>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSummaryRowComponent {
  readonly summary = input.required<ProjectSummaryCounts>();
  readonly projectId = input<string | undefined>(undefined);

  readonly items = computed(() => {
    const s = this.summary();
    const id = this.projectId();
    return [
      {
        label: 'Units',
        value: `${s.unitsSold}/${s.unitsTotal}`,
        icon: 'pi pi-building',
        route: id ? ['/builder-portal/projects', id, 'units'] : undefined,
      },
      { label: 'Owners', value: String(s.ownersCount), icon: 'pi pi-users' },
      { label: 'Documents', value: String(s.documentsCount), icon: 'pi pi-file' },
      { label: 'Pending handovers', value: String(s.pendingHandovers), icon: 'pi pi-key' },
      { label: 'Open snags', value: String(s.openSnags), icon: 'pi pi-exclamation-triangle' },
      { label: 'Upcoming appointments', value: String(s.upcomingAppointments), icon: 'pi pi-map-marker' },
    ];
  });
}
