export type NotificationLevel = 'success' | 'info' | 'warning' | 'error';

export interface ActionNotification {
  summary: string;
  detail?: string;
  actionLabel: string;
  level?: NotificationLevel;
}

export interface InlineNotificationState {
  level: NotificationLevel;
  message: string;
  dismissible?: boolean;
}
