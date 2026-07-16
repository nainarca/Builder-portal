import { Injectable, computed, inject, signal } from '@angular/core';

import { CurrentOrganizationService } from '@core/organization-context';
import {
  BuilderCompanyProfile,
  BuilderStaffInvitation,
  CreateBuilderOrganizationInput,
  CreateBuilderOrganizationResult,
} from '../models/builder-organization.model';

/**
 * P7 Builder Organization vertical slice service.
 * Uses in-memory state mirroring Batch 2 API contracts; swaps to Supabase RPCs when applied.
 */
@Injectable({ providedIn: 'root' })
export class BuilderOrganizationService {
  private readonly currentOrganization = inject(CurrentOrganizationService);

  private readonly companiesSignal = signal<BuilderCompanyProfile[]>([
    {
      id: 'bc-demo-001',
      organizationId: 'org-builder-demo',
      legalName: 'Horizon Builders Ltd',
      tradingName: 'Horizon Builders',
      primaryContactName: 'Marcus Rivera',
      primaryContactEmail: 'marcus.rivera@horizonbuilders.com',
      primaryContactPhone: '+1 415 555 0100',
      region: 'West',
      planCode: 'Growth',
      status: 'active',
      whiteLabelEnabled: true,
    },
  ]);

  private readonly invitationsSignal = signal<BuilderStaffInvitation[]>([]);

  readonly companies = this.companiesSignal.asReadonly();
  readonly invitations = this.invitationsSignal.asReadonly();

  readonly activeCompany = computed(() => {
    const orgId = this.currentOrganization.organizationId();
    if (!orgId) {
      return this.companiesSignal()[0] ?? null;
    }
    return this.companiesSignal().find((c) => c.organizationId === orgId) ?? null;
  });

  getCompanyByOrganizationId(organizationId: string): BuilderCompanyProfile | undefined {
    return this.companiesSignal().find((c) => c.organizationId === organizationId);
  }

  listInvitations(organizationId?: string): readonly BuilderStaffInvitation[] {
    const items = this.invitationsSignal();
    return organizationId ? items.filter((i) => i.organizationId === organizationId) : items;
  }

  /** Super Admin: create builder org + company + optional owner invite (API contract). */
  createBuilderOrganization(
    input: CreateBuilderOrganizationInput,
  ): CreateBuilderOrganizationResult {
    const organizationId = `org-${crypto.randomUUID().slice(0, 8)}`;
    const builderCompanyId = `bc-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const company: BuilderCompanyProfile = {
      id: builderCompanyId,
      organizationId,
      legalName: input.legalName.trim(),
      tradingName: input.tradingName?.trim() || undefined,
      primaryContactName: input.primaryContactName.trim(),
      primaryContactEmail: input.primaryContactEmail.trim().toLowerCase(),
      primaryContactPhone: input.primaryContactPhone?.trim() || undefined,
      region: input.region?.trim() || undefined,
      planCode: input.planCode?.trim() || undefined,
      status: 'pending',
      whiteLabelEnabled: false,
    };

    this.companiesSignal.update((list) => [company, ...list]);

    let invitationId: string | undefined;
    let invitationToken: string | undefined;

    if (input.inviteOwner !== false) {
      invitationId = `inv-${crypto.randomUUID().slice(0, 8)}`;
      invitationToken = crypto.randomUUID().replace(/-/g, '');
      const invitation: BuilderStaffInvitation = {
        id: invitationId,
        organizationId,
        builderCompanyId,
        email: company.primaryContactEmail,
        invitedRole: 'builder_owner',
        token: invitationToken,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        resendCount: 0,
        lastSentAt: now,
      };
      this.invitationsSignal.update((list) => [invitation, ...list]);
    }

    return { organizationId, builderCompanyId, invitationId, invitationToken };
  }

  updateCompanyProfile(
    companyId: string,
    patch: Partial<
      Pick<
        BuilderCompanyProfile,
        | 'legalName'
        | 'tradingName'
        | 'primaryContactName'
        | 'primaryContactEmail'
        | 'primaryContactPhone'
        | 'region'
        | 'whiteLabelEnabled'
      >
    >,
  ): BuilderCompanyProfile | undefined {
    let updated: BuilderCompanyProfile | undefined;
    this.companiesSignal.update((list) =>
      list.map((c) => {
        if (c.id !== companyId) {
          return c;
        }
        updated = { ...c, ...patch };
        return updated;
      }),
    );
    return updated;
  }

  deactivateCompany(companyId: string): BuilderCompanyProfile | undefined {
    let updated: BuilderCompanyProfile | undefined;
    this.companiesSignal.update((list) =>
      list.map((c) => {
        if (c.id !== companyId) {
          return c;
        }
        updated = { ...c, status: 'suspended' };
        return updated;
      }),
    );
    return updated;
  }

  /** Super Admin: invite (or re-invite) Builder Owner for an existing company. */
  inviteBuilderOwner(
    organizationId: string,
    email?: string,
  ): { invitationId: string; token: string } | undefined {
    const company = this.getCompanyByOrganizationId(organizationId);
    if (!company) {
      return undefined;
    }

    const existing = this.listInvitations(organizationId).find(
      (i) =>
        i.invitedRole === 'builder_owner' &&
        (i.status === 'pending' || i.status === 'expired'),
    );
    if (existing) {
      const resent = this.resendInvitation(existing.id);
      return resent ? { invitationId: resent.id, token: resent.token } : undefined;
    }

    const invitationId = `inv-${crypto.randomUUID().slice(0, 8)}`;
    const token = crypto.randomUUID().replace(/-/g, '');
    const now = new Date().toISOString();
    const invitation: BuilderStaffInvitation = {
      id: invitationId,
      organizationId,
      builderCompanyId: company.id,
      email: (email ?? company.primaryContactEmail).trim().toLowerCase(),
      invitedRole: 'builder_owner',
      token,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      resendCount: 0,
      lastSentAt: now,
    };
    this.invitationsSignal.update((list) => [invitation, ...list]);
    return { invitationId, token };
  }

  resendInvitation(invitationId: string): BuilderStaffInvitation | undefined {
    let updated: BuilderStaffInvitation | undefined;
    this.invitationsSignal.update((list) =>
      list.map((inv) => {
        if (inv.id !== invitationId || inv.status === 'accepted') {
          return inv;
        }
        updated = {
          ...inv,
          token: crypto.randomUUID().replace(/-/g, ''),
          status: 'pending',
          resendCount: inv.resendCount + 1,
          lastSentAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        return updated;
      }),
    );
    return updated;
  }

  getInvitationByToken(token: string): BuilderStaffInvitation | undefined {
    return this.invitationsSignal().find((i) => i.token === token);
  }

  acceptInvitation(token: string): BuilderStaffInvitation | undefined {
    const invitation = this.getInvitationByToken(token);
    if (!invitation || invitation.status !== 'pending') {
      return undefined;
    }

    if (new Date(invitation.expiresAt).getTime() < Date.now()) {
      this.invitationsSignal.update((list) =>
        list.map((i) => (i.id === invitation.id ? { ...i, status: 'expired' } : i)),
      );
      return undefined;
    }

    let accepted: BuilderStaffInvitation | undefined;
    this.invitationsSignal.update((list) =>
      list.map((i) => {
        if (i.id !== invitation.id) {
          return i;
        }
        accepted = { ...i, status: 'accepted' };
        return accepted;
      }),
    );

    this.companiesSignal.update((list) =>
      list.map((c) =>
        c.id === invitation.builderCompanyId && c.status === 'pending'
          ? { ...c, status: 'active' }
          : c,
      ),
    );

    return accepted;
  }
}
