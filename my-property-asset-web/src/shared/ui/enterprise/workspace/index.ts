export type {
  EnterpriseBrandPreviewData,
  EnterpriseNotificationItemData,
  EnterpriseSettingsNavItem,
  EnterpriseUserProfileData,
  EnterpriseWorkspaceInfo,
} from './models/enterprise-workspace.models';

export { EnterpriseWorkspaceSwitcherComponent } from './workspace-switcher.component';
export {
  EnterpriseUserProfileCardComponent,
  toUserProfileCardData,
} from './user-profile-card.component';
export { EnterpriseSettingsNavigationComponent } from './settings-navigation.component';
export { EnterpriseSettingsSectionComponent } from './settings-section.component';
export { EnterpriseNotificationItemComponent } from './notification-item.component';
export { EnterpriseNotificationCenterComponent } from './notification-center.component';
export { EnterpriseBrandPreviewComponent } from './brand-preview.component';
export { EnterpriseHelpCenterComponent } from './help-center.component';
export {
  EnterpriseConfirmationDialogComponent,
  EnterpriseGlobalToastComponent,
} from './global-feedback.component';
export { SuccessDialogComponent, WarningDialogComponent } from './global-dialogs.component';

/**
 * Blueprint deliverable aliases (UI-IMP-06).
 * ConfirmationDialogComponent / ToastHostComponent remain the composites/primitives
 * sources of truth — enterprise aliases use Enterprise* / GlobalToast names to avoid
 * barrel collisions with `app-confirmation-dialog` / `app-toast-host`.
 */
export { EnterpriseWorkspaceSwitcherComponent as WorkspaceSwitcherComponent } from './workspace-switcher.component';
export { EnterpriseUserProfileCardComponent as UserProfileCardComponent } from './user-profile-card.component';
export { EnterpriseSettingsNavigationComponent as SettingsNavigationComponent } from './settings-navigation.component';
export { EnterpriseSettingsSectionComponent as SettingsSectionComponent } from './settings-section.component';
export { EnterpriseNotificationCenterComponent as NotificationCenterComponent } from './notification-center.component';
export { EnterpriseNotificationItemComponent as NotificationItemComponent } from './notification-item.component';
export { EnterpriseBrandPreviewComponent as BrandPreviewComponent } from './brand-preview.component';
export { EnterpriseHelpCenterComponent as HelpCenterComponent } from './help-center.component';
export { EnterpriseGlobalToastComponent as GlobalToastComponent } from './global-feedback.component';
