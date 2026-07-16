/**
 * P7 smoke checklist — run manually after applying Batch 2 SQL and serving the app.
 *
 * 1. Super Admin → /super-admin/builders → Create builder with owner email
 * 2. Copy invitation token from create/detail banner
 * 3. Sign in as invited user (or any authenticated user in mock mode)
 * 4. Open /auth/builder-invitation?token=<token> → Accept
 * 5. Land on /builder-portal dashboard
 * 6. Open /builder-portal/company and /builder-portal/settings
 * 7. Super Admin → builder detail → Resend invitation → new token works; old fails
 * 8. Super Admin → Deactivate → builder status inactive
 * 9. Sign in with JWT role owner → /auth/portal-unavailable with Builder-only message
 * 10. Confirm Projects UI was not newly implemented in P7 (existing mock routes may remain)
 */
describe('P7 smoke checklist', () => {
  it('documents the vertical-slice smoke path', () => {
    expect(true).toBeTrue();
  });
});
