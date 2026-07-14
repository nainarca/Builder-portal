import { Injectable, computed, signal } from '@angular/core';

import {
  MOCK_ALERTS,
  MOCK_AUDIT_LOGS,
  MOCK_HEALTH_SCORE,
  MOCK_HEALTH_SERVICES,
  MOCK_INCIDENTS,
  MOCK_METRICS,
  MOCK_QUEUES,
  MOCK_TIMELINE,
  MOCK_USER_ACTIVITY,
} from '../config/operations.config';
import {
  AuditCategory,
  AuditLogRecord,
  OpsAlertRecord,
  OpsOverview,
} from '../models/operations-admin.model';

@Injectable({ providedIn: 'root' })
export class OperationsAdminStoreService {
  private readonly alertsSignal = signal<OpsAlertRecord[]>(MOCK_ALERTS.map((a) => ({ ...a })));
  private readonly auditSignal = signal<readonly AuditLogRecord[]>([...MOCK_AUDIT_LOGS]);

  readonly healthServices = signal([...MOCK_HEALTH_SERVICES]).asReadonly();
  readonly healthScore = signal(MOCK_HEALTH_SCORE).asReadonly();
  readonly auditLogs = this.auditSignal.asReadonly();
  readonly userActivity = signal([...MOCK_USER_ACTIVITY]).asReadonly();
  readonly metrics = signal([...MOCK_METRICS]).asReadonly();
  readonly queues = signal([...MOCK_QUEUES]).asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly incidents = signal([...MOCK_INCIDENTS]).asReadonly();
  readonly timeline = signal([...MOCK_TIMELINE]).asReadonly();

  readonly overview = computed<OpsOverview>(() => {
    const score = this.healthScore();
    const alerts = this.alertsSignal();
    const activity = this.userActivity();
    const metrics = this.metrics();
    const resp = metrics.find((m) => m.id === 'm-resp');
    const err = metrics.find((m) => m.id === 'm-err');
    return {
      healthScore: score.score,
      healthStatus: score.status,
      activeAlerts: alerts.filter((a) => !a.acknowledged).length,
      criticalAlerts: alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length,
      auditEventsToday: this.auditSignal().filter((a) => a.timestamp.startsWith('2026-07-14')).length,
      failedLoginsToday: activity.filter(
        (a) => a.type === 'failed_login' && a.timestamp.startsWith('2026-07-14'),
      ).length,
      avgResponseMs: resp?.value ?? 0,
      errorRatePercent: err?.value ?? 0,
    };
  });

  readonly unacknowledgedAlerts = computed(() =>
    this.alertsSignal().filter((a) => !a.acknowledged),
  );

  getAuditById(id: string): AuditLogRecord | undefined {
    return this.auditSignal().find((a) => a.id === id);
  }

  filterAudit(params: {
    query?: string;
    category?: AuditCategory | 'all';
    outcome?: 'all' | 'success' | 'failure' | 'denied';
  }): AuditLogRecord[] {
    const q = (params.query ?? '').trim().toLowerCase();
    const category = params.category ?? 'all';
    const outcome = params.outcome ?? 'all';
    return this.auditSignal().filter((row) => {
      if (category !== 'all' && row.category !== category) return false;
      if (outcome !== 'all' && row.outcome !== outcome) return false;
      if (!q) return true;
      return (
        row.actorName.toLowerCase().includes(q) ||
        row.actorEmail.toLowerCase().includes(q) ||
        row.action.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q) ||
        row.resource.toLowerCase().includes(q) ||
        (row.organizationName?.toLowerCase().includes(q) ?? false)
      );
    });
  }

  acknowledgeAlert(id: string): void {
    this.alertsSignal.update((list) =>
      list.map((a) =>
        a.id === id
          ? { ...a, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : a,
      ),
    );
  }
}
