import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { MessageComponent } from '../../primitives/message/message.component';
import { InlineMessageComponent } from '../../composites/notification/inline-message.component';
import { ToastWrapperComponent } from '../../composites/notification/toast-wrapper.component';
import { EnterpriseAlertSeverity } from '../models/enterprise.models';

@Component({
  selector: 'app-enterprise-alert',
  imports: [MessageComponent],
  template: `
    <app-message
      [severity]="mappedSeverity()"
      [text]="message()"
      [icon]="icon()"
      [closable]="closable()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseAlertComponent {
  readonly message = input.required<string>();
  readonly severity = input<EnterpriseAlertSeverity>('information');
  readonly icon = input<string | undefined>(undefined);
  readonly closable = input(false);

  mappedSeverity(): 'success' | 'info' | 'warn' | 'error' {
    switch (this.severity()) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warn';
      case 'error':
        return 'error';
      case 'information':
      default:
        return 'info';
    }
  }
}

@Component({
  selector: 'app-success-alert',
  imports: [EnterpriseAlertComponent],
  template: `<app-enterprise-alert severity="success" [message]="message()" [closable]="closable()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessAlertComponent {
  readonly message = input.required<string>();
  readonly closable = input(false);
}

@Component({
  selector: 'app-warning-alert',
  imports: [EnterpriseAlertComponent],
  template: `<app-enterprise-alert severity="warning" [message]="message()" [closable]="closable()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningAlertComponent {
  readonly message = input.required<string>();
  readonly closable = input(false);
}

@Component({
  selector: 'app-information-alert',
  imports: [EnterpriseAlertComponent],
  template: `<app-enterprise-alert severity="information" [message]="message()" [closable]="closable()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationAlertComponent {
  readonly message = input.required<string>();
  readonly closable = input(false);
}

@Component({
  selector: 'app-error-alert',
  imports: [EnterpriseAlertComponent],
  template: `<app-enterprise-alert severity="error" [message]="message()" [closable]="closable()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorAlertComponent {
  readonly message = input.required<string>();
  readonly closable = input(false);
}

@Component({
  selector: 'app-inline-alert',
  imports: [InlineMessageComponent],
  template: `
    <app-inline-message [severity]="severity()" [text]="message()" [icon]="icon()" [closable]="closable()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineAlertComponent {
  readonly message = input.required<string>();
  readonly severity = input<'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'>('info');
  readonly icon = input<string | undefined>(undefined);
  readonly closable = input(false);
}

@Component({
  selector: 'app-enterprise-toast-wrapper',
  imports: [ToastWrapperComponent],
  template: `<app-toast-wrapper />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterpriseToastWrapperComponent {}
