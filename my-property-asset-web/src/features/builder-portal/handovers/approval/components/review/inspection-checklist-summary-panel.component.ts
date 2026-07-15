import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { InspectionStoreService } from '../../../inspection/services/inspection-store.service';

@Component({
  selector: 'app-inspection-checklist-summary-panel',
  imports: [RouterLink],
  template: `
    <div class="handover-info-panel">
      <h3 class="handover-info-panel__title">Inspection &amp; checklist summary</h3>
      @if (inspections().length === 0) {
        <p class="mpa-body-md m-0">No inspection categories have been set up for this handover yet.</p>
      } @else {
        <dl class="handover-info-panel__list">
          <div class="handover-info-panel__row"><dt>Categories completed</dt><dd>{{ completedCount() }}/{{ inspections().length }}</dd></div>
          <div class="handover-info-panel__row"><dt>Overall completion</dt><dd>{{ overallPercent() }}%</dd></div>
          <div class="handover-info-panel__row"><dt>Mandatory items pending</dt><dd>{{ mandatoryPending() }}</dd></div>
        </dl>
      }
      <a class="handover-grid__view-link" [routerLink]="['/builder-portal/handovers', handoverId(), 'inspection']">
        View inspection &amp; checklist
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InspectionChecklistSummaryPanelComponent {
  private readonly inspectionStore = inject(InspectionStoreService);

  readonly handoverId = input.required<string>();

  readonly inspections = computed(() => this.inspectionStore.getByHandoverId(this.handoverId()));

  readonly completedCount = computed(() => this.inspections().filter((i) => i.completionPercent === 100).length);

  readonly overallPercent = computed(() => {
    const inspections = this.inspections();
    return inspections.length
      ? Math.round(inspections.reduce((sum, i) => sum + i.completionPercent, 0) / inspections.length)
      : 0;
  });

  readonly mandatoryPending = computed(() =>
    this.inspections()
      .flatMap((i) => i.sections.flatMap((s) => s.items))
      .filter((item) => item.mandatory && item.status !== 'passed' && item.status !== 'not-applicable').length,
  );
}
