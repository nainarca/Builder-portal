export type InvitationStatus = 'not-sent' | 'pending' | 'accepted' | 'expired' | 'cancelled';
export type AssignmentStatus = 'active' | 'reassigned' | 'removed';
export type OwnerActivationStatus = 'not-invited' | 'invited' | 'activated';
export type OwnerActivityTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface Owner {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
  readonly city?: string;
  readonly state?: string;
  readonly country?: string;
  readonly activationStatus: OwnerActivationStatus;
  readonly archived: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OwnerFormModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
}

export interface Invitation {
  readonly id: string;
  readonly status: InvitationStatus;
  readonly sentAt?: string;
  readonly expiresAt?: string;
  readonly acceptedAt?: string;
  readonly cancelledAt?: string;
  readonly resendCount: number;
  readonly remindersSent: number;
}

export interface OwnerActivityItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly icon: string;
  readonly tone?: OwnerActivityTone;
}

export interface OwnerAssignment {
  readonly id: string;
  readonly ownerId: string;
  readonly ownerName: string;
  readonly projectId: string;
  readonly projectName: string;
  readonly unitId: string;
  readonly unitNumber: string;
  readonly towerName: string;
  readonly status: AssignmentStatus;
  readonly assignedAt: string;
  readonly assignedBy: string;
  readonly notes?: string;
  readonly invitation: Invitation;
  readonly activity: readonly OwnerActivityItem[];
}

export interface OwnerListItem {
  readonly owner: Owner;
  readonly assignment?: OwnerAssignment;
}

export interface OwnerAssignmentFormModel {
  ownerMode: 'existing' | 'new';
  existingOwnerId: string;
  newOwner: OwnerFormModel;
  projectId: string;
  unitId: string;
  notes: string;
}

export interface OwnerTableColumn {
  readonly id: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly defaultVisible: boolean;
}

export interface OwnerSavedView {
  readonly id: string;
  readonly name: string;
  readonly activationFilter: OwnerActivationStatus | 'all';
  readonly invitationFilter: InvitationStatus | 'all';
  readonly isDefault?: boolean;
}

export interface OwnerListQuery {
  readonly search: string;
  readonly activationFilter: OwnerActivationStatus | 'all';
  readonly invitationFilter: InvitationStatus | 'all';
  readonly projectFilter: string;
  readonly includeArchived: boolean;
  readonly sortField: string;
  readonly sortDirection: 'asc' | 'desc';
  readonly page: number;
  readonly pageSize: number;
}

export interface OwnerListResult {
  readonly items: readonly OwnerListItem[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export type OwnerBulkAction = 'archive' | 'restore' | 'export';
