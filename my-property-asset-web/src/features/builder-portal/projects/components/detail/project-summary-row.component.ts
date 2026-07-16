import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ProjectSummaryCounts } from '../../models/project.model';

/** P8: related-module counts are placeholders only (Units/Owners/Documents out of scope). */
@Component({
  selector: 'app-proj-summary-row',
  template: `
    <section class="proj-summary-row" aria-label="Project statistics">
      @for (item of items(); track item.label) {
        <article class="proj-summary-widget">
          <i class="proj-summary-widget__icon" [class]="item.icon" aria-hidden="true"></i>
          <div>
            <p class="proj-summary-widget__value">{{ item.value }}</p>
            <p class="proj-summary-widget__label">{{ item.label }}</p>
          </div>
        </article>
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
    return [
      { label: 'Inventory (future)', value: `${s.unitsSold}/${s.unitsTotal}`, icon: 'pi pi-building' },
      { label: 'Owners (future)', value: String(s.ownersCount), icon: 'pi pi-users' },
      { label: 'Documents (future)', value: String(s.documentsCount), icon: 'pi pi-file' },
      { label: 'Handovers (future)', value: String(s.pendingHandovers), icon: 'pi pi-key' },
    ];
  });
}
