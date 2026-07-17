import { BuilderPortalPageComponent } from '../../components/layout';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { EmptyNoDataComponent } from '@shared/ui';

import { TimelineCardComponent } from '../components/workflow';
import { HandoverStoreService } from '../services/handover-store.service';
import { HandoverTimelineService } from '../services/handover-timeline.service';

@Component({
  selector: 'app-handover-audit-page',
  imports: [ BuilderPortalPageComponent, EmptyNoDataComponent, RouterLink, TimelineCardComponent],
  template: `
    <app-bp-page>
      @if (handover(); as h) {
        <div class="handover-page handover-page--detail">
          <header class="handover-header">
            <div class="handover-header__main">
              <div>
                <span class="mpa-eyebrow">{{ h.projectName }} · {{ h.unitNumber }}</span>
                <h1 class="ui-page-title">Audit history</h1>
                <p class="ui-page-subtitle">Merged audit timeline across handover, documents, approval, and activation.</p>
              </div>
            </div>
            <div class="handover-header__actions">
              <a class="handover-grid__view-link" [routerLink]="['/builder-portal/handovers', h.id]">Back to handover</a>
            </div>
          </header>

          @if (audit(); as summary) {
            @if (summary.propertyLink) {
              <section class="handover-info-panel mb-4">
                <h3 class="handover-info-panel__title">Active property link</h3>
                <div class="handover-info-panel__row"><dt>Property ID</dt><dd>{{ summary.propertyLink.propertyId }}</dd></div>
                <div class="handover-info-panel__row"><dt>Activated at</dt><dd>{{ summary.propertyLink.activatedAt }}</dd></div>
              </section>
            }
            <app-timeline-card title="Audit timeline" [items]="summary.items" />
          }
        </div>
      } @else {
        <app-empty-no-data
          title="Handover not found"
          description="The requested handover does not exist."
        />
      }
    </app-bp-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush })
export class HandoverAuditPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly handovers = inject(HandoverStoreService);
  private readonly timeline = inject(HandoverTimelineService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '' });

  readonly handover = computed(() => this.handovers.getById(this.handoverId()));
  readonly audit = computed(() => this.timeline.getAuditSummary(this.handoverId()));
}
