export interface BuilderCompanyProfile {
  readonly id: string;
  readonly organizationId: string;
  readonly legalName: string;
  readonly tradingName?: string;
  readonly primaryContactName: string;
  readonly primaryContactEmail: string;
  readonly primaryContactPhone?: string;
  readonly region?: string;
  readonly planCode?: string;
  readonly status: 'pending' | 'active' | 'suspended' | 'archived';
  readonly whiteLabelEnabled: boolean;
}

export interface BuilderStaffInvitation {
  readonly id: string;
  readonly organizationId: string;
  readonly builderCompanyId?: string;
  readonly email: string;
  readonly invitedRole: 'builder_owner' | 'builder_admin' | 'builder_staff';
  readonly token: string;
  readonly status: 'pending' | 'accepted' | 'expired' | 'revoked';
  readonly expiresAt: string;
  readonly resendCount: number;
  readonly lastSentAt: string;
}

export interface CreateBuilderOrganizationInput {
  readonly legalName: string;
  readonly tradingName?: string;
  readonly primaryContactName: string;
  readonly primaryContactEmail: string;
  readonly primaryContactPhone?: string;
  readonly region?: string;
  readonly planCode?: string;
  readonly inviteOwner?: boolean;
}

export interface CreateBuilderOrganizationResult {
  readonly organizationId: string;
  readonly builderCompanyId: string;
  readonly invitationId?: string;
  readonly invitationToken?: string;
}
