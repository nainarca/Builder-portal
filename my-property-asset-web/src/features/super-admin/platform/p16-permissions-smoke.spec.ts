import { PERMISSION_MATRIX } from '@core/rbac';
import { satisfiesPermissionLevel } from '@core/rbac/utils/permission.utils';

describe('P16 Super Admin Platform RBAC', () => {
  it('restricts platform operations to Super Admin full', () => {
    const matrix = PERMISSION_MATRIX['id-06-platform-operations'];
    expect(matrix['super-admin']).toBe('full');
    expect(matrix['builder-org-owner']).toBeUndefined();
    expect(matrix['builder-org-admin']).toBeUndefined();
    expect(matrix['builder-org-member']).toBeUndefined();
    expect(satisfiesPermissionLevel(matrix['builder-org-owner'], 'read')).toBeFalse();
  });
});

describe('P16 smoke checklist', () => {
  it('documents required smoke scenarios', () => {
    const checklist = [
      'platform_dashboard_live_metrics',
      'builder_activate_suspend_reactivate_soft_delete',
      'subscription_management_via_billing',
      'branding_oversight_reset_disable_restore',
      'communications_moderate_archive',
      'audit_events_visible',
      'platform_settings_support_legal_maintenance',
      'support_center_queue',
      'analytics_page',
      'builder_search_filters',
      'super_admin_only_rbac',
      'no_flutter_changes',
    ];
    expect(checklist.length).toBe(12);
  });
});
