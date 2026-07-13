import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { StatusBadgeComponent } from '@shared/ui';

import { UserSecuritySummary } from '../../models/user-admin.model';

@Component({
  selector: 'app-iam-security-card',
  imports: [DatePipe, StatusBadgeComponent],
  template: `
    <section class="iam-security-card" aria-label="Security summary">
      <h2 class="iam-security-card__title">Security summary</h2>
      <dl class="iam-security-card__list">
        <div class="iam-security-card__row">
          <dt>MFA</dt>
          <dd><app-status-badge [label]="security().mfaEnabled ? 'Enabled' : 'Disabled'" [severity]="security().mfaEnabled ? 'success' : 'warn'" /></dd>
        </div>
        <div class="iam-security-card__row">
          <dt>Email verified</dt>
          <dd><app-status-badge [label]="security().emailVerified ? 'Verified' : 'Unverified'" [severity]="security().emailVerified ? 'success' : 'warn'" /></dd>
        </div>
        <div class="iam-security-card__row"><dt>Last login</dt><dd>{{ security().lastLoginAt ? (security().lastLoginAt | date: 'medium') : 'Never' }}</dd></div>
        <div class="iam-security-card__row"><dt>Active sessions</dt><dd>{{ security().activeSessions }} of {{ security().sessionCount }}</dd></div>
        <div class="iam-security-card__row"><dt>Failed logins (24h)</dt><dd>{{ security().failedLoginAttempts }}</dd></div>
      </dl>
      <div class="iam-security-card__alert">
        <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
        <span>Security alerts — integration placeholder for ADMIN-005</span>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IamSecurityCardComponent {
  readonly security = input.required<UserSecuritySummary>();
}
