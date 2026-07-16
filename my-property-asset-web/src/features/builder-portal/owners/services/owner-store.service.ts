import { Injectable, inject, signal } from '@angular/core';

import { ProjectStoreService } from '../../projects/services/project-store.service';
import { Unit } from '../../projects/units/models/unit.model';
import { UnitStoreService } from '../../projects/units/services/unit-store.service';
import { MOCK_ASSIGNMENTS, MOCK_OWNERS } from '../config/owners.config';
import {
  AssignmentStatus,
  Owner,
  OwnerAssignment,
  OwnerFormModel,
  OwnerListItem,
  OwnerListQuery,
  OwnerListResult,
} from '../models/owner.model';

@Injectable({ providedIn: 'root' })
export class OwnerStoreService {
  private readonly unitStore = inject(UnitStoreService);
  private readonly projectStore = inject(ProjectStoreService);

  private readonly ownersSignal = signal<Owner[]>([...MOCK_OWNERS]);
  private readonly assignmentsSignal = signal<OwnerAssignment[]>([...MOCK_ASSIGNMENTS]);

  readonly owners = this.ownersSignal.asReadonly();
  readonly assignments = this.assignmentsSignal.asReadonly();

  getById(id: string): Owner | undefined {
    return this.ownersSignal().find((owner) => owner.id === id);
  }

  getActiveAssignment(ownerId: string): OwnerAssignment | undefined {
    return this.assignmentsSignal().find((a) => a.ownerId === ownerId && a.status === 'active');
  }

  getAssignmentsForOwner(ownerId: string): readonly OwnerAssignment[] {
    return this.assignmentsSignal()
      .filter((a) => a.ownerId === ownerId)
      .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
  }

  getAssignmentByUnitId(unitId: string): OwnerAssignment | undefined {
    return this.assignmentsSignal().find((a) => a.unitId === unitId && a.status === 'active');
  }

  getAvailableUnits(): readonly Unit[] {
    return this.unitStore.units().filter((unit) => !unit.archived && unit.status === 'available');
  }

  query(params: OwnerListQuery): OwnerListResult {
    let owners = this.ownersSignal();

    if (!params.includeArchived) {
      owners = owners.filter((owner) => !owner.archived);
    }

    if (params.search.trim()) {
      const term = params.search.trim().toLowerCase();
      owners = owners.filter(
        (owner) =>
          `${owner.firstName} ${owner.lastName}`.toLowerCase().includes(term) ||
          owner.email.toLowerCase().includes(term) ||
          owner.phone.toLowerCase().includes(term),
      );
    }

    if (params.activationFilter !== 'all') {
      owners = owners.filter((owner) => owner.activationStatus === params.activationFilter);
    }

    let items: OwnerListItem[] = owners.map((owner) => ({
      owner,
      assignment: this.getActiveAssignment(owner.id),
    }));

    if (params.invitationFilter !== 'all') {
      items = items.filter((item) => item.assignment?.invitation.status === params.invitationFilter);
    }

    if (params.projectFilter) {
      items = items.filter((item) => item.assignment?.projectId === params.projectFilter);
    }

    items = items.sort((a, b) => this.compare(a, b, params.sortField, params.sortDirection));

    const total = items.length;
    const start = (params.page - 1) * params.pageSize;
    const paged = items.slice(start, start + params.pageSize);

    return { items: paged, total, page: params.page, pageSize: params.pageSize };
  }

  create(model: OwnerFormModel): Owner {
    const now = new Date().toISOString();
    const record: Owner = {
      id: `owner-${crypto.randomUUID().slice(0, 8)}`,
      firstName: model.firstName.trim(),
      lastName: model.lastName.trim(),
      email: model.email.trim(),
      phone: model.phone.trim(),
      city: model.city.trim() || undefined,
      state: model.state.trim() || undefined,
      country: model.country.trim() || undefined,
      activationStatus: 'not-invited',
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    this.ownersSignal.update((owners) => [record, ...owners]);
    return record;
  }

  update(id: string, model: OwnerFormModel): Owner | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated: Owner = {
      ...existing,
      firstName: model.firstName.trim(),
      lastName: model.lastName.trim(),
      email: model.email.trim(),
      phone: model.phone.trim(),
      city: model.city.trim() || undefined,
      state: model.state.trim() || undefined,
      country: model.country.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    this.ownersSignal.update((owners) => owners.map((o) => (o.id === id ? updated : o)));
    return updated;
  }

  archive(id: string): Owner | undefined {
    return this.setArchived(id, true);
  }

  restore(id: string): Owner | undefined {
    return this.setArchived(id, false);
  }

  bulkArchive(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, true);
  }

  bulkRestore(ids: readonly string[]): number {
    return this.bulkSetArchived(ids, false);
  }

  toFormModel(owner: Owner): OwnerFormModel {
    return {
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phone: owner.phone,
      city: owner.city ?? '',
      state: owner.state ?? '',
      country: owner.country ?? '',
    };
  }

  emptyFormModel(): OwnerFormModel {
    return { firstName: '', lastName: '', email: '', phone: '', city: '', state: '', country: '' };
  }

  createAssignment(params: {
    owner: Owner;
    projectId: string;
    unitId: string;
    notes?: string;
  }): OwnerAssignment {
    const unit = this.unitStore.getById(params.unitId);
    const project = this.projectStore.getById(params.projectId);
    const now = new Date().toISOString();
    const assignment: OwnerAssignment = {
      id: `assign-${crypto.randomUUID().slice(0, 8)}`,
      ownerId: params.owner.id,
      ownerName: `${params.owner.firstName} ${params.owner.lastName}`,
      projectId: params.projectId,
      projectName: project?.name ?? params.projectId,
      unitId: params.unitId,
      unitNumber: unit?.unitNumber ?? '—',
      towerName: unit?.towerName ?? '—',
      status: 'active',
      assignedAt: now,
      assignedBy: 'Builder Admin',
      notes: params.notes,
      invitation: {
        id: `inv-${crypto.randomUUID().slice(0, 8)}`,
        status: 'pending',
        sentAt: now,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        resendCount: 0,
        remindersSent: 0,
      },
      activity: [
        {
          id: `a-${crypto.randomUUID().slice(0, 8)}`,
          title: `Assigned to unit ${unit?.unitNumber ?? params.unitId}`,
          description: 'Assigned by Builder Admin',
          timestamp: now,
          icon: 'pi pi-building',
          tone: 'primary',
        },
      ],
    };

    this.assignmentsSignal.update((assignments) => [assignment, ...assignments]);
    this.setActivationStatus(params.owner.id, 'invited');
    return assignment;
  }

  reassign(ownerId: string, projectId: string, unitId: string): OwnerAssignment | undefined {
    const owner = this.getById(ownerId);
    if (!owner) {
      return undefined;
    }
    const current = this.getActiveAssignment(ownerId);
    if (current) {
      this.setAssignmentStatus(current.id, 'reassigned');
    }
    return this.createAssignment({ owner, projectId, unitId });
  }

  removeAssignment(assignmentId: string): void {
    this.setAssignmentStatus(assignmentId, 'removed');
    const assignment = this.assignmentsSignal().find((a) => a.id === assignmentId);
    if (assignment) {
      this.setActivationStatus(assignment.ownerId, 'not-invited');
    }
  }

  resendInvitation(assignmentId: string): void {
    this.assignmentsSignal.update((assignments) =>
      assignments.map((a) => {
        if (a.id !== assignmentId) {
          return a;
        }
        const now = new Date().toISOString();
        return {
          ...a,
          invitation: {
            ...a.invitation,
            status: 'pending',
            sentAt: now,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            resendCount: a.invitation.resendCount + 1,
          },
          activity: [
            {
              id: `a-${crypto.randomUUID().slice(0, 8)}`,
              title: 'Invitation resent',
              description: `Resent to ${a.ownerName}`,
              timestamp: now,
              icon: 'pi pi-send',
              tone: 'info' as const,
            },
            ...a.activity,
          ],
        };
      }),
    );
  }

  generateInvitation(assignmentId: string): void {
    this.assignmentsSignal.update((assignments) =>
      assignments.map((a) => {
        if (a.id !== assignmentId) {
          return a;
        }
        const now = new Date().toISOString();
        return {
          ...a,
          invitation: {
            ...a.invitation,
            status: 'pending',
            sentAt: now,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            cancelledAt: undefined,
            acceptedAt: undefined,
          },
          activity: [
            {
              id: `a-${crypto.randomUUID().slice(0, 8)}`,
              title: 'Invitation generated',
              description: `Generated for ${a.ownerName}`,
              timestamp: now,
              icon: 'pi pi-envelope',
              tone: 'primary' as const,
            },
            ...a.activity,
          ],
        };
      }),
    );
  }

  sendReminder(assignmentId: string): void {
    this.assignmentsSignal.update((assignments) =>
      assignments.map((a) => {
        if (a.id !== assignmentId) {
          return a;
        }
        const now = new Date().toISOString();
        return {
          ...a,
          invitation: { ...a.invitation, remindersSent: a.invitation.remindersSent + 1 },
          activity: [
            {
              id: `a-${crypto.randomUUID().slice(0, 8)}`,
              title: 'Reminder sent',
              description: `Follow-up reminder sent to ${a.ownerName}`,
              timestamp: now,
              icon: 'pi pi-bell',
              tone: 'warning' as const,
            },
            ...a.activity,
          ],
        };
      }),
    );
  }

  cancelInvitation(assignmentId: string): void {
    this.assignmentsSignal.update((assignments) =>
      assignments.map((a) => {
        if (a.id !== assignmentId) {
          return a;
        }
        const now = new Date().toISOString();
        return {
          ...a,
          invitation: { ...a.invitation, status: 'cancelled', cancelledAt: now },
          activity: [
            {
              id: `a-${crypto.randomUUID().slice(0, 8)}`,
              title: 'Invitation cancelled',
              description: 'Cancelled by Builder Admin',
              timestamp: now,
              icon: 'pi pi-times-circle',
              tone: 'danger' as const,
            },
            ...a.activity,
          ],
        };
      }),
    );
  }

  acceptInvitation(assignmentId: string): void {
    this.assignmentsSignal.update((assignments) =>
      assignments.map((a) => {
        if (a.id !== assignmentId) {
          return a;
        }
        const now = new Date().toISOString();
        return {
          ...a,
          invitation: {
            ...a.invitation,
            status: 'accepted',
            acceptedAt: now,
          },
          activity: [
            {
              id: `a-${crypto.randomUUID().slice(0, 8)}`,
              title: 'Invitation accepted',
              description: `${a.ownerName} accepted the mobile activation invitation`,
              timestamp: now,
              icon: 'pi pi-check-circle',
              tone: 'success' as const,
            },
            ...a.activity,
          ],
        };
      }),
    );
  }

  markActivated(ownerId: string): void {
    this.setActivationStatus(ownerId, 'activated');
  }

  private setActivationStatus(ownerId: string, status: Owner['activationStatus']): void {
    this.ownersSignal.update((owners) =>
      owners.map((o) => (o.id === ownerId ? { ...o, activationStatus: status, updatedAt: new Date().toISOString() } : o)),
    );
  }

  private setAssignmentStatus(assignmentId: string, status: AssignmentStatus): void {
    this.assignmentsSignal.update((assignments) =>
      assignments.map((a) => (a.id === assignmentId ? { ...a, status } : a)),
    );
  }

  private setArchived(id: string, archived: boolean): Owner | undefined {
    const existing = this.getById(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, archived, updatedAt: new Date().toISOString() };
    this.ownersSignal.update((owners) => owners.map((o) => (o.id === id ? updated : o)));
    return updated;
  }

  private bulkSetArchived(ids: readonly string[], archived: boolean): number {
    let count = 0;
    this.ownersSignal.update((owners) =>
      owners.map((owner) => {
        if (!ids.includes(owner.id)) {
          return owner;
        }
        count += 1;
        return { ...owner, archived, updatedAt: new Date().toISOString() };
      }),
    );
    return count;
  }

  private compare(a: OwnerListItem, b: OwnerListItem, field: string, direction: 'asc' | 'desc'): number {
    const multiplier = direction === 'asc' ? 1 : -1;
    if (field === 'name') {
      const an = `${a.owner.firstName} ${a.owner.lastName}`;
      const bn = `${b.owner.firstName} ${b.owner.lastName}`;
      return an.localeCompare(bn) * multiplier;
    }
    const av = (a.owner as unknown as Record<string, unknown>)[field];
    const bv = (b.owner as unknown as Record<string, unknown>)[field];
    return String(av ?? '').localeCompare(String(bv ?? '')) * multiplier;
  }
}
