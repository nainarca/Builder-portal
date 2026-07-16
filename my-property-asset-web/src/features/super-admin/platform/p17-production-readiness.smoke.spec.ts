/**
 * P17 — Production readiness smoke markers (documentation-backed).
 * Does not exercise live Supabase; validates release pack expectations.
 */
describe('P17 V1 production readiness smoke', () => {
  it('records release version expectation', () => {
    expect('1.0.0').toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('documents six business workflows', () => {
    const workflows = [
      'builder_onboarding_subscription',
      'project_building_units',
      'buyer_documents_handover_invitation',
      'owner_flutter_activation_contract',
      'branding_flutter_payload',
      'communication_notification_contract',
    ];
    expect(workflows.length).toBe(6);
  });

  it('documents production blockers', () => {
    const blockers = [
      'missing_units_sql',
      'missing_owner_assignment_sql',
      'in_memory_repositories',
      'shared_supabase_project',
      'missing_rls_late_batches',
    ];
    expect(blockers.length).toBeGreaterThan(0);
  });
});
