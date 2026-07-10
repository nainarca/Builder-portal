import type { FeedbackSeverity } from './feedback.model';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface DialogAction {
  label: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';
  outlined?: boolean;
  text?: boolean;
  autofocus?: boolean;
}

export interface ConfirmationDialogConfig {
  title: string;
  message: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptSeverity?: DialogAction['severity'];
  rejectSeverity?: DialogAction['severity'];
}

export interface AlertDialogConfig {
  title: string;
  message: string;
  icon?: string;
  acceptLabel?: string;
  severity?: FeedbackSeverity;
}

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerConfig {
  title?: string;
  position?: DrawerPosition;
  size?: DialogSize;
  dismissible?: boolean;
  modal?: boolean;
}
