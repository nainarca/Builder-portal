import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { HandoverReadiness, ReadinessTriState } from '../../models/inspection.model';

@Component({
  selector: 'app-readiness-card',
  template: `
    <div class="handover-info-panel readiness-card">
      <h3 class="handover-info-panel__title">Handover readiness</h3>

      <div class="readiness-card__banner" [class]="'readiness-card__banner--' + readiness().goNoGo">
        <i [class]="bannerIcon()" aria-hidden="true"></i>
        <span>{{ bannerLabel() }}</span>
      </div>

      <dl class="handover-info-panel__list">
        <div class="handover-info-panel__row">
          <dt>Documents ready</dt>
          <dd><i [class]="boolIcon(readiness().documentsReady)" aria-hidden="true"></i></dd>
        </div>
        <div class="handover-info-panel__row">
          <dt>Owner assigned</dt>
          <dd><i [class]="boolIcon(readiness().ownerAssigned)" aria-hidden="true"></i></dd>
        </div>
        <div class="handover-info-panel__row">
          <dt>Checklist status</dt>
          <dd>{{ triLabel(readiness().checklistStatus) }}</dd>
        </div>
        <div class="handover-info-panel__row">
          <dt>Inspection status</dt>
          <dd>{{ triLabel(readiness().inspectionStatus) }}</dd>
        </div>
        <div class="handover-info-panel__row">
          <dt>Overall readiness</dt>
          <dd>{{ overallLabel() }}</dd>
        </div>
      </dl>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadinessCardComponent {
  readonly readiness = input.required<HandoverReadiness>();

  readonly bannerLabel = computed(() => {
    const map: Record<HandoverReadiness['goNoGo'], string> = {
      go: 'Ready for handover',
      'no-go': 'Not ready — blocked',
      pending: 'Readiness pending',
    };
    return map[this.readiness().goNoGo];
  });

  readonly bannerIcon = computed(() => {
    const map: Record<HandoverReadiness['goNoGo'], string> = {
      go: 'pi pi-check-circle',
      'no-go': 'pi pi-ban',
      pending: 'pi pi-hourglass',
    };
    return map[this.readiness().goNoGo];
  });

  readonly overallLabel = computed(() => {
    const map: Record<HandoverReadiness['overallReadiness'], string> = {
      ready: 'Ready',
      'partially-ready': 'Partially ready',
      'not-ready': 'Not ready',
    };
    return map[this.readiness().overallReadiness];
  });

  boolIcon(value: boolean): string {
    return value ? 'pi pi-check-circle readiness-card__icon--yes' : 'pi pi-times-circle readiness-card__icon--no';
  }

  triLabel(value: ReadinessTriState | 'blocked'): string {
    const map: Record<ReadinessTriState | 'blocked', string> = {
      'not-started': 'Not started',
      'in-progress': 'In progress',
      complete: 'Complete',
      blocked: 'Blocked',
    };
    return map[value];
  }
}
