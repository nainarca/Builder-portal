import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { BasePageComponent, ButtonComponent, UiToastService } from '@shared/ui';

import { TimelineCardComponent } from '../components/workflow';
import { HandoverInvitationService } from '../services/handover-invitation.service';
import { HandoverStoreService } from '../services/handover-store.service';

@Component({
  selector: 'app-handover-invitation-page',
  imports: [BasePageComponent, ButtonComponent, RouterLink, TimelineCardComponent],
  template: `
    <app-base-page>
      @if (handover(); as h) {
        <div class="handover-page handover-page--detail">
          <header class="handover-header">
            <div class="handover-header__main">
              <div>
                <span class="mpa-eyebrow">{{ h.projectName }} · {{ h.unitNumber }}</span>
                <h1 class="ui-page-title">Invitation</h1>
                <p class="ui-page-subtitle">Generate, resend, cancel, and track buyer activation invitations.</p>
              </div>
            </div>
            <div class="handover-header__actions">
              <a class="handover-grid__view-link" [routerLink]="['/builder-portal/handovers', h.id]">Back to handover</a>
            </div>
          </header>

          @if (summary(); as s) {
            <div class="handover-overview__grid">
              <section class="handover-info-panel">
                <h3 class="handover-info-panel__title">Invitation status</h3>
                <div class="handover-info-panel__row"><dt>Status</dt><dd>{{ label(s.status) }}</dd></div>
                <div class="handover-info-panel__row"><dt>Sent</dt><dd>{{ formatDate(s.sentAt) }}</dd></div>
                <div class="handover-info-panel__row"><dt>Expires</dt><dd>{{ formatDate(s.expiresAt) }}</dd></div>
                <div class="handover-info-panel__row"><dt>Resends</dt><dd>{{ s.resendCount }}</dd></div>
                <div class="handover-info-panel__actions mt-3">
                  <app-button label="Generate" icon="pi pi-envelope" [outlined]="true" (clicked)="generate(h.id)" />
                  <app-button label="Resend" icon="pi pi-refresh" [outlined]="true" (clicked)="resend(h.id)" />
                  <app-button label="Cancel" icon="pi pi-times" [outlined]="true" (clicked)="cancel(h.id)" />
                  <app-button label="Accept (mock)" icon="pi pi-check" (clicked)="accept(h.id)" />
                </div>
              </section>
              <section class="handover-info-panel">
                <h3 class="handover-info-panel__title">Invitation readiness</h3>
                <p class="mpa-body-sm m-0">
                  The invitation flow reuses the existing buyer assignment and records a full activity history for
                  resend, cancel, and acceptance transitions.
                </p>
              </section>
            </div>

            <app-timeline-card title="Invitation history" [items]="history()" />
          }
        </div>
      }
    </app-base-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandoverInvitationPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly handovers = inject(HandoverStoreService);
  private readonly invitations = inject(HandoverInvitationService);
  private readonly toast = inject(UiToastService);

  private readonly handoverId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly handover = computed(() => this.handovers.getById(this.handoverId()));
  readonly summary = computed(() => this.invitations.getSummary(this.handoverId()));
  readonly history = computed(() => this.invitations.getHistory(this.handoverId()));

  generate(handoverId: string): void {
    this.invitations.generate(handoverId);
    this.toast.success('Invitation generated', 'A secure activation invitation has been generated.');
  }

  resend(handoverId: string): void {
    this.invitations.resend(handoverId);
    this.toast.info('Invitation resent', 'The owner invitation token has been rotated and resent.');
  }

  cancel(handoverId: string): void {
    this.invitations.cancel(handoverId);
    this.toast.warn('Invitation cancelled', 'The current invitation is no longer valid.');
  }

  accept(handoverId: string): void {
    this.invitations.accept(handoverId);
    this.toast.success('Invitation accepted', 'The buyer has accepted the invitation in the mock activation flow.');
  }

  label(status: string): string {
    return status.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
  }

  formatDate(value?: string): string {
    return value ? new Date(value).toLocaleString() : '—';
  }
}
