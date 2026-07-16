import { TestBed } from '@angular/core/testing';

import { CurrentOrganizationService } from '@core/organization-context';
import { BuilderOrganizationService } from './builder-organization.service';

describe('BuilderOrganizationService (P7)', () => {
  let service: BuilderOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BuilderOrganizationService,
        {
          provide: CurrentOrganizationService,
          useValue: {
            organizationId: () => 'org-builder-demo',
          },
        },
      ],
    });
    service = TestBed.inject(BuilderOrganizationService);
  });

  it('creates builder organization, company, and owner invitation', () => {
    const result = service.createBuilderOrganization({
      legalName: 'Acme Construction Ltd',
      tradingName: 'Acme',
      primaryContactName: 'Ada Builder',
      primaryContactEmail: 'ada@acme.test',
      inviteOwner: true,
    });

    expect(result.organizationId).toBeTruthy();
    expect(result.builderCompanyId).toBeTruthy();
    expect(result.invitationId).toBeTruthy();
    expect(result.invitationToken).toBeTruthy();

    const company = service.getCompanyByOrganizationId(result.organizationId);
    expect(company?.legalName).toBe('Acme Construction Ltd');
    expect(company?.status).toBe('pending');

    const invitations = service.listInvitations(result.organizationId);
    expect(invitations.length).toBe(1);
    expect(invitations[0].invitedRole).toBe('builder_owner');
    expect(invitations[0].status).toBe('pending');
  });

  it('accepts a valid invitation and activates the company', () => {
    const created = service.createBuilderOrganization({
      legalName: 'River Homes',
      primaryContactName: 'River Owner',
      primaryContactEmail: 'owner@river.test',
    });

    const accepted = service.acceptInvitation(created.invitationToken!);
    expect(accepted?.status).toBe('accepted');
    expect(service.getCompanyByOrganizationId(created.organizationId)?.status).toBe('active');
  });

  it('resends invitation with a new token', () => {
    const created = service.createBuilderOrganization({
      legalName: 'Resend Co',
      primaryContactName: 'Resend Owner',
      primaryContactEmail: 'resend@co.test',
    });

    const originalToken = created.invitationToken!;
    const resent = service.resendInvitation(created.invitationId!);

    expect(resent).toBeTruthy();
    expect(resent!.token).not.toBe(originalToken);
    expect(resent!.resendCount).toBe(1);
    expect(service.getInvitationByToken(originalToken)).toBeUndefined();
  });

  it('inviteBuilderOwner reuses pending invitation via resend', () => {
    const created = service.createBuilderOrganization({
      legalName: 'Invite Co',
      primaryContactName: 'Invite Owner',
      primaryContactEmail: 'invite@co.test',
    });

    const invited = service.inviteBuilderOwner(created.organizationId);
    expect(invited?.token).toBeTruthy();
    expect(invited?.token).not.toBe(created.invitationToken);
  });
});
