import { Injectable, inject } from '@angular/core';

import { AuditCategory, PlatformAuditEvent } from '../models/platform.model';
import { PlatformAuditRepository } from '../repositories/platform.repository';

@Injectable({ providedIn: 'root' })
export class PlatformAuditService {
  private readonly repository = inject(PlatformAuditRepository);

  list(limit = 100): readonly PlatformAuditEvent[] {
    return this.repository.list(limit);
  }

  record(
    category: AuditCategory,
    action: string,
    summary: string,
    options?: {
      organizationId?: string;
      actorLabel?: string;
      entityType?: string;
      entityId?: string;
      detail?: Record<string, unknown>;
    },
  ): PlatformAuditEvent {
    return this.repository.append({
      category,
      action,
      summary,
      organizationId: options?.organizationId,
      actorLabel: options?.actorLabel ?? 'super-admin',
      entityType: options?.entityType,
      entityId: options?.entityId,
      detail: options?.detail,
    });
  }
}
