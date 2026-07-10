export type ApplicationEventType =
  | 'application.started'
  | 'application.config.loaded'
  | 'navigation.completed'
  | 'theme.mode.changed'
  | 'theme.brand.applied'
  | 'configuration.changed'
  | 'feature-flag.changed'
  | 'preferences.synchronized'
  | 'preferences.language.changed'
  | 'ui.action'
  | 'lifecycle.route'
  | 'domain.event'
  | 'auth.signedIn'
  | 'auth.signedOut'
  | 'auth.sessionRefreshed'
  | 'auth.sessionExpired'
  | 'auth.sessionIdleWarning'
  | 'auth.sessionIdleExpired'
  | 'auth.sessionRecovering'
  | 'auth.sessionRecoveryComplete'
  | 'auth.passwordResetRequested'
  | 'rbac.permissionChanged'
  | 'rbac.roleChanged'
  | 'rbac.contextChanged'
  | 'rbac.authorizationFailed'
  | 'rbac.authorizationGranted'
  | 'organization.contextResolved'
  | 'organization.contextChanged'
  | 'organization.contextCleared'
  | 'organization.switched'
  | 'organization.switchFailed';

export interface ApplicationEvent<TPayload = unknown> {
  type: ApplicationEventType;
  payload?: TPayload;
  timestamp: number;
  correlationId?: string;
}

export interface DomainEvent<TPayload = unknown> extends ApplicationEvent<TPayload> {
  aggregateId?: string;
  aggregateType?: string;
}

export type EventUnsubscribe = () => void;
