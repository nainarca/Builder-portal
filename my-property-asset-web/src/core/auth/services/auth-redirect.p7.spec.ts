import {
  AUTH_PORTAL_UNAVAILABLE_MESSAGE,
  AUTH_PORTAL_UNAVAILABLE_REDIRECT,
} from '../constants/auth.constants';
import { AuthRedirectService } from './auth-session.service';

/**
 * Lightweight integration smoke for P7 post-login home resolution.
 * Full AuthRedirectService DI is covered in app runtime; this locks the contract.
 */
describe('P7 auth redirect contracts', () => {
  it('exposes the Builder/Admin-only portal message', () => {
    expect(AUTH_PORTAL_UNAVAILABLE_MESSAGE).toContain('Builder organizations');
  });

  it('routes portal-unavailable to /auth/portal-unavailable', () => {
    expect(AUTH_PORTAL_UNAVAILABLE_REDIRECT).toBe('/auth/portal-unavailable');
  });

  it('AuthRedirectService.resolveHomeForPortals prefers Super Admin then Builder', () => {
    const service = Object.create(AuthRedirectService.prototype) as AuthRedirectService;

    expect(
      service.resolveHomeForPortals(['portal:super-admin', 'portal:builder-portal']),
    ).toBe('/super-admin');

    expect(service.resolveHomeForPortals(['portal:builder-portal'])).toBe('/builder-portal');

    expect(service.resolveHomeForPortals([])).toBe('/auth/portal-unavailable');
  });
});
