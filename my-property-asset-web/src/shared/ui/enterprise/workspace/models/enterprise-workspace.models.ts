/** UI-IMP-06 — Workspace, settings & global UX presentation models. */

export interface EnterpriseWorkspaceInfo {
  readonly id?: string;
  readonly name: string;
  readonly subtitle?: string;
}

export interface EnterpriseUserProfileData {
  readonly displayName?: string;
  readonly email: string;
  readonly organizationName?: string;
  readonly avatarUrl?: string | null;
  readonly roleLabel?: string;
  readonly sessionLabel?: string;
}

export interface EnterpriseSettingsNavItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: string;
  readonly href?: string;
  readonly active?: boolean;
}

export interface EnterpriseNotificationItemData {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly timestamp?: string;
  readonly unread?: boolean;
  readonly group?: string;
  readonly icon?: string;
}

export interface EnterpriseBrandPreviewData {
  readonly displayName: string;
  readonly shortName?: string;
  readonly logoUrl?: string | null;
  readonly primaryColor?: string;
  readonly secondaryColor?: string;
  readonly tagline?: string;
}
