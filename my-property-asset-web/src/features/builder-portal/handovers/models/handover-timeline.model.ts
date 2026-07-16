import { HandoverActivityItem } from './handover.model';

export interface PropertyActivationLink {
  readonly handoverId: string;
  readonly unitId: string;
  readonly ownerId: string;
  readonly propertyId: string;
  readonly activatedAt: string;
}

export interface HandoverAuditSummary {
  readonly items: readonly HandoverActivityItem[];
  readonly propertyLink?: PropertyActivationLink;
}
