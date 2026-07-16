import { normalizeRole } from './permission.utils';

describe('normalizeRole (P7)', () => {
  it('maps DB builder_owner to Angular builder-org-owner', () => {
    expect(normalizeRole('builder_owner')).toBe('builder-org-owner');
  });

  it('maps builder-admin aliases', () => {
    expect(normalizeRole('builder_admin')).toBe('builder-org-admin');
    expect(normalizeRole('builder-admin')).toBe('builder-org-admin');
  });

  it('maps builder staff aliases', () => {
    expect(normalizeRole('builder_staff')).toBe('builder-org-member');
    expect(normalizeRole('builder_member')).toBe('builder-org-member');
  });

  it('preserves Schema V2 owner and tenant roles', () => {
    expect(normalizeRole('owner')).toBe('owner');
    expect(normalizeRole('tenant')).toBe('tenant');
  });

  it('returns null for empty values', () => {
    expect(normalizeRole(null)).toBeNull();
    expect(normalizeRole('')).toBeNull();
    expect(normalizeRole(42)).toBeNull();
  });
});
