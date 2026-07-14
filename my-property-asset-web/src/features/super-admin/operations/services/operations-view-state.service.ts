import { Injectable, signal } from '@angular/core';

import { AuditCategory } from '../models/operations-admin.model';

@Injectable({ providedIn: 'root' })
export class OperationsViewStateService {
  readonly auditQuery = signal('');
  readonly auditCategory = signal<AuditCategory | 'all'>('all');
  readonly auditOutcome = signal<'all' | 'success' | 'failure' | 'denied'>('all');
  readonly alertFilter = signal<'all' | 'open' | 'acknowledged'>('open');
  readonly activityFilter = signal<'all' | 'login' | 'failed_login' | 'session' | 'security' | 'org' | 'builder'>(
    'all',
  );
  readonly selectedAuditId = signal<string | null>(null);

  setAuditQuery(value: string): void {
    this.auditQuery.set(value);
  }

  setAuditCategory(value: AuditCategory | 'all'): void {
    this.auditCategory.set(value);
  }

  setAuditOutcome(value: 'all' | 'success' | 'failure' | 'denied'): void {
    this.auditOutcome.set(value);
  }

  setAlertFilter(value: 'all' | 'open' | 'acknowledged'): void {
    this.alertFilter.set(value);
  }

  setActivityFilter(
    value: 'all' | 'login' | 'failed_login' | 'session' | 'security' | 'org' | 'builder',
  ): void {
    this.activityFilter.set(value);
  }

  selectAudit(id: string | null): void {
    this.selectedAuditId.set(id);
  }
}
