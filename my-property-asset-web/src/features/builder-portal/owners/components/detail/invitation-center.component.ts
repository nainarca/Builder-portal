import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { ButtonComponent } from '@shared/ui';

import { Invitation, OwnerAssignment } from '../../models/owner.model';
import { InvitationBadgeComponent } from '../shared/invitation-badge.component';

@Component({
  selector: 'app-invitation-center',
  imports: [DatePipe, ButtonComponent, InvitationBadgeComponent],
  template: `
    <section class="invitation-center" aria-label="Invitation center">
      <div class="invitation-center__header">
        <h3 class="invitation-center__title">Invitation center</h3>
        <app-invitation-badge [status]="invitation().status" />
      </div>

      <div class="invitation-center__preview">
        <p class="invitation-center__preview-title">Invitation preview</p>
        <p class="invitation-center__preview-body">
          "Hi {{ ownerFirstName() }}, you've been assigned unit {{ assignment().unitNumber }} at
          {{ assignment().projectName }}. Accept your invitation to access owner services once available."
        </p>
      </div>

      <div class="invitation-center__meta">
        @if (invitation().sentAt) {
          <span>Sent: {{ invitation().sentAt | date: 'medium' }}</span>
        }
        @if (invitation().expiresAt) {
          <span>Expires: {{ invitation().expiresAt | date: 'medium' }}</span>
        }
        @if (invitation().acceptedAt) {
          <span>Accepted: {{ invitation().acceptedAt | date: 'medium' }}</span>
        }
        @if (invitation().cancelledAt) {
          <span>Cancelled: {{ invitation().cancelledAt | date: 'medium' }}</span>
        }
        <span>Resent {{ invitation().resendCount }}x</span>
        <span>Reminders sent: {{ invitation().remindersSent }}</span>
      </div>

      <div class="invitation-center__actions">
        <app-button
          label="Resend invitation"
          icon="pi pi-send"
          [outlined]="true"
          [disabled]="invitation().status === 'accepted'"
          (clicked)="resend.emit()"
        />
        <app-button
          label="Send reminder"
          icon="pi pi-bell"
          [outlined]="true"
          [disabled]="invitation().status !== 'pending'"
          (clicked)="reminder.emit()"
        />
        <app-button
          label="Cancel invitation"
          icon="pi pi-times-circle"
          severity="danger"
          [outlined]="true"
          [disabled]="invitation().status === 'accepted' || invitation().status === 'cancelled'"
          (clicked)="cancelInvitation.emit()"
        />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationCenterComponent {
  readonly assignment = input.required<OwnerAssignment>();

  readonly resend = output<void>();
  readonly reminder = output<void>();
  readonly cancelInvitation = output<void>();

  readonly invitation = computed<Invitation>(() => this.assignment().invitation);
  readonly ownerFirstName = computed(() => this.assignment().ownerName.split(' ')[0]);
}
