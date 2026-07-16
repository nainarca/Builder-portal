import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, UiToastService } from '@shared/ui';

import { OwnerActivationService } from '../services/owner-activation.service';
import { HandoverStoreService } from '../services/handover-store.service';

@Component({
  selector: 'app-handover-activation-page',
  imports: [BasePageComponent, ButtonComponent, RouterLink],
  template: `
    <app-base-page>
      @if (handover(); as h) {
        <div class="handover-page handover-page--detail">
          <header class="handover-header">
            <div class="handover-header__main">
              <div>
                <span class="mpa-eyebrow">{{ h.projectName }} · {{ h.unitNumber }}</span>
                <h1 class="ui-page-title">Owner activation</h1>
                <p class="ui-page-subtitle">Validate readiness and simulate Flutter-side property activation.</p>
              </div>
            </div>
            <div class="handover-header__actions">
              <a class="handover-grid__view-link" [routerLink]="['/builder-portal/handovers', h.id]">Back to handover</a>
            </div>
          </header>

          @if (readiness(); as r) {
            <div class="handover-overview__grid">
              <section class="handover-info-panel">
                <h3 class="handover-info-panel__title">Activation readiness</h3>
                <div class="handover-info-panel__row"><dt>Owner assigned</dt><dd>{{ yesNo(r.ownerAssigned) }}</dd></div>
                <div class="handover-info-panel__row"><dt>Checklist complete</dt><dd>{{ yesNo(r.checklistComplete) }}</dd></div>
                <div class="handover-info-panel__row"><dt>Invitation accepted</dt><dd>{{ yesNo(r.invitationAccepted) }}</dd></div>
                <div class="handover-info-panel__row"><dt>Activated</dt><dd>{{ yesNo(r.activated) }}</dd></div>
                <div class="handover-info-panel__actions mt-3">
                  <app-button
                    label="Activate owner"
                    icon="pi pi-mobile"
                    [disabled]="!r.ready"
                    (clicked)="activate(h.id)"
                  />
                </div>
              </section>

              <section class="handover-info-panel">
                <h3 class="handover-info-panel__title">Property link</h3>
                @if (propertyLink(); as link) {
                  <div class="handover-info-panel__row"><dt>Property ID</dt><dd>{{ link.propertyId }}</dd></div>
                  <div class="handover-info-panel__row"><dt>Activated</dt><dd>{{ link.activatedAt }}</dd></div>
                } @else {
                  <p class="mpa-body-sm m-0">No Flutter property link has been created yet.</p>
                }
              </section>
            </div>
          }
        </div>
      }
    </app-base-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverActivationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly handovers = inject(HandoverStoreService);
  private readonly activation = inject(OwnerActivationService);
  private readonly toast = inject(UiToastService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly handover = computed(() => this.handovers.getById(this.handoverId()));
  readonly readiness = computed(() => this.activation.getReadiness(this.handoverId()));
  readonly propertyLink = computed(() => this.activation.getPropertyLink(this.handoverId()));

  activate(handoverId: string): void {
    const link = this.activation.activate(handoverId);
    if (!link) {
      this.toast.warn('Activation blocked', 'Finish the checklist and accept the invitation first.');
      return;
    }
    this.toast.success('Owner activated', `Property ${link.propertyId} is now linked for the mobile app contract.`);
  }

  yesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
  }
}
