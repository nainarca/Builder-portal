import { PlatformOperatorService } from './platform-operator.service';
import { RoleService } from './role.service';

describe('AUTH-01 RoleService platform operator precedence', () => {
  it('grants super-admin portals when PlatformOperatorService reports super_admin', () => {
    const platformOperators = {
      isSuperAdmin: () => true,
    } as PlatformOperatorService;

    const authContext = {
      user: () => ({
        id: 'user-1',
        email: 'admin@example.com',
        metadata: { role: 'owner' },
      }),
    };

    const currentOrganization = {
      snapshot: () => ({
        organizationId: 'personal-org',
        organizationName: 'Personal',
        organizationType: 'owner',
        role: 'owner',
      }),
    };

    const roleService = Object.create(RoleService.prototype) as RoleService;
    Object.assign(roleService, {
      authContext,
      currentOrganization,
      platformOperators,
    });

    const context = roleService.resolveUserContext();
    expect(context.role).toBe('super-admin');
    expect(context.portals).toContain('portal:super-admin');
  });

  it('maps personal owner metadata to public-visitor when not a platform operator', () => {
    const platformOperators = {
      isSuperAdmin: () => false,
    } as PlatformOperatorService;

    const authContext = {
      user: () => ({
        id: 'user-2',
        email: 'owner@example.com',
        metadata: { role: 'owner' },
      }),
    };

    const currentOrganization = {
      snapshot: () => ({
        organizationId: null,
        organizationName: null,
        organizationType: null,
        role: null,
      }),
    };

    const roleService = Object.create(RoleService.prototype) as RoleService;
    Object.assign(roleService, {
      authContext,
      currentOrganization,
      platformOperators,
    });

    const context = roleService.resolveUserContext();
    expect(context.role).toBe('public-visitor');
    expect(context.portals).toEqual([]);
  });
});
