import { PERMISSION_MATRIX } from '@core/rbac';
import { satisfiesPermissionLevel } from '@core/rbac/utils/permission.utils';

describe('P15 Subscription RBAC', () => {
  const matrix = PERMISSION_MATRIX['id-05-subscription-commercial'];

  it('grants Super Admin full control', () => {
    expect(matrix['super-admin']).toBe('full');
    expect(satisfiesPermissionLevel(matrix['super-admin'], 'full')).toBeTrue();
  });

  it('grants Builder Owner renew/upgrade (operate)', () => {
    expect(matrix['builder-org-owner']).toBe('operate');
    expect(satisfiesPermissionLevel(matrix['builder-org-owner'], 'operate')).toBeTrue();
  });

  it('grants Builder Admin view only (read)', () => {
    expect(matrix['builder-org-admin']).toBe('read');
    expect(satisfiesPermissionLevel(matrix['builder-org-admin'], 'operate')).toBeFalse();
  });

  it('denies Builder Staff (no matrix entry)', () => {
    expect(matrix['builder-org-member']).toBeUndefined();
    expect(satisfiesPermissionLevel(matrix['builder-org-member'], 'read')).toBeFalse();
  });
});
